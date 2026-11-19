/**
 * Single source of truth for every piece of wedding text and event data.
 * Components must read from here — no wedding text is hard-coded elsewhere.
 *
 * Each event's `venue` / `mapUrl` show on its card (hidden when empty).
 * Empty values are hidden automatically (no placeholder text is shown).
 */

export type EventTheme = 'haldi' | 'reception' | 'baarat';

export interface WeddingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  /** ISO 8601 start time, always with the IST offset (+05:30). */
  isoStart: string;
  quote: string;
  theme: EventTheme;
  venue: string;
  mapUrl: string;
}

/**
 * The main celebration venue (Haldi-Carnival and Reception).
 * The venue QR code is generated from mapUrl by `npm run assets`.
 */
const VENUE = {
  name: "Jai Chandragarh Palace",
  address: "Near Police Station, Mandore, Jodhpur.",
  mapUrl: "https://maps.app.goo.gl/tvnQx9Tcj1kFTa986?g_st=ac",
};
const VENUE_LINE = `${VENUE.name}, ${VENUE.address}`;

/** Where the Baarat Prasthan sets off from. */
const BAARAT_VENUE = {
  name: "Hotel Avon",
  address: "Mandore, Jodhpur.",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Avon+Mandore+Jodhpur",
};

export const wedding = {
  invocation: "|| श्री गणेशाय नमः ||",
  blessingLine: "With the blessings of Lord Ganesha",
  teaser: "A wedding celebration awaits...",
  groom: "DEVEN",
  bride: "ADITI",
  /** Joins the names: DEVEN & ADITI */
  joiner: "&",
  openButton: "OPEN WEDDING INVITATION",

  hero: {
    familiesLine: "Together with our families,",
    inviteLine: "We joyfully invite you to celebrate the wedding of",
    quote: "Two hearts, one beautiful journey, and a lifetime of togetherness.",
  },

  eventsHeading: "Wedding Celebrations",
  eventsSubheading: "Three beautiful occasions, countless unforgettable memories.",

  events: [
    {
      id: "haldi",
      title: "HALDI-CARNIVAL",
      date: "10 December 2026",
      time: "12:00 PM",
      isoStart: "2026-12-10T12:00:00+05:30",
      quote: "An afternoon filled with colours, laughter, blessings and the warmth of turmeric.",
      theme: "haldi",
      venue: VENUE_LINE,
      mapUrl: VENUE.mapUrl,
    },
    {
      id: "reception",
      title: "RECEPTION",
      date: "10 December 2026",
      time: "6:30 PM",
      isoStart: "2026-12-10T18:30:00+05:30",
      quote: "An evening of celebration, love, happiness and togetherness.",
      theme: "reception",
      venue: VENUE_LINE,
      mapUrl: VENUE.mapUrl,
    },
    {
      id: "baarat",
      title: "BAARAT PRASTHAN",
      date: "12 December 2026",
      time: "7:00 PM",
      isoStart: "2026-12-12T19:00:00+05:30",
      quote: "With music, celebration and blessings, the journey towards a beautiful new beginning begins.",
      theme: "baarat",
      venue: `${BAARAT_VENUE.name}, ${BAARAT_VENUE.address}`,
      mapUrl: BAARAT_VENUE.mapUrl,
    },
  ] satisfies WeddingEvent[] as WeddingEvent[],

  countdown: {
    heading: "Counting Down to Forever",
    target: "2026-12-12T19:00:00+05:30", // Baarat Prasthan, Indian Standard Time
  },

  blessings: {
    heading: "Your Presence Will Make Our Celebration Even More Special",
    message: "With love, joy, and the blessings of our families, we look forward to celebrating these beautiful moments with you.",
    signOff: "With Love & Warm Regards",
    footer: "Made with Love",
  },

  venue: {
    ...VENUE,
    heading: "Venue",
    /** Which celebrations take place here (Baarat Prasthan has its own venue). */
    occasions: "Haldi-Carnival & Reception",
    qrAlt: "QR code — opens the venue location in Google Maps",
    qrHint: "Scan or tap the code to open the location",
    directions: "Get Directions",
  },

  /** Personalised lines, used only when the link has ?guest=Name */
  personal: {
    greeting: "Dear {name},",
    honoured: "We would be honoured by your presence, {name}",
  },

  /** Small interface labels (not part of the invitation wording). */
  ui: {
    sealHint: "or tap the seal",
    sealLabel: "Break the seal and open the invitation",
    skipHint: "Tap anywhere to skip",
    replayOpening: "Replay opening",
    musicLabel: "Background music",
    ganeshaAlt: "Lord Ganesha",
    scrollCue: "Scroll down to the celebrations",
    addToCalendar: "Add to Calendar",
    googleCalendar: "Google Calendar",
    downloadIcs: "Apple / Outlook (.ics)",
    viewLocation: "View Location",
    venueLabel: "Venue",
    countdownUnits: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
    celebrationsBegun: "The celebrations have begun",
    blessingPrompt: "Touch the lotus to send your blessings",
    blessingThanks: "Thank you for your blessings",
    blessingSentLabel: "Your blessing has been sent",
    share: "Share invitation",
    shareWhatsApp: "Share on WhatsApp",
    copyLink: "Copy link",
    linkCopied: "Link copied",
    copyFailed: "Could not copy — please copy the link manually",
    progressLabel: "Invitation sections",
    loadFailed: "Part of the invitation could not load. Please check your connection and try again.",
    reload: "Reload invitation",
  },

  /** Page title / link-preview text (also used when sharing). */
  meta: {
    title: "DEVEN & ADITI | Wedding Invitation",
    dates: "10 – 12 December 2026",
  },

  /** Hidden helper page at /#/create-link */
  createLink: {
    heading: "Personalised Invitation Links",
    intro: "Type a guest or family name to create their own invitation link.",
    nameLabel: "Guest or family name",
    placeholder: "e.g. Sharma Family",
    previewLabel: "Their envelope will read",
    linkLabel: "Personalised link",
    copy: "Copy link",
    whatsapp: "Share on WhatsApp",
    open: "Open preview",
    back: "Back to the invitation",
    empty: "Enter a name to generate the link.",
  },
};

export type Wedding = typeof wedding;

/** "DEVEN & ADITI" — the couple as one line (titles, calendar, sharing, screen readers). */
export const coupleName = `${wedding.groom} ${wedding.joiner} ${wedding.bride}`;
