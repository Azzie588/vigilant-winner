# Beach Breakdown 🏖️
 
A small React app for quickly deciding where to eat and what to do in Ocean City, MD — built for family vacation planning when everyone's arguing about dinner and nobody wants to scroll through fifty tabs to figure it out.
 
## What it does
 
Beach Breakdown pulls together restaurants and activities in OCMD into one searchable, filterable list so you can make a decision in under a minute instead of relearning the whole town every summer. Features include:
 
- Searchable and filterable lists of restaurants and activities
- An "Easy Read" view for a quick, low-clutter overview
- Direct links to restaurant menus
- A map view
- Distance calculations from a default home base (94th & Caribbean), so you know how far you're actually driving for tacos
## Why it exists
 
This started as a personal tool to solve a very specific problem: every year our family goes to Ocean City and every year we waste twenty minutes debating where to eat. I'm not a professional developer — I build stuff like this with AI-assisted "vibecoding" tools (this one started life as a Figma Make export) because it's a fun way to solve small real-life annoyances. If it's useful to anyone else planning an OCMD trip, even better.
 
## Screenshots
 
_Coming soon._
 
## Quick setup
 
Install dependencies:
 
```bash
npm install
```
 
Start the local Vite dev server:
 
```bash
npm run dev
```
 
### Deploying
 
The app is deployed via **Cloudflare Pages**:
 
- **Build command:** `npm run build`
- **Build output directory:** `dist`
It's a client-side React app, so client-side routing (page refreshes and direct URLs) needs to fall back to `index.html` — configure this in your Cloudflare Pages project settings (or a `_redirects` file with `/* /index.html 200`, Cloudflare Pages supports the same syntax Netlify uses).
 
### Adding menus
 
Restaurant menu links open straight from the app. If you want to host menu PDFs or images locally instead of linking out, drop them in `public/menus/` and reference the file names in the restaurant data so they get published with the site.
 
## Tech stack
 
- **React 18** + **Vite** for the app and dev server
- **Tailwind CSS 4** for styling
- **Radix UI** and **MUI (Material UI)** for accessible UI components
- **React Router** for navigation
- **Recharts**, **canvas-confetti**, and a handful of other small libraries for polish (charts, celebratory confetti when you finally pick a restaurant, etc.)
- **Cloudflare Pages** for hosting and deployment
## Known limitations
 
- This is a hobby project built for one family's trip planning, not a general-purpose travel app — restaurant and activity data is manually maintained, not pulled from a live API.
- Distance calculations assume the default home base; there's no dynamic "set your own starting point" yet.
## License
 
No license file yet — treat this as "look but ask before reusing commercially." Feel free to fork it for your own trip-planning needs.
