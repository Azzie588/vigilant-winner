import { useEffect, useRef, useState } from "react";
import { Bus } from "lucide-react";

export default function TransitBadge({ detail }: { detail: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Show public transportation detail"
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#d4eeef] text-[#0096a0] hover:bg-[#c0e6e8] transition-colors active:scale-95"
      >
        <Bus size={13} />
      </button>
      {open && (
        <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-1.5 w-56 rounded-xl bg-white border border-[rgba(0,120,140,0.2)] shadow-lg px-3 py-2 text-xs text-[#1b3a4b] text-left whitespace-normal">
          {detail || "No additional detail."}
        </div>
      )}
    </div>
  );
}
