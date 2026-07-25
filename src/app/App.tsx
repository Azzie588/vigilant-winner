import { useState, useMemo } from "react";
import {
  Search,
  Bus,
  X,
  TableProperties,
  BookOpen,
  Settings,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
  Utensils,
  Footprints,
  Calendar,
  DollarSign,
  Home as HomeIcon,
  TreePine,
  Tag,
  Map,
} from "lucide-react";

import activitiesDataRaw from "../data/activities.json";
import restaurantsDataRaw from "../data/restaurants.json";
import appConfig from "../config/appConfig.json";
import { Activity, Restaurant, HomeLocation } from "../types";
import { getDistanceMiles, formatDistance, getWebsiteUrl } from "../utils/distance";
import EasyRead from "./EasyRead";
import MapView from "./components/MapView";
import MenuModal from "./components/MenuModal";
import TransitBadge from "./components/TransitBadge";
import IconPopover from "./components/IconPopover";
import { getCategoryIcon } from "./categoryIcons";

// Predefined Home preset options
const HOME_PRESETS: HomeLocation[] = [
  { name: "94th & Caribbean Drive (Home Base)", lat: 38.4095184, lng: -75.0617443 },
  { name: "Ocean City Boardwalk (Inlet)", lat: 38.328328, lng: -75.085817 },
  { name: "Northside Park (125th St)", lat: 38.428581, lng: -75.056972 },
  { name: "Seacrets (49th St)", lat: 38.373977, lng: -75.070624 },
  { name: "Ocean Bowl Skate Park", lat: 38.335359, lng: -75.086914 },
];

type SortDir = "asc" | "desc" | null;

