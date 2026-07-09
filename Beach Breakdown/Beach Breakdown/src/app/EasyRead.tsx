import { MapPin, Phone, Clock, Globe, BookOpen } from "lucide-react";
import { Activity, Restaurant } from "../types";
import { formatDistance, getWebsiteUrl } from "../utils/distance";

interface EasyReadProps {
  activeTab: "activities" | "restaurants";
  activities: Activity[];
  restaurants: Restaurant[];
  onOpenMenu: (menuUrl: string, name: string) => void;
  onOpenMap: () => void;
}

export default function EasyRead({
  activeTab,
  activities,
  restaurants,
  onOpenMenu,
  onOpenMap,
}: EasyReadProps) {
  const isRestaurants = activeTab === "restaurants";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
      {isRestaurants ? (
        restaurants.length === 0 ? (
          <div className="text-center py-16 text-2xl font-bold text-[#5e7e8a] font-heading bg-card rounded-3xl p-6 border-2 border-dashed border-[#0096a0]/20">
            🏖️ No restaurants match your filters.
          </div>
        ) : (
          restaurants.map((r) => {
            const displayDist = r.calculatedDistance !== undefined ? formatDistance(r.calculatedDistance) : r.distance;
            return (
              <div
                key={r.id}
                className="bg-card rounded-3xl border-3 border-[rgba(0,150,160,0.22)] shadow-md overflow-hidden animate-scale-up"
              >
                {/* Visual Category Stripe */}
                <div className="h-3 w-full bg-gradient-to-r from-[#0096a0] to-[#f4a261]" />

                <div className="p-6 sm:p-8">
                  {/* Title & Badge */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1b3a4b] leading-tight">
                      {r.restaurant}
                    </h2>
                    <div className="flex gap-2">
                      <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-[#d4eeef] text-[#0096a0] uppercase border border-[#0096a0]/25">
                        {r.filterLevel || r.level}
                      </span>
                    </div>
                  </div>

                  {/* General Type of Food */}
                  {r.generalType && (
                    <p className="text-lg sm:text-xl text-[#0077b6] font-extrabold mb-5">
                      🍕 {r.generalType}
                    </p>
                  )}

                  {/* Core details in big text */}
                  <div className="flex flex-col gap-5 mb-6">
                    {/* Distance & Address */}
                    <div className="flex gap-4">
                      <MapPin size={26} className="shrink-0 text-[#0096a0] mt-0.5" />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-[#5e7e8a] mb-0.5">Location</p>
                        <p className="text-lg sm:text-xl font-bold text-[#1b3a4b] leading-snug">{r.address}</p>
                        <p className="text-lg text-[#0077b6] font-black mt-1">
                          📍 {displayDist} away ({r.distanceCategory})
                        </p>
                      </div>
                    </div>

                    {/* Hours */}
                    {r.hours && (
                      <div className="flex gap-4">
                        <Clock size={26} className="shrink-0 text-[#0096a0] mt-0.5" />
                        <div>
                          <p className="text-sm font-bold uppercase tracking-wider text-[#5e7e8a] mb-0.5">Hours</p>
                          <p className="text-lg sm:text-xl font-bold text-[#1b3a4b] leading-snug">{r.hours}</p>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {r.notes && (
                      <div className="bg-[#fef9ec] border-2 border-[rgba(0,150,160,0.12)] rounded-2xl p-4 sm:p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#5e7e8a] mb-1.5">Good to Know</p>
                        <p className="text-base sm:text-lg font-bold text-[#1b3a4b] leading-relaxed">{r.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {r.menu ? (
                      <button
                        onClick={() => onOpenMenu(r.menu, r.restaurant)}
                        className="flex items-center justify-center gap-2 text-base font-extrabold text-white bg-[#0096a0] hover:bg-[#007b85] py-3.5 px-4 rounded-2xl transition-all shadow-sm active:scale-[0.98] select-none"
                      >
                        <BookOpen size={20} /> View Menu
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center gap-2 text-base font-extrabold text-[#5e7e8a] bg-gray-100 py-3.5 px-4 rounded-2xl cursor-not-allowed opacity-60"
                      >
                        No Menu
                      </button>
                    )}

                    {r.websiteUrl ? (
                      <a
                        href={r.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-base font-extrabold text-[#0096a0] bg-white border-2 border-[#0096a0] hover:bg-[#d4eeef]/20 py-3.5 px-4 rounded-2xl transition-all shadow-sm text-center active:scale-[0.98]"
                      >
                        <Globe size={20} /> Website
                      </a>
                    ) : null}

                    <button
                      onClick={onOpenMap}
                      className="flex items-center justify-center gap-2 text-base font-extrabold text-[#1b3a4b] bg-[#fdefc8] border-2 border-[#f4a261]/40 hover:bg-[#fdefc8]/85 py-3.5 px-4 rounded-2xl transition-all shadow-sm active:scale-[0.98] select-none"
                    >
                      🗺️ Map Pin
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )
      ) : (
        // Activities
        activities.length === 0 ? (
          <div className="text-center py-16 text-2xl font-bold text-[#5e7e8a] font-heading bg-card rounded-3xl p-6 border-2 border-dashed border-[#0096a0]/20">
            🏖️ No activities match your filters.
          </div>
        ) : (
          activities.map((a) => {
            const displayDist = a.calculatedDistance !== undefined ? formatDistance(a.calculatedDistance) : a.distance;
            return (
              <div
                key={a.id}
                className="bg-card rounded-3xl border-3 border-[rgba(114,90,193,0.22)] shadow-md overflow-hidden animate-scale-up"
              >
                {/* Visual Category Stripe */}
                <div className="h-3 w-full bg-gradient-to-r from-[#725ac1] to-[#00b4d8]" />

                <div className="p-6 sm:p-8">
                  {/* Title & Badge */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#1b3a4b] leading-tight">
                      {a.name}
                    </h2>
                    <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-[#725ac1]/10 text-[#725ac1] uppercase border border-[#725ac1]/20">
                      {a.category}
                    </span>
                  </div>

                  {/* What it is */}
                  {a.what && (
                    <p className="text-lg sm:text-xl text-[#725ac1] font-extrabold mb-5">
                      🌟 {a.what}
                    </p>
                  )}

                  {/* Core details in big text */}
                  <div className="flex flex-col gap-5 mb-6">
                    {/* Distance & Address */}
                    <div className="flex gap-4">
                      <MapPin size={26} className="shrink-0 text-[#725ac1] mt-0.5" />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-[#5e7e8a] mb-0.5">Location</p>
                        <p className="text-lg sm:text-xl font-bold text-[#1b3a4b] leading-snug">{a.address}</p>
                        <p className="text-lg text-[#725ac1] font-black mt-1">
                          📍 {displayDist} away
                        </p>
                      </div>
                    </div>

                    {/* Transit Details */}
                    {a.transitDetail && (
                      <div className="flex gap-4">
                        <span className="text-2xl shrink-0">🚌</span>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-wider text-[#5e7e8a] mb-0.5">Public Transport</p>
                          <p className="text-lg font-bold text-[#1b3a4b] leading-snug">{a.transitDetail}</p>
                        </div>
                      </div>
                    )}

                    {/* Hours */}
                    {a.hours && (
                      <div className="flex gap-4">
                        <Clock size={26} className="shrink-0 text-[#725ac1] mt-0.5" />
                        <div>
                          <p className="text-sm font-bold uppercase tracking-wider text-[#5e7e8a] mb-0.5">Hours</p>
                          <p className="text-lg sm:text-xl font-bold text-[#1b3a4b] leading-snug">{a.hours}</p>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {a.notes && (
                      <div className="bg-[#fef9ec] border-2 border-[rgba(114,90,193,0.12)] rounded-2xl p-4 sm:p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#5e7e8a] mb-1.5">Good to Know</p>
                        <p className="text-base sm:text-lg font-bold text-[#1b3a4b] leading-relaxed">{a.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {a.url ? (
                      <a
                        href={getWebsiteUrl(a.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-base font-extrabold text-white bg-[#725ac1] hover:bg-[#5b46a1] py-3.5 px-4 rounded-2xl transition-all shadow-sm text-center active:scale-[0.98] select-none"
                      >
                        <Globe size={20} /> Website
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center gap-2 text-base font-extrabold text-[#5e7e8a] bg-gray-100 py-3.5 px-4 rounded-2xl cursor-not-allowed opacity-60"
                      >
                        No Website
                      </button>
                    )}

                    <button
                      onClick={onOpenMap}
                      className="flex items-center justify-center gap-2 text-base font-extrabold text-[#1b3a4b] bg-[#fdefc8] border-2 border-[#f4a261]/40 hover:bg-[#fdefc8]/85 py-3.5 px-4 rounded-2xl transition-all shadow-sm active:scale-[0.98] select-none"
                    >
                      🗺️ Map Pin
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )
      )}
    </div>
  );
}
