import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface CartIconProps {
  onClick?: () => void;
  className?: string;
  showText?: boolean;
}

export default function CartIcon({ onClick, className, showText = false }: CartIconProps) {
  return (
    <Link
      href="/Cart"
      onClick={onClick}
      className={`relative flex items-center text-gray-700 hover:text-emerald-600 transition-colors ${className || ""}`}
      title="Cart"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
        0
      </span>
      {showText && <span className="ml-2 font-medium text-sm">Cart</span>}
    </Link>
  );
}
