import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full relative">
      <Input
        type="text"
        placeholder="Buscar productos, categorías, marcas..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full py-2 pl-10 pr-4 bg-neutral-50 dark:bg-neutral-700"
      />
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
    </form>
  );
}
