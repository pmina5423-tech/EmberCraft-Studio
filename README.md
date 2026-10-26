# EmberCraft Studio Website

A website project for EmberCraft Studio, a small candle business in Pretoria, built as part of the WEDE5020 (Web Development - Introduction) Portfolio of Evidence.

## Project Overview
This is the website for EmberCraft Studio, a small candle business run out of a home studio in Pretoria. The site covers what the studio does, the candle ranges on offer, and gives people a way to book a workshop spot or ask a question — built as Part 1 of the WEDE5020 (Web Development - Introduction) Portfolio of Evidence, with CSS styling and JavaScript functionality to follow in Parts 2 and 3.

## Design Aesthetic
EmberCraft Studio's visual identity is warm, minimal, and handmade rather than commercial. This is carried through in three ways:
- **Colour palette:** warm amber (#c98a4b) as the primary accent, paired with a sage green (#8a9a7e) pulled directly from the olive sprig in the logo, a cream background tint (#f6f1e7), and a warm charcoal-brown for body text (#3d3a35). Amber and sage together nod to candlelight and the botanical mark in the logo, giving the palette a "cute," soft-cottagecore feel rather than a generic commercial look.
- **Typography:** Georgia (serif) for headings, giving the studio a crafted, slightly traditional feel in line with a handmade product; Arial (sans-serif) for body copy, keeping longer passages easy to read.
- **Layout:** generous white space, a single readable content column, and simple grid-based product/location cards — the aim is for the candles and photography to be the visual focus, rather than heavy decoration competing with them.

## Sitemap
```
Homepage (index.html)
│
├── About Us (about.html)
├── Products (products.html)
├── Enquiry (enquiry.html)
└── Contact (contact.html)
```

## Responsive Design
The site uses two breakpoints, defined with `@media` queries in `style.css`, plus relative units (`rem`, `%`) throughout so text and spacing scale smoothly rather than jumping at the breakpoint edges.

| Breakpoint | Layout | Typography | Navigation | Images |
|---|---|---|---|---|
| Desktop (default, >992px) | 3-column product grid, 2-column location cards | Full type scale (h1 2.5rem) | Horizontal nav, logo left | Hero 420px, products 260px |
| Tablet (≤992px) | 2-column product grid, locations stack to 1 column | Headings scale down (h1 2.1rem, h2 1.7rem) | Unchanged horizontal layout | Hero 320px, products 220px |
| Mobile (≤600px) | Single-column products, header stacks above nav | Headings scale down further (h1 1.7rem), body text 0.95rem | Nav becomes a full-width vertical list with larger tap targets | Hero 220px, products 200px |

### Screenshot Evidence
_Add screenshots here before submitting, taken using your browser's device toolbar (Chrome DevTools → Toggle device toolbar, or Firefox Responsive Design Mode) for each page at desktop, tablet, and mobile width:_

- Desktop (1440px or your screen width): `![Homepage desktop](images/screenshots/home-desktop.png)`
- Tablet (768px): `![Homepage tablet](images/screenshots/home-tablet.png)`
- Mobile (375px): `![Homepage mobile](images/screenshots/home-mobile.png)`

Repeat for each of the 5 pages, or at minimum the homepage and one content page (e.g. Products) and one form page (e.g. Enquiry), saved into an `images/screenshots/` folder in the repo.

## Changelog
- 2026-08-03: Initial project structure, folder layout, and HTML5 boilerplate created for all 5 pages.
- 2026-08-04: Logo added and integrated into the header across all pages.
- 2026-08-04: Content added to About, Products, Enquiry, and Contact pages; homepage intro written.
- 2026-08-07: Real sourced images (Unsplash) added for the hero and all three product listings, replacing placeholders.
- 2026-08-07: Broadened target audience (wider age range, added gifting angle); updated homepage intro and enquiry form accordingly.
- 2026-08-07: Added a short gift-suggestion note under each product on the Products page.
- 2026-08-07: Resized and compressed all images (hero, products, logo) for faster page load.
- 2026-08-09: Swapped product images so each photo better matches its scent description (Sunday Morning and Firelight Grove images were reversed).
- 2026-08-11: Re-cropped hero image to a proper landscape banner ratio; added CSS so all product images display at a consistent size in the grid.
- 2026-08-11: Reverted hero image to the full, uncropped photo per request — resized only, nothing cut off.
- 2026-08-11: Added explanatory code comments across all 5 HTML files (header/nav, hero, forms, product cards, locations).
- 2026-08-11: Set logo width to 200px (height scales automatically to keep proportions).
- 2026-08-11: Rewrote all page copy (Homepage, About, Products, Enquiry) in a more formal, professional tone.
- 2026-09-07: Reviewed Part 1 marking feedback (92/100) ahead of Part 2. Feedback flagged: no design aesthetic provided, wireframes lacking detail, minor HTML layout inconsistencies, and a navigation menu that "lacks clarity or usability."
- 2026-09-07: Added a Design Aesthetic section to this README (colour palette, typography, and layout rationale), directly addressing the "no design aesthetic provided" feedback from Part 1.
- 2026-09-07: Rebuilt css/style.css into clearly separated Base, Typography, and Layout Structure sections (previously a single unstructured starter file), using CSS custom properties for colours and fonts so styling stays consistent across all 5 pages.
- 2026-09-07: Restyled the header and navigation using Flexbox, with increased link spacing and bold nav text, in response to the Part 1 feedback that the navigation menu "lacks clarity or usability."
- 2026-09-07: Applied CSS Grid to the Products page (3-column card layout) and the Contact page location listings (2-column layout), replacing the previous unstyled stacked layout.
- 2026-09-07: Corrected a genuine heading-hierarchy inconsistency flagged under Part 1's "HTML Tags for Layout" feedback — every page opened directly on an `<h2>` with no `<h1>` present. Promoted each page's first section heading to `<h1>` (index, about, products, contact, enquiry) and added matching CSS.
- 2026-09-07: Added decoration and colour styling — card borders and shadows on product and location listings, a tinted background on the contact/enquiry forms and footer, and dividing lines between page sections — using the existing terracotta/cream colour palette.
- 2026-09-07: Added `:hover`, `:focus`, and `:active` states for nav links, the CTA button, form buttons, and form inputs, so interactive elements give visible feedback.
- 2026-09-07: Added responsive breakpoints at 992px (tablet) and 600px (mobile). Product grid steps down from 3 to 2 to 1 column; location cards stack on tablet and below; header/nav switches to a stacked, full-width vertical menu on mobile since there's no JS toggle until Part 3; headings and body text scale down at each breakpoint; hero and product image heights reduce to suit each screen size.
- 2026-09-07: Added a Responsive Design breakpoint summary and a Screenshot Evidence section (with placeholders for desktop/tablet/mobile screenshots of each page) to this README.
- 2026-09-07: Switched the colour palette from terracotta/amber to a Sage & Amber scheme — sage green (#8a9a7e) pulled from the logo's olive sprig, paired with a warm amber accent (#c98a4b) and a cream background tint — for closer alignment with the logo and a softer, more "cute" feel. Updated the Design Aesthetic section in this README to match.
- 2026-09-10: Discovered the hero image had been swapped to a raw, uncompressed Unsplash download (luma-candles-jQKeCGR7PL4-unsplash.jpg, 3.7MB) that didn't match any existing reference entry. Compressed it and generated 480w/800w/1200w versions for use in srcset.
- 2026-09-10: Generated 3 resolutions each of the hero image (480w/800w/1200w) and all 3 product images (400w/600w/800w), and added `srcset`/`sizes` attributes so the browser loads the right image size for the viewport instead of a single large file on every device.
- 2026-09-10: Corrected the references list — added a missing citation for the new hero image (a second, previously uncited Luma Candles Unsplash photo, ID jQKeCGR7PL4) and removed the Svitlana citation, since hero-placeholder.jpg is no longer used anywhere on the site.

## References
Azimova, K., n.d. Photograph of a sandalwood scented candle. Unsplash. [Online] Available at: https://unsplash.com/photos/-3X3VfBODGA [Accessed 7 August 2026]. (Used as the product image for Firelight Grove.)

Canva Pty Ltd, 2026. Oval Floral Handmade Candle Business Logo Template. Canva. [Online] Available at: https://www.canva.com [Accessed 4 August 2026]. (Logo adapted from a Canva template for EmberCraft Studio.)

Luma Candles, n.d. a. Photograph of a handmade soy candle. Unsplash. [Online] Available at: https://unsplash.com/photos/Br2BwCBA-s0 [Accessed 7 August 2026]. (Used as the product image for Sunday Morning.)

Luma Candles, n.d. b. Photograph of a Luma candle range display. Unsplash. [Online] Available at: https://unsplash.com/photos/jQKeCGR7PL4 [Accessed 10 September 2026]. (Used as the homepage hero image.)

Mozilla Developer Network (MDN), 2026. HTML: A good basis for accessibility. [Online] Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML [Accessed 31 July 2026].

New Target, Inc., 2025. Color Psychology in Website Design. [Online] Available at: https://www.newtarget.com/web-insights-blog/color-psychology-in-website-design/ [Accessed 31 July 2026].

Phan, H., n.d. Photograph of scented candles. Unsplash. [Online] Available at: https://unsplash.com/photos/5q61gKdHgv8 [Accessed 7 August 2026]. (Used as the product image for Ember & Oak.)

Truehost South Africa, 2026. Cheap Web Hosting South Africa (2026) – Cheap, Fast & Reliable. [Online] Available at: https://truehost.co.za/cheap-web-hosting-south-africa-2026/ [Accessed 31 July 2026].
