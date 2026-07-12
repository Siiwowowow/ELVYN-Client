import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  onSearchSubmit?: () => void;
  className?: string;
  theme?: "light" | "primary";
}

export default function SearchBar({ onSearchSubmit, className, theme = "light" }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/Search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      if (onSearchSubmit) onSearchSubmit();
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center ${className || ""}`}>
      <input
        type="text"
        placeholder="Search..."
        className={`w-full h-9 pl-9 pr-4 border rounded-lg text-xs focus:outline-none transition-colors ${
          theme === "primary"
            ? "border-emerald-500/30 bg-emerald-700/30 text-white placeholder-emerald-200/60 focus:border-white"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-emerald-500"
        }`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search className={`absolute left-3 w-4 h-4 pointer-events-none ${
        theme === "primary" ? "text-emerald-200" : "text-gray-400"
      }`} />
    </form>
  );
}
