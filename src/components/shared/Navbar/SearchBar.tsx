import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  onSearchSubmit?: () => void;
  className?: string;
}

export default function SearchBar({ onSearchSubmit, className }: SearchBarProps) {
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
    <form onSubmit={handleSearch} className={`relative flex ${className || ""}`}>
      <input
        type="text"
        placeholder="Search..."
        className="w-full h-10 pl-4 pr-12 border border-gray-200 dark:border-gray-700 rounded-l-md bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        type="submit"
        className="h-10 px-4 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-r-md transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}
