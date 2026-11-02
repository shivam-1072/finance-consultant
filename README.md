# LIC Consultant Website (standalone)

Single-page lead website for an LIC Consultant. Just open `index.html` in a
browser, or upload this folder to any static host (GitHub Pages / Netlify /
Vercel / cPanel — no build step, no backend needed).

## Edit client details (1 file only)

Open `src/js/site-config.js` and replace the placeholder values:

- `SITE_CONFIG`: consultantName, phoneDisplay, phoneTel, whatsapp
  (country code + number, no "+" or spaces, e.g. "919876543210"), email,
  city, address, hours, videoUrl (YouTube Shorts link or "")
- `SITE_STATS`, `SITE_POLICIES`, `SITE_FAQS`, `SITE_TESTIMONIALS`:
  edit text / add / remove entries freely.

Save, refresh — done. Styling lives in `src/css/styles.css`,
interactions in `src/js/app.js` (you normally never touch it).

## Add the shorts video permanently

- YouTube: set `videoUrl` in site-config.js. Done.
- Self-hosted: drop the MP4 as `src/videos/intro.mp4` (see note inside
  `src/videos/`), then set `videoUrl` to "" — the page will play it.

## Files

- index.html — page skeleton
- src/css/styles.css — all styling / animations / responsive
- src/js/site-config.js — ALL editable content (edit this!)
- src/js/app.js — interactions (reads site-config.js)
- src/videos/ — put intro.mp4 here
- main.pjs — original Perchance CMS copy (only needed on perchance.org)

Live WhatsApp leads need zero setup: the form + all buttons open wa.me links
with pre-filled messages. Test on mobile (390px) + desktop before handover.
