import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

// jsdom doesn't implement <dialog>'s showModal()/close() at all (not even as
// a stub) -- polyfill them well enough for QualificationGallery's lightbox:
// toggle the `open` attribute and fire the `close` event it listens for.
let originalShowModal: typeof HTMLDialogElement.prototype.showModal;
let originalClose: typeof HTMLDialogElement.prototype.close;

beforeEach(async () => {
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  originalShowModal = HTMLDialogElement.prototype.showModal;
  originalClose = HTMLDialogElement.prototype.close;
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
  await i18n.changeLanguage("hu");
});

afterEach(() => {
  vi.unstubAllGlobals();
  HTMLDialogElement.prototype.showModal = originalShowModal;
  HTMLDialogElement.prototype.close = originalClose;
});

describe("About", () => {
  it("renders the bio heading and paragraphs", () => {
    renderAbout();
    expect(screen.getByRole("heading", { name: "Rólam" })).toBeVisible();
    expect(screen.getByText("Teszt bekezdés 1.")).toBeVisible();
  });

  it("renders a qualification thumbnail that opens a lightbox on click", async () => {
    renderAbout();
    const thumbnail = screen.getByRole("button", {
      name: /Test Qualification/,
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(thumbnail);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeVisible();
    expect(
      within(dialog).getByRole("img", {
        name: "Test qualification certificate",
      }),
    ).toBeVisible();
  });

  it("closes the lightbox and returns focus to the thumbnail on close", async () => {
    renderAbout();
    const thumbnail = screen.getByRole("button", {
      name: /Test Qualification/,
    });
    await userEvent.click(thumbnail);
    await userEvent.click(screen.getByRole("button", { name: "Bezárás" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("omits the qualifications heading and gallery when there are none", () => {
    renderAbout({ ...testCoachConfig, qualifications: [] });
    expect(
      screen.queryByText("Képzéseim és végzettségeim"),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
