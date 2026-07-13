import { useEffect, useRef } from "react";
import { X, MapPin } from "lucide-react";
import { Activity, Restaurant, HomeLocation } from "../../types";

// Access global Leaflet variable from window
declare const L: any;

interface MapViewProps {
  activeTab: "activities" | "restaurants";
  activities: Activity[];
  restaurants: Restaurant[];
  home: HomeLocation;
  onClose: () => void;
  onSelectRestaurant?: (r: Restaurant) => void;
  onSelectActivity?: (a: Activity) => void;
}

export default function MapView({
  activeTab,
  activities,
  restaurants,
  home,
  onClose,
  onSelectRestaurant,
  onSelectActivity,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const homeMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof L === "undefined") {
      console.error("Leaflet is not loaded.");
      return;
    }

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current).setView([home.lat, home.lng], 14);
    mapRef.current = map;

    // Add high-quality OpenStreetMap map tiles (CartoDB Positron is very clean and premium looking)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    // Clean up on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Home Marker and center map when home location changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || typeof L === "undefined") return;

    if (homeMarkerRef.current) {
      map.removeLayer(homeMarkerRef.current);
    }

    // Create a beautiful custom beach house icon for Home
    const homeIcon = L.divIcon({
      html: `
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-[#f4a261] border-2 border-white shadow-lg text-white transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
          🏠
        </div>
      `,
      className: "",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const homeMarker = L.marker([home.lat, home.lng], { icon: homeIcon })
      .addTo(map)
      .bindPopup(`
        <div class="p-2 font-sans">
          <p class="text-xs uppercase font-bold text-[#5e7e8a] tracking-wider mb-0.5">Vacation Home Base</p>
          <p class="font-bold text-base text-[#1b3a4b]">${home.name}</p>
        </div>
      `);
    
    homeMarkerRef.current = homeMarker;
    map.setView([home.lat, home.lng], 14);
  }, [home]);

  // Update markers when filtered data changes (shows activities and restaurants together)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || typeof L === "undefined") return;

    // Remove existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    const combinedList: { item: Activity | Restaurant; isRestaurant: boolean }[] = [
      ...restaurants.map((item) => ({ item, isRestaurant: true })),
      ...activities.map((item) => ({ item, isRestaurant: false })),
    ];
    const bounds: any[] = [[home.lat, home.lng]];

    combinedList.forEach(({ item, isRestaurant }) => {
      if (item.lat === null || item.lng === null) return;

      const lat = item.lat;
      const lng = item.lng;
      bounds.push([lat, lng]);

      // Define pin styling based on category or type
      const color = isRestaurant ? "#0096a0" : "#725ac1";
      const iconEmoji = isRestaurant ? "🍔" : "🎡";

      const pinIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full shadow-md text-white border-2 border-white" style="background-color: ${color}; transform: translate(-50%, -50%);">
            <span class="text-xs">${iconEmoji}</span>
          </div>
        `,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      // Prepare Popup Content
      let popupContent = "";
      if (isRestaurant) {
        const r = item as Restaurant;
        popupContent = `
          <div class="p-2 font-sans min-w-[200px]">
            <p class="text-xs uppercase font-bold text-[#5e7e8a] mb-0.5">${r.generalType}</p>
            <p class="font-bold text-base text-[#1b3a4b] mb-1">${r.restaurant}</p>
            <p class="text-xs text-muted-foreground mb-2">${r.address}</p>
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#d4eeef] text-[#0096a0]">${r.distanceCategory}</span>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#fdefc8] text-[#7a4f00]">${r.level}</span>
            </div>
            ${
              r.menu
                ? `<button id="map-menu-btn-${r.id}" class="w-full text-center text-xs font-bold text-white bg-[#0096a0] hover:bg-[#007b85] py-1.5 px-3 rounded-full transition-colors">View Menu</button>`
                : ""
            }
          </div>
        `;
      } else {
        const a = item as Activity;
        popupContent = `
          <div class="p-2 font-sans min-w-[200px]">
            <p class="text-xs uppercase font-bold text-[#5e7e8a] mb-0.5">${a.category}</p>
            <p class="font-bold text-base text-[#1b3a4b] mb-1">${a.name}</p>
            <p class="text-xs text-muted-foreground mb-2">${a.address}</p>
            <p class="text-xs font-semibold text-[#1b3a4b] leading-snug mb-3">${a.what}</p>
            <div class="flex gap-1.5">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#eeece6] text-[#5e7e8a]">${a.distance}</span>
              ${
                a.reachableByTransit
                  ? `<span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#0096a0]/15 text-[#0096a0]">✓ Transit</span>`
                  : ""
              }
            </div>
          </div>
        `;
      }

      const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);

      marker.bindPopup(popupContent);

      // Bind button events after popup open
      marker.on("popupopen", () => {
        if (isRestaurant && onSelectRestaurant) {
          const btn = document.getElementById(`map-menu-btn-${item.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectRestaurant(item as Restaurant);
            };
          }
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds of the map to include home and all markers
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [activities, restaurants, home]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl h-[85vh] bg-background rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[rgba(0,150,160,0.2)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1b3a4b] text-white">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-[#f4a261]" />
            <div>
              <h2 className="text-xl font-heading font-bold">
                Map View: All Locations
              </h2>
              <p className="text-xs text-white/70">
                Showing {activities.length} activities &amp; {restaurants.length} restaurants relative to your Home Base
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Leaflet Map Div */}
        <div className="flex-1 w-full h-full relative">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }} />
        </div>
      </div>
    </div>
  );
}
