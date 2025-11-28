import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ query, setQuery }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex items-center gap-3 border border-gray-100">
            <Search className="w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search by name or creator..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full outline-none text-gray-700 placeholder-gray-400"
            />
        </div>
    );
}
