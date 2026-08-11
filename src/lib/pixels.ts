// Fires the equivalent conversion event on both Meta and TikTok pixels.
// Each platform is checked independently so a missing/unloaded pixel (e.g. no
// NEXT_PUBLIC_META_PIXEL_ID set) never blocks the other from firing.

type PixelParams = Record<string, unknown>;

type EventNames = {
  meta: string;
  tiktok: string;
};

function fireMeta(event: string, params?: PixelParams) {
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", event, params);
    }
  } catch {
    // Third-party global — never let a tracking failure break the UI.
  }
}

function fireTikTok(event: string, params?: PixelParams) {
  try {
    if (typeof window !== "undefined" && typeof window.ttq?.track === "function") {
      window.ttq.track(event, params);
    }
  } catch {
    // Third-party global — never let a tracking failure break the UI.
  }
}

function track({ meta, tiktok }: EventNames, params?: PixelParams) {
  fireMeta(meta, params);
  fireTikTok(tiktok, params);
}

/** Contact form submitted. */
export function trackLead(params?: PixelParams) {
  track({ meta: "Lead", tiktok: "SubmitForm" }, params);
}

/** Newsletter signup completed. */
export function trackSubscribe(params?: PixelParams) {
  track({ meta: "CompleteRegistration", tiktok: "CompleteRegistration" }, params);
}

/** Careers application submitted. */
export function trackSubmitApplication(params?: PixelParams) {
  track({ meta: "SubmitApplication", tiktok: "SubmitForm" }, params);
}

/** WhatsApp contact link clicked. */
export function trackContact(params?: PixelParams) {
  track({ meta: "Contact", tiktok: "Contact" }, params);
}
