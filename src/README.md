# LIC Consultant Website — README

Premium single-page lead website for an LIC Consultant (not "agent" positioning).
Theme: LIC trust navy `#071c3d` + gold `#e8b62a` + cream. Mobile-first, animated,
WhatsApp-first lead capture.

## Project structure (DevOps-friendly)

```
main.pjs            ← CONTENT CMS. Edit consultant details, video link,
                      stats, policies, FAQs, testimonials here. No code edits needed.
index.html          ← Page skeleton only (sections + IDs). No business logic.
src/
  css/styles.css    ← All styling, animations, responsive breakpoints.
  js/app.js         ← All interactions. Reads data from root.siteData() etc.
  README.md         ← This file (also visible in editor files panel).
scratch/            ← Private scratch (never ships).
```

`main.pjs`, `index.html`, `src/` ship with the generator. Everything else is private.

## Editing content (for the client / non-dev)

Open `main.pjs` → edit `siteData()`:
- `consultantName`, `phoneDisplay`, `phoneTel`, `whatsapp` (country code + number,
  no `+`/spaces, e.g. `919876543210`), `email`, `city`, `address`, `hours`
- `videoUrl`: paste a YouTube Shorts/Video URL to show it in the phone frame.
- `whatsappMsg`: default pre-filled enquiry text.

Then `statsData()`, `policiesData()`, `faqsData()`, `testimonialsData()` — same
shape, just edit text. The site re-renders automatically.

## Adding the shorts video permanently

Option A (YouTube): set `videoUrl` in `main.pjs`. Done.
Option B (self-hosted): save MP4 as `src/videos/intro.mp4`, then in
`src/js/app.js` video section, set the `<video>` src to it (one line, marked
with comment `VIDEO:`), or ask the AI to wire it.

The on-page Upload box is a **preview only** (client can test a video locally);
it does not persist uploads — by design (no backend / no storage quota burn).

## Local behaviour notes

- WhatsApp deep links: `https://wa.me/<whatsapp>?text=...` — update one place.
- Never collect cash: footer + contact remind visitors to pay LIC only + take receipts.
- Policy cards carry an indicative-data disclaimer (premiums/bonuses vary).
- Social-proof toasts are simulated recency nudges (clearly generic, no fake names
  with photos). Replace with real review links when available.
- Fonts: system stack only (fast, no webfont blocking). Colours via CSS vars.

## Testing

- Desktop: width 1280+ — hero grid, 3-col policies, 4-col stats.
- Mobile: 390×844 — hamburger → drawer (animated to ✕), sticky bottom
  Call/WhatsApp/Review bar, phone-frame video, swipeable reviews.
- Check: counters animate, calculator updates + WhatsApp link carries numbers,
  FAQ accordion, slider autoplay, form opens wa.me with prefill, toasts cycle.

## Roadmap (later, per client)

- Real Google-reviews embed, claim-status tracker page, premium-reminder
  signup (kv-plugin), Hindi/Marathi toggle, blog/plan pages for SEO,
  server-plugin lead inbox + admin dashboard.
