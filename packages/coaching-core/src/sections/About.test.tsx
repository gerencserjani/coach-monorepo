import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import About from "./About.tsx";
import CoachConfigProvider from "../CoachConfigProvider.tsx";
import { testCoachConfig } from "../test/fixtures/coachConfig.ts";
import type { CoachConfig } from "../CoachConfig.ts";
import i18n from "../i18n";

function renderAbout(config: CoachConfig = testCoachConfig) {
  return render(
    <CoachConfigProvider config={config}>
      <About />
    </CoachConfigProvider>,
  );
}

// jsdom doesn't implement IntersectionObserver -- About's reveal-on-scroll
// wrapper needs the constructor to exist, same stub as
// hooks/useRevealOnScroll.test.tsx; this test doesn't care about the
// visibility state it drives, just that mounting doesn't throw.
class FakeIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

beforeEach(async () => {
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  await i18n.changeLanguage("hu");
});

describe("About", () => {
  it("renders the bio heading, defaults to the first tab, and shows its paragraphs", () => {
    renderAbout();
    expect(screen.getByRole("heading", { name: "Rólam" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Honnan indultam" }),
    ).toHaveAttribute("aria-current", "true");
    expect(screen.getByText("Teszt bekezdés 1.")).toBeVisible();
  });

  it("switches the visible content when a different subheading tab is clicked", async () => {
    renderAbout();
    expect(screen.queryByText("Teszt bekezdés 5.")).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Amit ma vallok" }),
    );

    expect(screen.getByText("Teszt bekezdés 5.")).toBeVisible();
    expect(screen.queryByText("Teszt bekezdés 1.")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Amit ma vallok" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("shows a photo placeholder when the coach has no aboutImage configured yet", () => {
    renderAbout();
    expect(
      screen.queryByRole("img", { name: "Teszt coach portréja" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Fotó hamarosan")).toBeVisible();
  });

  it("renders the real photo once aboutImage is configured", () => {
    renderAbout({
      ...testCoachConfig,
      aboutImage: { src: "/test-about.webp" },
    });
    expect(
      screen.getByRole("img", { name: "Teszt coach portréja" }),
    ).toBeVisible();
    expect(screen.queryByText("Fotó hamarosan")).not.toBeInTheDocument();
  });

  it("lists the qualifications as plain text under their own tab, with no gallery or images", async () => {
    renderAbout();
    const tab = screen.getByRole("button", { name: "Képzettségeim" });
    expect(screen.queryByText("Test Qualification")).not.toBeInTheDocument();

    await userEvent.click(tab);

    expect(screen.getByText("Test Qualification")).toBeVisible();
    expect(screen.getByText("Test Issuer · 2024")).toBeVisible();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("omits the qualifications tab entirely when there are none", () => {
    renderAbout({ ...testCoachConfig, qualifications: [] });
    expect(
      screen.queryByRole("button", { name: "Képzettségeim" }),
    ).not.toBeInTheDocument();
  });
});
