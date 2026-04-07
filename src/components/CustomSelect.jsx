import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

/**
 * CustomSelect - A high-fidelity, searchable dropdown component.
 * Features:
 * - Premium Divine Boutique aesthetic.
 * - Search functionality for long lists.
 * - Responsive absolute/fixed positioning to prevent clipping.
 * - Smooth fade/zoom animations.
 */
const CustomSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select...", 
  isSearchable = false, 
  className = "", 
  disabled = false,
  theme = "light" // light | dark
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredOptions = isSearchable 
    ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between border rounded-2xl p-4 text-[11px] font-bold outline-none focus:ring-4 transition-all text-left 
          ${theme === 'dark' 
            ? 'bg-white/10 border-white/10 text-white focus:ring-white/5 hover:bg-white/20 shadow-lg' 
            : 'bg-brand-primary/2 border-brand-primary/5 text-brand-primary focus:ring-brand-secondary/5 hover:bg-brand-primary/5 shadow-sm hover:shadow-md'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={!selectedOption ? "opacity-30 italic font-serif" : "tracking-wider uppercase"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon icon="solar:alt-arrow-down-linear" className={`w-4 h-4 transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180 text-brand-secondary' : theme === 'dark' ? 'text-white/40' : 'text-brand-primary/20'}`} />
      </button>

      {isOpen && !disabled && (
        <div className="fixed sm:absolute z-[1000] left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-brand-primary/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden animate-in fade-in zoom-in duration-300 min-w-full origin-top transform-gpu">
          {isSearchable && (
            <div className="p-3 border-b border-brand-primary/5 relative bg-white">
              <Icon icon="solar:magnifer-linear" className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-secondary w-3.5 h-3.5" />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-primary/2 rounded-xl p-3 pl-11 text-[11px] font-bold text-brand-primary outline-none focus:ring-2 focus:ring-brand-secondary/10 border-none transition-all placeholder:text-brand-primary/20"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto no-scrollbar py-1">
            {filteredOptions.length === 0 ? (
              <div className="p-6 text-center text-[10px] text-brand-primary/30 italic font-serif">No logs matching your search...</div>
            ) : (
              filteredOptions.map((opt, idx) => (
                <button
                  key={`${opt.value}-${idx}`}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left p-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-brand-secondary/5 flex items-center justify-between ${value === opt.value ? 'text-brand-secondary bg-brand-secondary/3 border-l-2 border-brand-secondary pl-3' : 'text-brand-primary/60 border-l-2 border-transparent'}`}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && <Icon icon="solar:check-read-linear" className="w-4 h-4 text-brand-secondary" />}
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
