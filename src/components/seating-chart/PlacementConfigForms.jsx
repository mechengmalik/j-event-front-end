import React from 'react';
import { SHAPES, ELEMENT_TYPES, DEFAULT_ROW_SPACING, DEFAULT_COL_SPACING, isPlacementTool, getElementTypeFromTool } from './constants';

const PlacementConfigForms = ({ selectedTool, config, onConfigChange }) => {
  if (!isPlacementTool(selectedTool) || !config) return null;

  const elementType = getElementTypeFromTool(selectedTool);

  const handleChange = (updates) => {
    onConfigChange({ ...config, ...updates });
  };

  // Simplified: Render inputs based on elementType and current config keys
  // You might want more specific forms like the original had
  switch (elementType) {
    case ELEMENT_TYPES.TABLE:
    case ELEMENT_TYPES.STAGE:
      return (
        <div className="space-y-2 mt-2 p-2 border rounded bg-gray-50">
          <h5 className="text-xs font-semibold mb-1">{elementType.charAt(0).toUpperCase() + elementType.slice(1)} Options:</h5>
          <label className="block text-xs">
            Shape
            <select
              value={config.shape || ""}
              onChange={(e) => handleChange({ shape: e.target.value })}
              className="mt-1 w-full px-2 py-1 border rounded text-xs"
            >
              {Object.values(SHAPES).map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs">
            Fill Color
            <input
              type="color"
              value={config.fill || "#888888"}
              onChange={(e) => handleChange({ fill: e.target.value })}
              className="mt-1 w-full h-8 px-1 py-1 border rounded"
            />
          </label>
           {/* Add more specific inputs based on shape if needed */}
        </div>
      );
    case ELEMENT_TYPES.FLOOR:
         return (
            <div className="space-y-2 mt-2 p-2 border rounded bg-gray-50">
               <h5 className="text-xs font-semibold mb-1">Floor Options:</h5>
                <label className="block text-xs"> Label
                    <input type="text" value={config.text || ""} onChange={(e) => handleChange({ text: e.target.value })} className="mt-1 w-full px-2 py-1 border rounded text-xs"/>
                </label>
                <label className="block text-xs"> Default Length
                    <input type="number" min="50" step="10" value={config.length || ""} onChange={(e) => handleChange({ length: parseInt(e.target.value, 10) || 200 })} className="mt-1 w-full px-2 py-1 border rounded text-xs"/>
                </label>
                <label className="block text-xs"> Color
                    <input type="color" value={config.color || "#4a5568"} onChange={(e) => handleChange({ color: e.target.value })} className="mt-1 w-full h-8 px-1 py-1 border rounded"/>
                </label>
            </div>
         );
    case ELEMENT_TYPES.ENTRANCE:
    case ELEMENT_TYPES.EXIT:
          return (
            <div className="mt-2 p-2 text-center">
               <p className="text-xs text-gray-500">Click canvas to place.</p>
             </div>
          );
    default:
      return null; // No config form needed for DRAW_SECTION here
  }
};

export default PlacementConfigForms;