// Public contact details shared by the website and server-side inquiry routing.
export const CONTACT_EMAIL = "inquiries@thepassconsulting.com";
export const INQUIRY_SUBJECT_PREFIX = "[The Pass website]";
export const INQUIRY_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${INQUIRY_SUBJECT_PREFIX} Inquiry`)}`;
