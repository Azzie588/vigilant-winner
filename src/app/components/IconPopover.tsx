import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface IconPopoverProps {
  icon: ReactNode;
  detail?: string;
  ariaLabel: string;
  emptyLabel?: string; // tooltip shown when there's no detail yet
  widthClass?: string;
  trigger?: "click" | "hover"; // how the popover is revealed; defaults to click
}

export default function IconPopover({
  icon,
  detail,
  ariaLabel,
  emptyLabel = "Not added yet",
  widthClass = "w-48",
  trigger = "click",
}: IconPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || trigger === "hover") return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, trigger]);

  if (!detail) {
    return (
      <span
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-300"
        title={emptyLabel}
        aria-label={`${ariaLabel}: ${emptyLabel}`}
      >
        {icon}
      </span>
    );
  }

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onMouseEnter={() => trigger === "hover" && setOpen(true)}
      onMouseLeave={() => trigger === "hover" && setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (trigger === "click") setOpen((v) => !v);
        }}
        aria-label={ariaLabel}
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#d4eeef] text-[#0096a0] hover:bg-[#c0e6e8] transition-colors active:scale-95"
      >
        {icon}
      </button>
      {open && (
        <div
          className={`absolute z-20 left-1/2 -translate-x-1/2 mt-1.5 ${widthClass} rounded-xl bg-white border border-[rgba(0,120,140,0.2)] shadow-lg px-3 py-2 text-xs text-[#1b3a4b] text-left whitespace-normal`}
        >
          {detail}
        </div>
      )}
    </div>
  );
}
