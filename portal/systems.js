// Edit this list to add, remove or reorder systems. No build step: save and push.
//
// status: "live" | "internal" | "soon" | "external"
//   live      — public, ready to use
//   internal  — reachable only from the clinic network / VPN or by IP
//   soon      — placeholder, no link yet
//   external  — third-party tool Helixona uses (opens their sign-in)
window.HELIXONA_SYSTEMS = [
  {
    group: "Mockups",
    note: "Clickable prototypes with sample data. No real patient data anywhere.",
    items: [
      {
        name: "Complex Chronic Program",
        description: "Nine-month program app: intake, surveys & alerts, membership registry, booking, payments, notifications, dashboards.",
        url: "https://crpozo.github.io/Helixona-Complex-Chronic-Program/",
        status: "live",
        tags: ["patient", "staff", "mockup"],
        links: [
          { label: "All screens", url: "https://crpozo.github.io/Helixona-Complex-Chronic-Program/#/screens" },
          { label: "Patient home", url: "https://crpozo.github.io/Helixona-Complex-Chronic-Program/#/patient/home" },
          { label: "Staff queues", url: "https://crpozo.github.io/Helixona-Complex-Chronic-Program/#/staff/intake-review" },
        ],
      },
    ],
  },
  {
    group: "Systems",
    note: "Running services. Internal addresses may only open from the clinic network.",
    items: [
      {
        name: "Bot administration",
        description: "Manage the eCW connector bots: jobs, runs, verification results and exceptions.",
        url: "http://54.189.175.233:5050/",
        status: "internal",
        tags: ["ops", "eCW connector"],
      },
      {
        name: "Helixona application (production)",
        description: "The operational app next to eClinicalWorks. Not deployed yet.",
        url: "",
        status: "soon",
        tags: ["patient", "staff"],
      },
    ],
  },
  {
    group: "Tools we use",
    note: "Third-party services. Each opens its own sign-in.",
    items: [
      { name: "Stripe", description: "Payments: cards, bank accounts, recurring billing, receipts.", url: "https://dashboard.stripe.com/", status: "external", tags: ["finance"] },
      { name: "Typeform", description: "Public inquiry forms (three pathways) that feed the inquiry list.", url: "https://admin.typeform.com/", status: "external", tags: ["intake"] },
      { name: "eClinicalWorks", description: "Medical record and insurance-visit calendar. Address to confirm.", url: "", status: "soon", tags: ["clinical"] },
    ],
  },
  {
    group: "Source code",
    note: "GitHub repositories.",
    items: [
      { name: "helixona-main", description: "This portal (bot.helixona.com).", url: "https://github.com/crpozo/helixona-main", status: "live", tags: ["github"] },
      { name: "Helixona-Complex-Chronic-Program", description: "Complex Chronic Program mockups.", url: "https://github.com/crpozo/Helixona-Complex-Chronic-Program", status: "live", tags: ["github"] },
    ],
  },
];
