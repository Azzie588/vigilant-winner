# Beach Breakdown Walkthrough

A custom vacation app designed for Android tablets and web browsers to help your family find activities and decide where to eat in Ocean City, MD.

---

## 🌟 Key Features Completed

### 1. Unified Navigation Tabs
- Switch instantly between **Activities** and **Restaurants** from the navigation bar fixed to the top of the screen (no landing page required).

### 2. Layouts for Family Accessibility
- **Full Table:** A detailed, sortable grid layout with columns matching your spreadsheets.
- **Easy Read:** A high-contrast cards layout designed for seniors with large fonts (18px-24px), simplified information details, and large, tap-friendly action buttons.

### 3. Dynamic Location & Distance
- User can change their **Home Location** in the Settings panel (presets like 94th & Caribbean, Inlet Boardwalk, or Custom coordinates).
- Distances dynamically recalculate in real-time for all **51 activities** and **59 restaurants** using the mathematical **Haversine formula**.

### 4. Interactive Map Overlay Modal
- Built with **Leaflet.js** using a clean, modern CartoDB Positron styling.
- Dynamically loads pins for the active view (Activities vs Restaurants) filtering results in real-time as you search.
- Visual custom icons (burger emoji for restaurants, Ferris wheel for activities, beach house for Home).
- Fit bounds adjustments ensure you see all filtered pins.

### 5. Full-Screen Menu Modal
- Click "Menu" to trigger a modal.
- For external web menus (e.g. `https://...`), it redirects the user to open the menu in a new tab.
- For local menus, it allows you to store image files (JPG, PNG) or PDFs in the `public/menus/` folder, displaying them inside a full-screen zoomable container with Zoom In, Zoom Out, and Reset Zoom controls.

### 6. Standalone Single-File Webpage (beach_breakdown.html)
- Compiled the entire application, styling, custom configs, and database data into a single standalone HTML page: [beach_breakdown.html](file:///c:/Users/casey/Downloads/Beach%20Breakdown/beach_breakdown.html).
- **Zero Setup:** Double-click this file from your browser to run the app instantly without running any local node server.
- **Offline Ready:** Ready to copy onto your Android tablet for 100% offline usage. Keep your custom menu assets in a folder named `menus` next to the HTML file (e.g. `menus/bull_menu.jpg`) and they will open offline in the zoomable modal container.

---

## 🛠️ Code Structure

- [App.tsx](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/app/App.tsx): Primary controller containing layouts, tabs, search/filter controls, and modal state management.
- [EasyRead.tsx](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/app/EasyRead.tsx): Senior-friendly cards view.
- [MapView.tsx](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/app/components/MapView.tsx): Leaflet.js interactive maps wrapper.
- [MenuModal.tsx](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/app/components/MenuModal.tsx): Overlay modal for menus.
- [distance.ts](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/utils/distance.ts): Haversine distance algorithm.
- [index.ts](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/types/index.ts): TypeScript structures.
- [activities.json](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/data/activities.json) & [restaurants.json](file:///c:/Users/casey/Downloads/Beach%20Breakdown/src/data/restaurants.json): JSON database files containing pre-geocoded coordinates extracted from your Google My Maps export.

---

## 📈 Verification Summary

1. **Vite + React Setup:** Project structure initialized at the workspace root.
2. **Leaflet Integration:** Leaflet CDN stylesheet and scripts embedded directly into `index.html`.
3. **Data Completeness:** 100% of activities (51) and restaurants (59) successfully imported.
4. **Geocoding Matching:** 100% coordinates mapped for activities, and 98.3% for restaurants (excepting placeholder row).
5. **Clean Workspace:** Cleaned up all intermediate download files, KML caches, and unzipped archives.
