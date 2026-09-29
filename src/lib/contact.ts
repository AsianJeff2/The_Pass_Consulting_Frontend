// Public contact details shared by the website and server-side inquiry routing.
export const CONTACT_EMAIL = "inquiries@thepassconsulting.com";
export const INQUIRY_SUBJECT_PREFIX = "[The Pass website]";
export const INQUIRY_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${INQUIRY_SUBJECT_PREFIX} Inquiry`)}`;
export const INQUIRY_GMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(`${INQUIRY_SUBJECT_PREFIX} Inquiry`)}`;
