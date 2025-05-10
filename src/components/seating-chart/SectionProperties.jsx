// src/components/SeatingMapBuilder/SectionProperties.jsx
import React from 'react';
import { DEFAULT_ROW_SPACING, DEFAULT_COL_SPACING } from './constants'; // Adjust path if needed
import increaseIcon from "../../assets/icons/increase.svg"
import decreaseIcon from "../../assets/icons/decrease.svg"

const SectionProperties = ({ section, onUpdate, onDelete, onSave, onCopy }) => {
  if (!section) return <p className="text-xs text-gray-500">Section data missing.</p>;

  const handleChange = (prop, value) => {
    onUpdate(section.id, { [prop]: value }, false);
  };

  const handleNumChange = (prop, valStr) => {
    onUpdate(section.id, { [prop]: parseInt(valStr, 10) || 0 }, false);
  };

  const handleBlur = () => {
    onSave();
  };

  const handleRangeChange = (prop, value) => {
    onUpdate(section.id, { [prop]: parseInt(value, 10) || 0 }, false);
  };

  const handleRangeMouseUp = () => {
    onSave();
  };

  return (
    <div className="bg-white text-left  space-y-3">
      <h4 className=" bg-black/5 text-sm font-semibold text-gray-700 uppercase p-2">Section Properties</h4>

      {/* Section Name Input */}
      <div className="space-y-1 pr-2 pl-2" >
        <label className="block text-xs font-normal text-sm">Section Name</label>
        <input
          type="text"
          value={section.name || ""}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={handleBlur}
          className="mt-1 block w-full px-3 py-2 border border-gray-300  text-xs focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Rows Input */}
      <div className="space-y-1  pr-2 pl-2">
        <label className="block text-xs font-normal text-gray-700">Rows</label>
        <div className="relative ">
          <input
            type="number"
            min="1"
            step="1"
            value={section.rows || ""}
            onChange={(e) => handleNumChange('rows', e.target.value)}
            onBlur={handleBlur}
            className="mt-1 block w-full px-3 py-2 border border-gray-300  text-xs focus:ring-indigo-500 focus:border-indigo-500 pr-8" // Added pr-8 for arrow space
          />
          <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center px-2 pointer-events-none">
            <img src={increaseIcon} className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <img src={decreaseIcon} className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Columns Input */}
      <div className="space-y-1  pr-2 pl-2 ">
        <label className="block text-xs font-normal text-gray-700">Columns</label>
        <div className="relative ">
          <input
            type="number"
            min="1"
            step="1"
            value={section.cols || ""}
            onChange={(e) => handleNumChange('cols', e.target.value)}
            onBlur={handleBlur}
            className="mt-1 block w-full px-3 py-2 border border-gray-300  text-xs focus:ring-indigo-500 focus:border-indigo-500 pr-8"
          />
          <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center px-2 pointer-events-none">
            <img src={increaseIcon} className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <img src={decreaseIcon} className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Row Spacing Input */}
      <div className="space-y-1 pr-2 pl-2" >
        <label className="block text-xs font-normal text-gray-700">Row Spacing</label>
        <div className="relative ">
          <input
            type="number"
            min="10"
            step="5"
            value={section.rowSpacing || DEFAULT_ROW_SPACING}
            onChange={(e) => handleNumChange('rowSpacing', e.target.value)}
            onBlur={handleBlur}
            className="mt-1 block w-full px-3 py-2 border border-gray-300  text-xs focus:ring-indigo-500 focus:border-indigo-500 pr-8"
          />
          <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center px-2 pointer-events-none">
            <img src={increaseIcon} className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <img src={decreaseIcon} className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Column Spacing Input */}
      <div className="space-y-1 pr-2 pl-2" >
        <label className="block text-xs font-normal text-gray-700">Column Spacing</label>
        <div className="relative ">
          <input
            type="number"
            min="10"
            step="5"
            value={section.colSpacing || DEFAULT_COL_SPACING}
            onChange={(e) => handleNumChange('colSpacing', e.target.value)}
            onBlur={handleBlur}
            className="mt-1 block w-full px-3 py-2 border border-gray-300  text-xs focus:ring-indigo-500 focus:border-indigo-500 pr-8"
          />
          <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center px-2 pointer-events-none">
            <img src={increaseIcon} className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <img src={decreaseIcon} className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Curve Input with Number */}
      <div className="space-y-1 pr-2 pl-2" >
        <label className="block text-xs font-normal text-gray-700">Curve ({section.curve || 0}%)</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={section.curve || 0}
            onChange={(e) => handleRangeChange('curve', e.target.value)}
            onMouseUp={handleRangeMouseUp}
            className="block w-full h-2 bg-gray-200  appearance-none cursor-pointer accent-purple-600"
          />
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={section.curve || 0}
            onChange={(e) => handleNumChange('curve', e.target.value)}
            onBlur={handleBlur}
            className="w-16 px-2 py-1 border border-gray-300  text-xs focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => onDelete()}
          className="w-full py-2 rounded border text-xs bg-red-100 border-red-300 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          Delete
        </button>
        <button
          onClick={onCopy}
          className="w-full py-2 rounded border text-xs bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default SectionProperties;