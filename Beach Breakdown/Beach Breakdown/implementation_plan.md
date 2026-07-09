# Beach Breakdown Implementation Plan

A custom, fast, and easy-to-use family vacation app to help decide where to eat and what to do in Ocean City, MD. Designed for Android tablets and web browsers, with a focus on rich aesthetics, casual tone, and high legibility (table view vs. large-text "Easy Read" mode for older family members).

---

## User Review Required

> [!IMPORTANT]
> **Menu Integration Advice**
> - All restaurant menus in your spreadsheet are currently external web links (e.g., `https://...`). Due to web browser security policies (`X-Frame-Options`), external websites cannot be safely embedded inside an iframe on the page and will block loading.
> - **Our Solution:** The app will open external web links in a new browser tab. 
> - **Premium local menus option:** If you have menu images (PNG, JPG) or PDF files, you can copy them into the `public/menus/` folder of this project (e.g., `public/menus/bull_menu.jpg`), and put the file name in the spreadsheet's menu column (e.g., `bull_menu.jpg`). The app will detect local files and open them in a beautiful, full-screen interactive overlay with zoom controls directly in the app.

> [!TIP]
> **Dynamic Location & Distance Calculations**
> - We extracted the exact geographic coordinates (Latitude and Longitude) for **51 out of 51 activities** and **58 out of 59 restaurants** from your Google My Maps data.
> - This allows us to implement a **Settings Panel** where users can select or type where they are staying.
> - The app will dynamically calculate distances in miles to all locations in real-time using the **Haversine formula**!
> - It also allows us to build a **fully interactive local map** using Leaflet (free, open-source, no API keys required) that filters pins in real-time as you search/filter the table!

---

## Proposed Changes

We will build the application using the Vite + React + Tailwind CSS project template copied to the workspace root.

### Data Layer

#### [NEW] [activities.json](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/data/activities.json)
- Static dataset of 51 activities containing names, addresses, descriptions, categories, transit details, and extracted coordinates (latitude/longitude).

#### [NEW] [restaurants.json](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/data/restaurants.json)
- Static dataset of 59 restaurants containing names, addresses, distance categories, food types, expense levels, website links, menus, notes, and coordinates.

#### [NEW] [appConfig.json](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/config/appConfig.json)
- Configuration file setting the default vacation home location at 94th & Caribbean (`38.4095184, -75.0617443`).

---

### UI Components

#### [MODIFY] [App.tsx](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/app/App.tsx)
- The main application entry point.
- **Top Navigation Bar:** Tabs to switch between **Activities** and **Restaurants**.
- **Settings Toggle:** An options panel to change the current vacation home base location (updates distances).
- **Toggle View:** Switch between **Full Table**, **Easy Read (Large Cards)**, and **Interactive Map**.
- **Global Search Bar:** Real-time search across names and descriptions/notes.
- **Filters Panel:**
  - *Activities:* Reachable by transit (Yes/No/All), General Category.
  - *Restaurants:* Distance Category, Food Type, Expense Level, Been Before? (Yes/No/All), Reservations? (Yes/No/All), View (Waterfront/Oceanfront/etc.).
- **Interactive Data Table:** Custom-styled sortable table. Clicking a restaurant menu opens a full-screen viewer.

#### [MODIFY] [EasyRead.tsx](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/app/EasyRead.tsx)
- Highly legible, large-font card layout designed for older parents.
- Displays large cards for filtered locations, including clean icons for address, hours, notes, and phone numbers.
- Fully synchronized with search, filter settings, and custom distance sorting.

#### [NEW] [MapView.tsx](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/app/components/MapView.tsx)
- Embeds an interactive map using Leaflet.js.
- Displays pins for the active tab (Activities vs. Restaurants) that match current filters.
- Pins show hover labels and clickable popups with quick details and a button to view the item.
- Shows the current "Home Base" location as a distinct gold beach-house icon.

#### [NEW] [MenuModal.tsx](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/app/components/MenuModal.tsx)
- Full-screen modal that opens when a menu link is clicked.
- For local files (e.g. `public/menus/bull_menu.jpg`), it renders the image inside a zoomable container.
- For web links, it provides a direct, highly visible button to open the menu in a new tab.

---

### styling & assets

#### [MODIFY] [globals.css](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/styles/globals.css)
- Integrates beachy, premium visual aesthetics: HSL CSS variables, custom typography (Nunito / Outfit), soft sand colors (`#fef9ec`), ocean teal gradients (`#0077b6` to `#0096a0`), and subtle shadows.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure the TypeScript project compiles with no warnings.
- Run `npm run dev` to verify hot reloading and local hosting.

### Manual Verification
- **Settings Check:** Change the home base location in Settings to assateague or Rehoboth and confirm all distances update correctly.
- **Search & Filters:** Search for "golf" in Activities, filter by "Brews", and verify the count updates. Filter by "Walkable" in Restaurants and verify results.
- **Toggle View:** Switch between Full Table, Easy Read, and Map. Confirm they all show the exact same filtered locations.
- **Menu Modal:** Click "Menu" links and ensure external links show the external link prompt and local files (if any are placed) display inside the zoomable overlay.
