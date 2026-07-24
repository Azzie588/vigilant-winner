import type { ReactNode } from "react";
import {
  FerrisWheel,
  Beer,
  Sailboat,
  Puzzle,
  Gamepad2,
  Popcorn,
  Flag,
  CircleEllipsis,
  Sun,
  ShoppingBag,
  Waves,
} from "lucide-react";

// Maps each (narrowed) activity category to the icon shown in the Category column.
// Falls back to CircleEllipsis for any category not listed here.
export const CATEGORY_ICONS: Record<string, ReactNode> = {
  "Amusement Parks": <FerrisWheel size={13} />,
  "Brews": <Beer size={13} />,
  "Cruise": <Sailboat size={13} />,
  "Escape Room": <Puzzle size={13} />,
  "Games": <Gamepad2 size={13} />,
  "Indoor Entertainment": <Popcorn size={13} />,
  "Mini Golf": <Flag size={13} />,
  "Other": <CircleEllipsis size={13} />,
  "Outdoor Entertainment": <Sun size={13} />,
  "Shopping": <ShoppingBag size={13} />,
  "Water Sports": <Waves size={13} />,
};

export function getCategoryIcon(category: string): ReactNode {
  return CATEGORY_ICONS[category] ?? <CircleEllipsis size={13} />;
}
