
# Beach Breakdown

Beach Breakdown is a small React app for quickly choosing Ocean City, MD restaurants and activities during a family vacation. It includes searchable and filterable activity and restaurant lists, an Easy Read view, menu links, map view, and distance calculations from the default home base at 94th & Caribbean.

## Local Setup

Install dependencies:

```bash
npm install
```

Start the local Vite development server:

```bash
npm run dev
```

For local Netlify emulation, including Netlify configuration support, use:

```bash
netlify dev --port 8889
```

## Netlify Setup

This repository includes `netlify.toml`, so Netlify can detect the build settings automatically:

- Build command: `npm run build`
- Publish directory: `dist`
- Local app command: `npm run dev`

The app is a client-side React app, so `public/_redirects` routes page refreshes and direct URLs back to `index.html`.

## Menus

Restaurant menu URLs open from the app. If local menu PDFs or images are added later, place them in `public/menus/` and reference those file names in the restaurant data so they are published with the site.
