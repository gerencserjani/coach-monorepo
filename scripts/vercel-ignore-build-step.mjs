// Ignored Build Step for a coach app's Vercel project. Vercel's own
// "skip deployments with no changes to the root directory or its
// dependencies" infers dependencies from the package manager's graph, but
// apps/* consume @coaching/core through a Vite/TS path alias, not a real
// package.json dependency -- so Vercel can't see that a shared-package
// change affects a given app. This asks Nx's own project graph instead,
// which already knows about that dependency (confirmed: a change to only
// packages/coaching-core correctly marks every app that imports it as
// affected).
//
// Runs as each app's Vercel "Ignored Build Step" (Project Settings > Git,
// or this app's own vercel.json "ignoreCommand"), with that app's Root
// Directory as cwd -- so it reads *that* app's own package.json name
// rather than taking it as an argument, letting every coach app (including
// ones scaffolded later by create-coach-app.mjs) use the exact same command
// unmodified.
//
// Exit codes match Vercel's ignoreCommand contract: 1 continues the build,
// 0 skips it.
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const { name: projectName } = JSON.parse(
  readFileSync("./package.json", "utf8"),
);
const { VERCEL_GIT_PREVIOUS_SHA, VERCEL_GIT_COMMIT_SHA } = process.env;

if (!VERCEL_GIT_PREVIOUS_SHA) {
  console.log(
    "No previous deployment to diff against (first deploy, or history was rewritten) -- building.",
  );
  process.exit(1);
}

let affected;
try {
  const output = execSync(
    `npx nx show projects --affected --base=${VERCEL_GIT_PREVIOUS_SHA} --head=${VERCEL_GIT_COMMIT_SHA}`,
    { encoding: "utf8" },
  );
  affected = JSON.parse(output);
} catch (err) {
  console.error(
    "Could not determine Nx's affected projects -- building to be safe.",
    err.message,
  );
  process.exit(1);
}

if (affected.includes(projectName)) {
  console.log(`${projectName} is affected -- building.`);
  process.exit(1);
}

console.log(`${projectName} is not affected -- skipping build.`);
process.exit(0);
