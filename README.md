
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
 
### Updating the data
 
Restaurants and activities are both plain JSON files, not a database — editing them is just editing a file and committing.
 
**Restaurants** live in `src/data/restaurants.json`. Each entry looks like:
 
```json
{
  "id": 71,
  "restaurant": "Name of the Place",
  "address": "123 Coastal Hwy",
  "distance": "1.2 mi",
  "distanceCategory": "Drive",
  "websiteUrl": "https://example.com",
  "generalType": "Seafood / American",
  "level": "Casual",
  "foodType": "Other",
  "filterLevel": "Casual",
  "reservations": "Don't accept reservations",
  "view": "",
  "notes": "A short description of the place.",
  "menu": "https://example.com/menu",
  "sourceUrl": "https://example.com",
  "lat": 38.4095,
  "lng": -75.0617
}
```
 
Give each new entry a unique `id`, and set `lat`/`lng` (needed for the map view and distance calculations) — you can grab coordinates from Google Maps by right-clicking a location and copying the numbers shown.
 
**Adding menus:** Restaurant menu links open straight from the app when `menu` is a full URL. If you'd rather host a menu PDF or image locally instead of linking out, drop the file in `public/menus/` and set `menu` to just the file name (e.g. `"menu": "bull_menu.jpg"`) — the app detects local files automatically and opens them in a full-screen, zoomable overlay instead of a new tab.
 
**Activities** live in `src/data/activities.json`, with a different shape:
 
```json
{
  "id": 56,
  "name": "Name of the Place",
  "address": "123 Some St, Berlin",
  "distance": "5.0 mi",
  "distanceVal": 7.0,
  "what": "Mini Golf",
  "category": "Outdoor Amusements",
  "setting": "outdoor",
  "reachableByTransit": true,
  "transitDetail": "Take the Beach Bus northbound",
  "notes": "Anything worth knowing before you go.",
  "url": "https://example.com",
  "lat": 38.4095,
  "lng": -75.0617
}
```
 
Same idea: unique `id`, real `lat`/`lng` for the map, and `reachableByTransit` / `transitDetail` if you want it to show up correctly in the transit filter.
 
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
 
No license file yet — treat this as "look but ask before reusing commercially." Feel free to fork it for your own trip-planning needs (and help me develop it to work in numerous locales).
 