export default function App() {
  // Global View States
  const [activeTab, setActiveTab] = useState<"activities" | "restaurants">("activities");
  const [viewMode, setViewMode] = useState<"table" | "easyread">("table");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Selected Menu Modal State
  const [activeMenu, setActiveMenu] = useState<{ url: string; name: string } | null>(null);

  // Home Location State
  const [homeLocation, setHomeLocation] = useState<HomeLocation>({
    name: appConfig.defaultHome.name,
    lat: appConfig.defaultHome.lat,
    lng: appConfig.defaultHome.lng,
  });

  // Settings custom input state
  const [customLat, setCustomLat] = useState(String(appConfig.defaultHome.lat));
  const [customLng, setCustomLng] = useState(String(appConfig.defaultHome.lng));
  const [customName, setCustomName] = useState("Custom Spot");

  // Search filter
  const [search, setSearch] = useState("");

  // Filters - Activities
  const [actCategory, setActCategory] = useState("All");
  const [actTransit, setActTransit] = useState("All");

  // Filters - Restaurants
  const [restDistanceCat, setRestDistanceCat] = useState("All");
  const [restFoodType, setRestFoodType] = useState("All");
  const [restExpenseLevel, setRestExpenseLevel] = useState("All");
  const [restReservations, setRestReservations] = useState("All"); // "All" | "Yes" | "No"
  const [restView, setRestView] = useState("All"); // "All" | "Waterfront" | "Seaside" etc

  // Sort State
  const [sortCol, setSortCol] = useState<string>("distance");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Reset all filters when switching tabs
  function handleTabChange(tab: "activities" | "restaurants") {
    setActiveTab(tab);
    setSearch("");
    setSortCol("distance");
    setSortDir("asc");
    // Reset filters
    setActCategory("All");
    setActTransit("All");
    setRestDistanceCat("All");
    setRestFoodType("All");
    setRestExpenseLevel("All");
    setRestReservations("All");
    setRestView("All");
  }

  // 1. Calculate dynamic distances from the current home location
  const activitiesWithDist = useMemo(() => {
    return (activitiesDataRaw as Activity[]).map((a) => {
      if (a.lat !== null && a.lng !== null) {
        const calc = getDistanceMiles(homeLocation.lat, homeLocation.lng, a.lat, a.lng);
        return { ...a, calculatedDistance: calc };
      }
      return { ...a };
    });
  }, [homeLocation]);

  const restaurantsWithDist = useMemo(() => {
    return (restaurantsDataRaw as Restaurant[]).map((r) => {
      if (r.lat !== null && r.lng !== null) {
        const calc = getDistanceMiles(homeLocation.lat, homeLocation.lng, r.lat, r.lng);
        return { ...r, calculatedDistance: calc };
      }
      return { ...r };
    });
  }, [homeLocation]);

  // Extract unique filters from the datasets
  const categories = useMemo(() => {
    const cats = activitiesWithDist.map((a) => a.category).filter(Boolean);
    return Array.from(new Set(cats)).sort();
  }, [activitiesWithDist]);

  const foodTypes = useMemo(() => {
    const types = restaurantsWithDist.map((r) => r.foodType).filter((t) => t && t !== "Other");
    return Array.from(new Set(types)).sort();
  }, [restaurantsWithDist]);

  const expenseLevels = useMemo(() => {
    const levels = restaurantsWithDist.map((r) => r.filterLevel || r.level).filter((l) => l && l !== "Other");
    return Array.from(new Set(levels)).sort();
  }, [restaurantsWithDist]);

  const viewCategories = useMemo(() => {
    const views = restaurantsWithDist.map((r) => r.view).filter(Boolean);
    return Array.from(new Set(views)).sort();
  }, [restaurantsWithDist]);

  // Process sorting and filtering
  const filteredActivities = useMemo(() => {
    let list = [...activitiesWithDist];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.what.toLowerCase().includes(q) ||
          a.notes.toLowerCase().includes(q)
      );
    }

    if (actCategory !== "All") {
      list = list.filter((a) => a.category === actCategory);
    }

    if (actTransit === "Yes") {
      list = list.filter((a) => a.reachableByTransit);
    } else if (actTransit === "No") {
      list = list.filter((a) => !a.reachableByTransit);
    }

    // Sort
    if (sortCol) {
      list.sort((a, b) => {
        let av: any = "";
        let bv: any = "";

        if (sortCol === "name") {
          av = a.name;
          bv = b.name;
        } else if (sortCol === "distance") {
          av = a.calculatedDistance ?? a.distanceVal ?? 999.0;
          bv = b.calculatedDistance ?? b.distanceVal ?? 999.0;
        } else if (sortCol === "category") {
          av = a.category;
          bv = b.category;
        }

        if (typeof av === "number" && typeof bv === "number") {
          return sortDir === "asc" ? av - bv : bv - av;
        }
        return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }

    return list;
  }, [activitiesWithDist, search, actCategory, actTransit, sortCol, sortDir]);

  const filteredRestaurants = useMemo(() => {
    let list = [...restaurantsWithDist];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.restaurant.toLowerCase().includes(q) ||
          r.generalType.toLowerCase().includes(q) ||
          r.notes.toLowerCase().includes(q)
      );
    }

    if (restDistanceCat !== "All") {
      list = list.filter((r) => r.distanceCategory === restDistanceCat);
    }

    if (restFoodType !== "All") {
      list = list.filter((r) => r.foodType === restFoodType);
    }

    if (restExpenseLevel !== "All") {
      list = list.filter((r) => (r.filterLevel || r.level) === restExpenseLevel);
    }

    if (restReservations === "Yes") {
      list = list.filter((r) => r.reservations && r.reservations !== "");
    } else if (restReservations === "No") {
      list = list.filter((r) => !r.reservations || r.reservations === "");
    }

    if (restView !== "All") {
      list = list.filter((r) => r.view === restView);
    }

    // Sort
    if (sortCol) {
      list.sort((a, b) => {
        let av: any = "";
        let bv: any = "";

        if (sortCol === "restaurant") {
          av = a.restaurant;
          bv = b.restaurant;
        } else if (sortCol === "distance") {
          av = a.calculatedDistance ?? a.distanceVal ?? 999.0;
          bv = b.calculatedDistance ?? b.distanceVal ?? 999.0;
        } else if (sortCol === "foodType") {
          av = a.generalType;
          bv = b.generalType;
        } else if (sortCol === "level") {
          av = a.level;
          bv = b.level;
        }

        if (typeof av === "number" && typeof bv === "number") {
          return sortDir === "asc" ? av - bv : bv - av;
        }
        return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }

    return list;
  }, [restaurantsWithDist, search, restDistanceCat, restFoodType, restExpenseLevel, restReservations, restView, sortCol, sortDir]);

  function handleSort(col: string) {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  function clearAllFilters() {
    setSearch("");
    setActCategory("All");
    setActTransit("All");
    setRestDistanceCat("All");
    setRestFoodType("All");
    setRestExpenseLevel("All");
    setRestReservations("All");
    setRestView("All");
  }

  const hasFilters =
    search ||
    actCategory !== "All" ||
    actTransit !== "All" ||
    restDistanceCat !== "All" ||
    restFoodType !== "All" ||
    restExpenseLevel !== "All" ||
    restReservations !== "All" ||
    restView !== "All";

  // Handle setting changes
  function applyCustomHome() {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setHomeLocation({
        name: customName || "Custom Location",
        lat,
        lng,
      });
      setIsSettingsOpen(false);
    } else {
      alert("Please enter valid decimal coordinates for latitude and longitude.");
    }
  }

  // Styles utility classes
  const thClass =
    "px-3 py-3 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase cursor-pointer select-none whitespace-nowrap hover:text-[#1b3a4b] transition-colors duration-150 border-b border-[rgba(0,120,140,0.15)]";
  const thIconClass =
    "px-3 py-3 text-center text-xs font-bold tracking-wider text-muted-foreground select-none whitespace-nowrap border-b border-[rgba(0,120,140,0.15)]";
  const thIconSortableClass =
    "px-3 py-3 text-center text-xs font-bold tracking-wider text-muted-foreground select-none whitespace-nowrap cursor-pointer hover:text-[#1b3a4b] transition-colors duration-150 border-b border-[rgba(0,120,140,0.15)]";
  const tdClass = "px-3 py-3.5 text-sm align-top leading-relaxed text-[#1b3a4b]";

  return (
    <div
      className="min-h-screen bg-background text-[#1b3a4b] flex flex-col font-sans"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* 1. Header/Branding */}
      <div className="relative border-b-2 border-[#0096a0]/15 bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#48cae4] py-6 shadow-md text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-white/90 text-xs font-black tracking-widest uppercase mb-1">
              🌊 Beach Breakdown Vacation Guide
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight drop-shadow-sm">
              Ocean City 2026
            </h1>
            <p className="text-sm text-white/90 mt-1 font-semibold flex items-center gap-1">
              🏠 Home Base: <span className="underline decoration-[#f4a261] decoration-2 font-bold">{homeLocation.name}</span>
            </p>
          </div>

          {/* Action Header Panel */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-white/15 p-1 rounded-full flex gap-1 border border-white/20">
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black transition-all duration-150 ${
                  viewMode === "table" ? "bg-white text-[#1b3a4b] shadow" : "text-white hover:bg-white/10"
                }`}
              >
                <TableProperties size={13} /> Table
              </button>
              <button
                onClick={() => setViewMode("easyread")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black transition-all duration-150 ${
                  viewMode === "easyread" ? "bg-white text-[#1b3a4b] shadow" : "text-white hover:bg-white/10"
                }`}
              >
                <BookOpen size={13} /> Easy Read
              </button>
            </div>

            {/* Settings button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 bg-white/25 hover:bg-white/35 border border-white/25 rounded-full px-4 py-2.5 text-xs font-black text-white shadow-sm transition-all"
            >
              <Settings size={14} /> Settings
            </button>

            {/* Map Popup Trigger */}
            <button
              onClick={() => setIsMapOpen(true)}
              className="flex items-center gap-1.5 bg-[#f4a261] hover:bg-[#e7914f] rounded-full px-4 py-2.5 text-xs font-black text-white shadow-md transition-all active:scale-[0.98]"
            >
              <Map size={14} /> View Map
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="bg-[#1b3a4b] border-b border-[rgba(0,120,140,0.15)] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex">
          <button
            onClick={() => handleTabChange("activities")}
            className={`flex items-center justify-center gap-2 py-4 px-6 text-base font-extrabold transition-all border-b-4 ${
              activeTab === "activities"
                ? "text-white border-[#f4a261]"
                : "text-white/60 hover:text-white border-transparent"
            }`}
          >
            <Footprints size={18} /> Activities
          </button>
          <button
            onClick={() => handleTabChange("restaurants")}
            className={`flex items-center justify-center gap-2 py-4 px-6 text-base font-extrabold transition-all border-b-4 ${
              activeTab === "restaurants"
                ? "text-white border-[#f4a261]"
                : "text-white/60 hover:text-white border-transparent"
            }`}
          >
            <Utensils size={18} /> Restaurants
          </button>
        </div>
      </div>

      {/* 3. Filtering and Searching Controls */}
      <div className="bg-[#fef9ec] border-b border-[rgba(0,120,140,0.15)] py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0096a0] pointer-events-none" />
              <input
                type="text"
                placeholder={activeTab === "activities" ? "Search activity name or what..." : "Search restaurant name or food..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-[rgba(0,120,140,0.3)] bg-white text-[#1b3a4b] placeholder-[#5e7e8a] focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
              />
            </div>

            {/* Filter Toggle Icon */}
            <span className="flex items-center gap-1 text-xs font-bold text-[#5e7e8a]">
              <Filter size={13} /> Filters:
            </span>

            {/* Activities Specific Filters */}
            {activeTab === "activities" && (
              <>
                {/* Category Filter */}
                <select
                  value={actCategory}
                  onChange={(e) => setActCategory(e.target.value)}
                  className="text-xs font-bold rounded-full border border-[rgba(0,120,140,0.3)] bg-white text-[#1b3a4b] px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* Reachable by transit filter */}
                <select
                  value={actTransit}
                  onChange={(e) => setActTransit(e.target.value)}
                  className="text-xs font-bold rounded-full border border-[rgba(0,120,140,0.3)] bg-white text-[#1b3a4b] px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
                >
                  <option value="All">All Transit Options</option>
                  <option value="Yes">✓ Reachable by Public Transport</option>
                  <option value="No">✗ Needs Walk/Drive/Rideshare</option>
                </select>
              </>
            )}

            {/* Restaurants Specific Filters */}
            {activeTab === "restaurants" && (
              <>
                {/* Distance Category dropdown */}
                <select
                  value={restDistanceCat}
                  onChange={(e) => setRestDistanceCat(e.target.value)}
                  className="text-xs font-bold rounded-full border border-[rgba(0,120,140,0.3)] bg-white text-[#1b3a4b] px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
                >
                  <option value="All">All Distances</option>
                  <option value="Walkable">Walkable</option>
                  <option value="Drive">Drive</option>
                  <option value="Longer Trip">Longer Trip</option>
                </select>

                {/* Food Type dropdown */}
                <select
                  value={restFoodType}
                  onChange={(e) => setRestFoodType(e.target.value)}
                  className="text-xs font-bold rounded-full border border-[rgba(0,120,140,0.3)] bg-white text-[#1b3a4b] px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
                >
                  <option value="All">All Food Types</option>
                  {foodTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                {/* Level / Expense dropdown */}
                <select
                  value={restExpenseLevel}
                  onChange={(e) => setRestExpenseLevel(e.target.value)}
                  className="text-xs font-bold rounded-full border border-[rgba(0,120,140,0.3)] bg-white text-[#1b3a4b] px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
                >
                  <option value="All">All Expenses</option>
                  {expenseLevels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>

                {/* Reservations dropdown */}
                <select
                  value={restReservations}
                  onChange={(e) => setRestReservations(e.target.value)}
                  className="text-xs font-bold rounded-full border border-[rgba(0,120,140,0.3)] bg-white text-[#1b3a4b] px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
                >
                  <option value="All">Reservations (All)</option>
                  <option value="Yes">Reservations: Required/Offered</option>
                  <option value="No">Reservations: No</option>
                </select>

                {/* View dropdown */}
                <select
                  value={restView}
                  onChange={(e) => setRestView(e.target.value)}
                  className="text-xs font-bold rounded-full border border-[rgba(0,120,140,0.3)] bg-white text-[#1b3a4b] px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
                >
                  <option value="All">Any View</option>
                  {viewCategories.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* Clear All Filters */}
            {hasFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-xs font-black text-white bg-[#0096a0] hover:bg-[#007b85] rounded-full px-3.5 py-2 transition-colors ml-auto active:scale-[0.98] shadow-sm select-none"
              >
                <X size={12} /> Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Display Content Layout (Table Mode or Easy Read Mode) */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex items-center justify-between mb-4 text-xs font-bold text-[#5e7e8a]">
          <div>
            Showing{" "}
            <span className="text-[#1b3a4b]">
              {activeTab === "activities" ? filteredActivities.length : filteredRestaurants.length}
            </span>{" "}
            locations
          </div>
          <div>📍 Distance calculated dynamically from Home Base</div>
        </div>

        {viewMode === "easyread" ? (
          /* Easy Read View (Senior Cards Layout) */
          <EasyRead
            activeTab={activeTab}
            activities={filteredActivities}
            restaurants={filteredRestaurants}
            onOpenMenu={(url, name) => setActiveMenu({ url, name })}
            onOpenMap={() => setIsMapOpen(true)}
          />
        ) : (
          /* Full Table View */
          <div className="bg-white rounded-3xl border border-[rgba(0,120,140,0.18)] shadow-sm overflow-hidden overflow-x-auto">
            {activeTab === "activities" ? (
              <table className="w-full border-collapse" style={{ minWidth: 980 }}>
                <thead>
                  <tr className="bg-[#d4eeef]/60">
                    <th onClick={() => handleSort("name")} className={thClass}>
                      Name <SortIcon col="name" sortCol={sortCol} sortDir={sortDir} />
                    </th>
                    <th className={thClass}>Address</th>
                    <th onClick={() => handleSort("distance")} className={thClass}>
                      Distance <SortIcon col="distance" sortCol={sortCol} sortDir={sortDir} />
                    </th>
                    <th className={thIconClass} title="Public transit">
                      <Bus size={14} className="mx-auto" />
                      <span className="sr-only">Transit</span>
                    </th>
                    <th className={thClass}>What</th>
                    <th onClick={() => handleSort("category")} className={thIconSortableClass} title="Category">
                      <span className="inline-flex items-center justify-center gap-0.5">
                        <Tag size={14} />
                        <SortIcon col="category" sortCol={sortCol} sortDir={sortDir} />
                      </span>
                      <span className="sr-only">Category</span>
                    </th>
                    <th className={thIconClass} title="Indoor / outdoor">
                      <HomeIcon size={14} className="mx-auto" />
                      <span className="sr-only">Setting</span>
                    </th>
                    <th className={thIconClass} title="Price">
                      <DollarSign size={14} className="mx-auto" />
                      <span className="sr-only">Price</span>
                    </th>
                    <th className={thIconClass} title="Schedule / hours">
                      <Calendar size={14} className="mx-auto" />
                      <span className="sr-only">Schedule</span>
                    </th>
                    <th className={thClass}>Notes</th>
                    <th className={thClass}>Website</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-3 py-16 text-center text-[#5e7e8a] font-bold">
                        🏖️ No activities match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((a, idx) => {
                      const displayDist = a.calculatedDistance !== undefined ? formatDistance(a.calculatedDistance) : a.distance;
                      return (
                        <tr
                          key={a.id}
                          className={`hover:bg-[#d4eeef]/25 transition-colors border-b border-[rgba(0,120,140,0.08)] last:border-0 ${
                            idx % 2 === 0 ? "bg-white" : "bg-[#fef9ec]/40"
                          }`}
                        >
                          <td className={`${tdClass} font-bold`}>{a.name}</td>
                          <td className={`${tdClass} text-[#5e7e8a] max-w-[140px] truncate`} title={a.address}>
                            {a.address}
                          </td>
                          <td className={`${tdClass} font-mono font-bold text-[#0077b6]`}>
                            <span title={`Calculated: ${displayDist} (Original: ${a.distance})`}>{displayDist}</span>
                          </td>
                          <td className={tdClass}>
                            <TransitBadge detail={a.transitDetail} reachable={a.reachableByTransit} />
                          </td>
                          <td className={`${tdClass} max-w-[200px]`}>{a.what}</td>
                          <td className={tdClass}>
                            <IconPopover
                              icon={getCategoryIcon(a.category)}
                              detail={a.category}
                              ariaLabel="Category"
                              trigger="hover"
                            />
                          </td>
                          <td className={tdClass}>
                            <IconPopover
                              icon={a.setting === "indoor" ? <HomeIcon size={13} /> : a.setting === "outdoor" ? <TreePine size={13} /> : (
                                <span className="inline-flex gap-0.5"><HomeIcon size={12} /><TreePine size={12} /></span>
                              )}
                              detail={a.setting === "both" ? "Indoor & outdoor" : a.setting === "indoor" ? "Indoor" : "Outdoor"}
                              ariaLabel="Indoor or outdoor"
                            />
                          </td>
                          <td className={tdClass}>
                            <IconPopover
                              icon={<DollarSign size={13} />}
                              detail={a.price}
                              ariaLabel="Price"
                              emptyLabel="Pricing not added yet"
                              widthClass="w-56"
                            />
                          </td>
                          <td className={tdClass}>
                            <IconPopover
                              icon={<Calendar size={13} />}
                              detail={a.schedule}
                              ariaLabel="Schedule"
                              emptyLabel="Schedule not added yet"
                              widthClass="w-56"
                            />
                          </td>
                          <td className={`${tdClass} text-xs max-w-[240px]`}>{a.notes}</td>
                          <td className={tdClass}>
                            {a.url ? (
                              <a
                                href={getWebsiteUrl(a.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-xs font-bold text-[#0096a0] underline hover:text-[#007b85] transition-colors"
                              >
                                Link <ExternalLink size={11} />
                              </a>
                            ) : (
                              <span className="text-xs text-gray-300">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full border-collapse" style={{ minWidth: 1080 }}>
                <thead>
                  <tr className="bg-[#d4eeef]/60">
                    <th onClick={() => handleSort("restaurant")} className={thClass}>
                      Restaurant <SortIcon col="restaurant" sortCol={sortCol} sortDir={sortDir} />
                    </th>
                    <th className={thClass}>Address</th>
                    <th onClick={() => handleSort("distance")} className={thClass}>
                      Distance <SortIcon col="distance" sortCol={sortCol} sortDir={sortDir} />
                    </th>
                    <th className={thClass}>Type of Food</th>
                    <th onClick={() => handleSort("level")} className={thClass}>
                      Level <SortIcon col="level" sortCol={sortCol} sortDir={sortDir} />
                    </th>
                    <th className={thClass}>Reservations?</th>
                    <th className={thClass}>View</th>
                    <th className={thClass}>Notes</th>
                    <th className={thClass}>Menu</th>
                    <th className={thClass}>Website</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRestaurants.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-3 py-16 text-center text-[#5e7e8a] font-bold">
                        🏖️ No restaurants match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredRestaurants.map((r, idx) => {
                      const displayDist = r.calculatedDistance !== undefined ? formatDistance(r.calculatedDistance) : r.distance;
                      return (
                        <tr
                          key={r.id}
                          className={`hover:bg-[#d4eeef]/25 transition-colors border-b border-[rgba(0,120,140,0.08)] last:border-0 ${
                            idx % 2 === 0 ? "bg-white" : "bg-[#fef9ec]/40"
                          }`}
                        >
                          <td className={`${tdClass} font-bold`}>{r.restaurant}</td>
                          <td className={`${tdClass} text-[#5e7e8a] max-w-[140px] truncate`} title={r.address}>
                            {r.address}
                          </td>
                          <td className={`${tdClass} font-mono font-bold text-[#0077b6]`}>
                            <span title={`Calculated: ${displayDist} (Original: ${r.distance})`}>{displayDist}</span>
                          </td>
                          <td className={tdClass}>{r.generalType}</td>
                          <td className={tdClass}>
                            <span className="text-xs font-bold px-2.5 py-0.5 bg-[#fdefc8] text-[#7a4f00] rounded-full border border-[#f4a261]/20">
                              {r.filterLevel || r.level}
                            </span>
                          </td>
                          <td className={tdClass}>{r.reservations || <span className="text-gray-300">-</span>}</td>
                          <td className={`${tdClass} text-xs`}>{r.view || <span className="text-gray-300">-</span>}</td>
                          <td className={`${tdClass} text-xs max-w-[200px]`}>{r.notes}</td>
                          <td className={tdClass}>
                            {r.menu ? (
                              <button
                                onClick={() => setActiveMenu({ url: r.menu, name: r.restaurant })}
                                className="inline-flex items-center gap-0.5 text-xs font-extrabold text-white bg-[#0096a0] hover:bg-[#007b85] px-3 py-1 rounded-full transition-colors active:scale-[0.97]"
                              >
                                Menu
                              </button>
                            ) : (
                              <span className="text-xs text-gray-300">-</span>
                            )}
                          </td>
                          <td className={tdClass}>
                            {r.websiteUrl ? (
                              <a
                                href={r.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-xs font-bold text-[#0096a0] underline hover:text-[#007b85] transition-colors"
                              >
                                Link <ExternalLink size={11} />
                              </a>
                            ) : (
                              <span className="text-xs text-gray-300">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* 5. Settings Modal dialog */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl p-6 border border-[rgba(0,150,160,0.2)] animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-black text-[#1b3a4b]">Configure Home Location</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-[#5e7e8a] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-[#5e7e8a] mb-4 leading-relaxed">
              Distances will automatically update based on the home base you set here. Select a preset vacation hotspot, or input custom decimal coordinates.
            </p>

            {/* Presets Select */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5e7e8a] mb-1.5">
                Preset Hotspots
              </label>
              <select
                onChange={(e) => {
                  const preset = HOME_PRESETS[parseInt(e.target.value)];
                  if (preset) {
                    setHomeLocation(preset);
                    setCustomName(preset.name);
                    setCustomLat(String(preset.lat));
                    setCustomLng(String(preset.lng));
                  }
                }}
                className="w-full text-sm font-semibold rounded-2xl border border-[rgba(0,120,140,0.3)] bg-white text-[#1b3a4b] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
              >
                <option value="">-- Choose a Preset Spot --</option>
                {HOME_PRESETS.map((p, idx) => (
                  <option key={p.name} value={idx}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-100 my-4 pt-4">
              <span className="block text-xs font-black uppercase text-[#1b3a4b] mb-2">Or Use Custom Coordinates</span>

              {/* Custom Name */}
              <div className="mb-3">
                <label className="block text-xs font-bold text-[#5e7e8a] mb-1">Spot Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-sm font-semibold rounded-2xl border border-[rgba(0,120,140,0.3)] px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Latitude */}
                <div>
                  <label className="block text-xs font-bold text-[#5e7e8a] mb-1">Latitude</label>
                  <input
                    type="text"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    className="w-full text-sm font-semibold font-mono rounded-2xl border border-[rgba(0,120,140,0.3)] px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
                  />
                </div>
                {/* Longitude */}
                <div>
                  <label className="block text-xs font-bold text-[#5e7e8a] mb-1">Longitude</label>
                  <input
                    type="text"
                    value={customLng}
                    onChange={(e) => setCustomLng(e.target.value)}
                    className="w-full text-sm font-semibold font-mono rounded-2xl border border-[rgba(0,120,140,0.3)] px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0096a0]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={applyCustomHome}
                  className="flex-1 bg-[#0096a0] hover:bg-[#007b85] text-white text-sm font-extrabold py-3 rounded-2xl transition-colors active:scale-[0.98]"
                >
                  Apply Settings
                </button>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#1b3a4b] text-sm font-extrabold py-3 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Leaflet Map Popup */}
      {isMapOpen && (
        <MapView
          activeTab={activeTab}
          activities={filteredActivities}
          restaurants={filteredRestaurants}
          home={homeLocation}
          onClose={() => setIsMapOpen(false)}
          onSelectRestaurant={(r) => {
            setIsMapOpen(false);
            if (r.menu) {
              setActiveMenu({ url: r.menu, name: r.restaurant });
            }
          }}
          onSelectActivity={(a) => {
            setIsMapOpen(false);
          }}
        />
      )}

      {/* 7. Menu Zoom Modal */}
      {activeMenu && (
        <MenuModal
          menuUrl={activeMenu.url}
          restaurantName={activeMenu.name}
          onClose={() => setActiveMenu(null)}
        />
      )}

      {/* 8. Footer */}
      <div className="bg-[#1b3a4b] text-white/50 text-xs text-center py-6 border-t border-white/5">
        <p className="font-semibold">⛱️ Built for Casey & Family — Vacation Ocean City, MD</p>
        <p className="mt-1">Works 100% offline. Pre-geocoded coordinates matching Google My Maps.</p>
      </div>
    </div>
  );
}

function SortIcon({ col, sortCol, sortDir }: { col: string; sortCol: string | null; sortDir: SortDir }) {
  if (sortCol !== col) return <ChevronsUpDown className="inline ml-1 opacity-20" size={13} />;
  if (sortDir === "asc") return <ChevronUp className="inline ml-1 text-[#0096a0]" size={13} />;
  return <ChevronDown className="inline ml-1 text-[#0096a0]" size={13} />;
}
