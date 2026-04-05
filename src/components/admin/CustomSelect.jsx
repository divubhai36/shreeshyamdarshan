import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

const CustomSelect = ({ options, value, onChange, placeholder, isSearchable = false, className = "", disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = isSearchable 
    ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-brand-primary/2 border border-brand-primary/5 rounded-2xl p-4 text-xs font-bold text-brand-primary outline-none focus:ring-4 focus:ring-brand-secondary/5 transition-all text-left ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-brand-primary/5'}`}
      >
        <span className={!selectedOption ? "opacity-30" : ""}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon icon="solar:alt-arrow-down-linear" className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="fixed sm:absolute z-[110] left-0 right-0 mt-2 bg-white rounded-2xl border border-brand-primary/5 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 min-w-full">
          {isSearchable && (
            <div className="p-3 border-b border-brand-primary/5 relative">
              <Icon icon="solar:magnifer-linear" className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary/20 w-3 h-3" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-primary/2 rounded-xl p-2.5 pl-10 text-[10px] font-bold text-brand-primary outline-none border-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto no-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-[10px] text-brand-primary/30 uppercase font-bold tracking-widest">No results</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left p-4 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-brand-primary/5 ${value === opt.value ? 'text-brand-secondary bg-brand-secondary/5' : 'text-brand-primary/60'}`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
