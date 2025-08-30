import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";

const SearchBar = ({ onSearch, placeholder = "Search articles..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    // Real-time search
    onSearch(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Input
            type="search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            className="pl-12 pr-4 py-3 w-full text-base"
          />
          <Icon
            name="Search"
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
          />
        </div>

        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              onSearch("");
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </form>

      {/* Popular Searches */}
      <div className="mt-4">
        <div className="text-sm text-slate-600 mb-2">Popular searches:</div>
        <div className="flex flex-wrap gap-2">
          {["React", "Next.js", "Mobile Development", "E-commerce", "SEO"].map(
            (term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchTerm(term);
                  onSearch(term);
                }}
                className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
