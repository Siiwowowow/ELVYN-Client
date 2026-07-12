// components/shared/Navbar/AuthButtons.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  onLinkClick?: () => void;
  orientation?: "horizontal" | "vertical";
  theme?: "light" | "primary";
}

export default function AuthButtons({
  onLinkClick,
  orientation = "horizontal",
  theme = "light",
}: Props) {
  if (theme === "primary" && orientation === "vertical") {
    return (
      <div className="flex flex-col gap-3 w-full">
        <Link
          href="/login"
          onClick={onLinkClick}
          className="w-full text-center py-2.5 text-sm font-medium text-white border border-emerald-500 rounded-lg bg-emerald-700/50 hover:bg-emerald-700 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          onClick={onLinkClick}
          className="w-full text-center py-2.5 text-sm font-medium text-emerald-800 bg-white rounded-lg hover:bg-emerald-50 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 ${
        orientation === "vertical" ? "flex-col" : "items-center"
      }`}
    >
      <Button variant="outline" size="sm" asChild>
        <Link href="/login" onClick={onLinkClick}>
          Login
        </Link>
      </Button>

      <Button size="sm" asChild>
        <Link href="/register" onClick={onLinkClick}>
          Sign Up
        </Link>
      </Button>
    </div>
  );
}