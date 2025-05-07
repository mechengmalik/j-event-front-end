// src/components/SeatingMapBuilder/SectionProperties.jsx
import React from 'react';
import { DEFAULT_ROW_SPACING, DEFAULT_COL_SPACING } from './constants'; // Adjust path if needed

const SectionProperties = ({ section, onUpdate, onDelete, onSave }) => {
  if (!section) return <p className="text-xs text-gray-500">Section data missing.</p>;

  // Handles text input changes (like section name)
  const handleChange = (prop, value) => {
    onUpdate(section.id, { [prop]: value }, false); // Don't save on every keystroke
  };

  // Handles number input changes
  const handleNumChange = (prop, valStr) => {
    onUpdate(section.id, { [prop]: parseInt(valStr, 10) || 0 }, false);
  };

  // Handles blur event for inputs, triggering a save
  const handleBlur = () => {
    onSave();
  }

  // Handles mouse up for range slider, triggering a save
  const handleRangeMouseUp = () => {
    onSave();
  }

  return (
    <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">Section Properties</h4>

        {/* Section Name Input */}
        <label className="block text-xs font-medium text-gray-700"> Section Name
            <input
                type="text"
                value={section.name || ""} // Display current section name
                onChange={(e) => handleChange('name', e.target.value)} // Update 'name' property
                onBlur={handleBlur} // Save on blur
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
            />
        </label>

        <label className="block text-xs font-medium text-gray-700"> Rows
            <input
                type="number" min="1" step="1"
                value={section.rows || ""}
                onChange={(e) => handleNumChange('rows', e.target.value)}
                onBlur={handleBlur}
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
            />
        </label>
        <label className="block text-xs font-medium text-gray-700"> Cols
            <input
                type="number" min="1" step="1"
                value={section.cols || ""}
                onChange={(e) => handleNumChange('cols', e.target.value)}
                onBlur={handleBlur}
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
            />
        </label>
        <label className="block text-xs font-medium text-gray-700"> Row Spacing
            <input
                type="number" min="10" step="5"
                value={section.rowSpacing || DEFAULT_ROW_SPACING}
                onChange={(e) => handleNumChange('rowSpacing', e.target.value)}
                onBlur={handleBlur}
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
            />
        </label>
        <label className="block text-xs font-medium text-gray-700"> Col Spacing
            <input
                type="number" min="10" step="5"
                value={section.colSpacing || DEFAULT_COL_SPACING}
                onChange={(e) => handleNumChange('colSpacing', e.target.value)}
                onBlur={handleBlur}
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
            />
        </label>
        <label className="block text-xs font-medium text-gray-700"> Curve ({section.curve || 0}%)
            <input
                type="range" min="0" max="100" step="1"
                value={section.curve || 0}
                onChange={(e) => handleNumChange('curve', e.target.value)}
                onMouseUp={handleRangeMouseUp} // Save on slider release
                className="mt-1 block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
        </label>

        <button
            onClick={() => onDelete()} // This onDelete is from useSeatingMapState -> deleteSelected
            className="w-full mt-2 p-2 rounded border text-xs bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
        >
            Delete Section
        </button>
    </div>
  );
};

export default SectionProperties;
