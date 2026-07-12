import Link from "next/link";
import { Heart } from "lucide-react";

interface WishlistIconProps {
  onClick?: () => void;
  className?: string;
  showText?: boolean;
}

export default function WishlistIcon({ onClick, className, showText = false }: WishlistIconProps) {
  return (
    <Link
      href="/Wishlist"
      onClick={onClick}
      className={`relative flex items-center text-gray-700 hover:text-emerald-600 transition-colors ${className || ""}`}
      title="Wishlist"
    >
      <Heart className="w-5 h-5" />
      <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
        10
      </span>
      {showText && <span className="ml-2 font-medium text-sm">Wishlist</span>}
    </Link>
  );
}
