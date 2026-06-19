// Central legal values for the privacy & terms pages.
//
// ⚠️ PLACEHOLDERS PENDING CLIENT DATA — fill these three before sharing the
// site publicly. They are the only values not yet finalized; everything else
// is real. Search for "PENDING" to find them.
export const PENDING = true; // flip to false once the three values below are real

// Client legal entity acting as Data Controller (NOT Designli — this is a client product).
export const COMPANY_NAME = "[Client legal entity — PENDING]";

// Where data-deletion / GDPR requests go.
export const CONTACT_EMAIL = "[legal contact email — PENDING]";

// Registered business address for the data-controller block.
export const BUSINESS_ADDRESS = "[registered business address — PENDING]";

// --- Finalized values ---
export const PRODUCT_NAME = "Buck Hub";
export const EFFECTIVE_DATE = "2026-06-19";
export const AGE_OF_CONSENT = "18";
export const APP_TYPE = "Free"; // waitlist phase
export const PLATFORM = "Web App"; // waitlist phase

// Third-party services actually in use during the waitlist phase.
export const THIRD_PARTY_PRIVACY = [
  { name: "PostHog", url: "https://posthog.com/privacy" },
  { name: "Vercel", url: "https://vercel.com/legal/privacy-policy" },
];
export const THIRD_PARTY_TERMS = [
  { name: "PostHog", url: "https://posthog.com/terms" },
  { name: "Vercel", url: "https://vercel.com/legal/terms" },
];
