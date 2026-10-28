import { fireEvent, render, screen, within } from "@testing-library/react";
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

// jsdom doesn't implement ResizeObserver either -- QualificationGallery's
// scroll-affordance tracking needs the constructor to exist.
class FakeResizeObserver {
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
  vi.stubGlobal("ResizeObserver", FakeResizeObserver);
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
  it("renders the bio heading and the thematic subheadings", () => {
    renderAbout();
    expect(screen.getByRole("heading", { name: "Rólam" })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Honnan indultam" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "A szakmai utam" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Amit ma vallok" }),
    ).toBeVisible();
    expect(screen.getByText("Teszt bekezdés 1.")).toBeVisible();
    expect(screen.getByText("Teszt bekezdés 5.")).toBeVisible();
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

  it("renders a placeholder card for a qualification that has no image yet", () => {
    renderAbout();
    const pendingCard = screen.getByRole("button", {
      name: /Pending Qualification/,
    });
    expect(within(pendingCard).getByText("Kép hamarosan")).toBeVisible();
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
    expect(within(dialog).getByText("Test Issuer · 2024")).toBeVisible();
    expect(
      within(dialog).getByRole("link", { name: "PDF megnyitása" }),
    ).toHaveAttribute("href", "/test-qualification.pdf");
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

  it("shows a scroll-next control once the gallery actually overflows, and scroll-prev after scrolling", async () => {
    renderAbout();
    // jsdom never computes real layout, so scrollWidth/clientWidth are
    // always 0 -- stub them to simulate a gallery wider than its viewport,
    // then fire the scroll listener the component uses to recompute.
    const scroller = screen.getByTestId("qualification-scroller");
    Object.defineProperty(scroller, "scrollWidth", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(scroller, "clientWidth", {
      configurable: true,
      value: 400,
    });
    Object.defineProperty(scroller, "scrollLeft", {
      configurable: true,
      writable: true,
      value: 0,
    });

    expect(
      screen.queryByRole("button", { name: "Következő képzések" }),
    ).not.toBeInTheDocument();

    fireEvent(scroller, new Event("scroll"));

    expect(
      screen.getByRole("button", { name: "Következő képzések" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Előző képzések" }),
    ).not.toBeInTheDocument();

    scroller.scrollLeft = 200;
    fireEvent(scroller, new Event("scroll"));

    expect(
      screen.getByRole("button", { name: "Előző képzések" }),
    ).toBeVisible();
  });

  it("omits the qualifications heading and gallery when there are none", () => {
    renderAbout({ ...testCoachConfig, qualifications: [] });
    expect(
      screen.queryByText("Képzéseim és végzettségeim"),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
