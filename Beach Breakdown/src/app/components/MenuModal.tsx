import { useState } from "react";
import { X, ExternalLink, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface MenuModalProps {
  menuUrl: string;
  restaurantName: string;
  onClose: () => void;
}

export default function MenuModal({ menuUrl, restaurantName, onClose }: MenuModalProps) {
  const isExternal = menuUrl.startsWith("http://") || menuUrl.startsWith("https://");
  const [zoom, setZoom] = useState(1);

  function handleZoomIn() {
    setZoom((z) => Math.min(3, z + 0.25));
  }

  function handleZoomOut() {
    setZoom((z) => Math.max(0.5, z - 0.25));
  }

  function handleReset() {
    setZoom(1);
  }

  // Prepend local public menus folder if not external
  const finalUrl = isExternal ? menuUrl : `/menus/${menuUrl}`;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl h-[90vh] bg-background rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-[rgba(0,150,160,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1b3a4b] text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#f4a261]">Restaurant Menu</p>
            <h2 className="text-2xl font-heading font-bold leading-tight">{restaurantName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#1b2a32] flex flex-col items-center justify-center p-6 overflow-hidden relative">
          {isExternal ? (
            // External Menu UI
            <div className="max-w-md text-center p-8 bg-white rounded-3xl border border-[rgba(0,150,160,0.2)] shadow-xl animate-scale-up">
              <div className="w-16 h-16 bg-[#d4eeef] text-[#0096a0] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🌐
              </div>
              <h3 className="text-xl font-bold text-[#1b3a4b] mb-2 font-heading">External Menu Link</h3>
              <p className="text-sm text-[#5e7e8a] mb-6 leading-relaxed">
                Browser security prevents embedding external website menus directly. Click below to open this menu in a new tab.
              </p>
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full text-base font-bold text-white bg-[#0096a0] hover:bg-[#007b85] py-3.5 px-6 rounded-full transition-colors shadow-md"
              >
                Open Menu Website <ExternalLink size={18} />
              </a>
            </div>
          ) : (
            // Local Image Menu UI with Controls
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              {/* Overlay controls */}
              <div className="absolute top-4 right-4 z-20 flex gap-2 bg-[#1b3a4b]/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={20} />
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCcw size={20} />
                </button>
              </div>

              {/* Scrollable Zoom Area */}
              <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                <img
                  src={finalUrl}
                  alt={`${restaurantName} Menu`}
                  className="max-w-none transition-transform duration-200 shadow-2xl rounded-lg"
                  style={{
                    transform: `scale(${zoom})`,
                    maxHeight: "85%",
                    maxWidth: "90%",
                  }}
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const errorDiv = document.createElement("div");
                      errorDiv.className = "text-center text-white max-w-sm p-4";
                      errorDiv.innerHTML = `
                        <div class="text-4xl mb-2">⚠️</div>
                        <h4 class="font-bold text-lg">Menu File Not Found</h4>
                        <p class="text-xs text-white/60 mt-1">Please copy "${menuUrl}" into the "public/menus/" folder of your project to display it locally.</p>
                      `;
                      parent.appendChild(errorDiv);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
