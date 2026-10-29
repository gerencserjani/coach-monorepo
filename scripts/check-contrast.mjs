// Automates docs/new-coach-runbook.md step 4: checks every ink/ink-soft +
// bg/bg-card/bg-panel pairing in an app's src/index.css against WCAG AA
// (4.5:1 for normal text), in both light and dark mode. Replaces doing this
// by hand against WebAIM's contrast checker -- see --ink-soft's own comment
// in apps/betti/src/index.css for why this has already mattered once.
//
// Usage: node scripts/check-contrast.mjs [coach-slug]
//   No slug: checks every app under apps/*.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const AA_NORMAL_TEXT_RATIO = 4.5;
const TEXT_VARS = ["ink", "ink-soft"];
const BG_VARS = ["bg", "bg-card", "bg-panel"];

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const appsDir = join(repoRoot, "apps");

function parseVars(blockText) {
  const vars = new Map();
  for (const match of blockText.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})/g)) {
    vars.set(match[1], match[2]);
  }
  return vars;
}

function extractThemeBlocks(css) {
  const light = css.match(/:root,\s*\[data-theme="light"\]\s*{([^}]*)}/);
  const dark = css.match(/\[data-theme="dark"\]\s*{([^}]*)}/);
  if (!light || !dark) {
    throw new Error(
      'Could not find both the light (":root, [data-theme=\\"light\\"]") and dark ("[data-theme=\\"dark\\"]") custom-property blocks.',
    );
  }
  return {
    light: parseVars(light[1]),
    dark: parseVars(dark[1]),
  };
}

function hexToRgb(hex) {
  let h = hex.slice(1);
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(h.slice(0, 6), 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function srgbChannelToLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbChannelToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hexA, hexB) {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

function checkApp(slug) {
  const cssPath = join(appsDir, slug, "src", "index.css");
  if (!existsSync(cssPath)) {
    console.log(`  (skipping ${slug} -- no src/index.css)`);
    return [];
  }

  const css = readFileSync(cssPath, "utf8");
  const themes = extractThemeBlocks(css);
  const failures = [];

  for (const [themeName, vars] of Object.entries(themes)) {
    for (const textVar of TEXT_VARS) {
      for (const bgVar of BG_VARS) {
        const textHex = vars.get(textVar);
        const bgHex = vars.get(bgVar);
        if (!textHex || !bgHex) {
          failures.push(
            `${slug} (${themeName}): missing --${textVar} or --${bgVar}`,
          );
          continue;
        }
        const ratio = contrastRatio(textHex, bgHex);
        const pass = ratio >= AA_NORMAL_TEXT_RATIO;
        console.log(
          `  ${pass ? "✓" : "✗"} ${slug} (${themeName}): --${textVar} on --${bgVar} = ${ratio.toFixed(2)}:1`,
        );
        if (!pass) {
          failures.push(
            `${slug} (${themeName}): --${textVar} (${textHex}) on --${bgVar} (${bgHex}) is ${ratio.toFixed(2)}:1, below the ${AA_NORMAL_TEXT_RATIO}:1 WCAG AA minimum for normal text`,
          );
        }
      }
    }
  }

  return failures;
}

const requestedSlug = process.argv[2];
const slugs = requestedSlug
  ? [requestedSlug]
  : readdirSync(appsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

if (slugs.length === 0) {
  console.error("No apps found under apps/.");
  process.exit(1);
}

const allFailures = [];
for (const slug of slugs) {
  console.log(`Checking ${slug}...`);
  allFailures.push(...checkApp(slug));
}

if (allFailures.length > 0) {
  console.error("\nContrast check failed:");
  for (const failure of allFailures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log("\nAll pairings meet WCAG AA (4.5:1) for normal text.");
