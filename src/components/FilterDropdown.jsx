import React, { useState, useEffect, useRef } from 'react';
import { Filter } from 'lucide-react';

const FilterDropdown = ({ options, columnName, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      String(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelect = (option) => {
    const newValue = selectedValue === option ? '' : option;
    setSelectedValue(newValue);
    onFilterChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-1 rounded text-sm transition-colors ${selectedValue ? 'bg-yellow-300 text-yellow-900' : 'text-gray-700 hover:bg-gray-200'}`}
      >
        <span className="truncate">{selectedValue || `Filter ${columnName}...`}</span>
        <Filter size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b"
          />
          <ul className="max-h-60 overflow-y-auto">
            <li
              onClick={() => handleSelect('')}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-500 italic"
            >
              - Clear Filter -
            </li>
            {filteredOptions.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedValue === option ? 'bg-blue-100 font-bold' : ''}`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;