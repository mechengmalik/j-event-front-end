import React from "react";
import {
  SHAPES,
  ELEMENT_TYPES,
  TOOLS,
  PATH_DATA,
  isPlacementTool,
  getElementTypeFromTool,
} from "./constants";

const PlacementConfigForms = ({
  selectedTool,
  config,
  onConfigChange,
  onSelectedSVGPath,
  selectedSVGPath,
  predefinedSvgPaths,
}) => {
  if (!isPlacementTool(selectedTool) || !config) return null;

  const elementType = getElementTypeFromTool(selectedTool);

  const handleChange = (updates) => {
    onConfigChange({ ...config, ...updates });
  };

  // Simplified: Render inputs based on elementType and current config keys
  // You might want more specific forms like the original had
  switch (elementType) {
    case ELEMENT_TYPES.DRAW_SECTION:
      return (
        <div className="space-y-2">
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">
              Seat Style
            </h4>
            <div className="grid grid-cols-2 gap-0">
              {/* Apply grid to the container */}
              {predefinedSvgPaths.map((shape) => (
                <div className="border border-black/10">
                  <button
                    key={shape.name}
                    className={`flex flex-col w-full items-center justify-center p-6  ${
                      selectedSVGPath === PATH_DATA[shape.name]
                        ? "bg-blue-50 border-blue-300 text-blue-700 ring-2 ring-blue-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => onSelectedSVGPath(PATH_DATA[shape.name])}
                    title={shape.name}
                  >
                    <div className="w-10 h-10 flex items-center justify-center mb-1">
                      {shape.imageSrc ? (
                        <img
                          src={shape.imageSrc}
                          alt={shape.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        shape.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  </button>
                  <div
                    className={
                      "bg-gray-100 text-gray-700 text-center w-full py-1 font-normal text-sm"
                    }
                  >
                    {shape.name}
                  </div>
                </div>
              ))}
            </div>
            {/* You can add more controls here for other SVG properties if needed */}
          </div>
        </div>
      );
    case ELEMENT_TYPES.TABLE:
    case ELEMENT_TYPES.STAGE:
      return (
        <div className="bg-white text-left  space-y-3">
          <h4 className="bg-black/5 text-sm font-semibold text-gray-700 uppercase p-2">
            {elementType.charAt(0).toUpperCase() + elementType.slice(1)}{" "}
            Options:
          </h4>
          <div className="space-y-1 pr-2 pl-2">
            <label className="block text-xs">
              Shape
              <select
                value={config.shape || ""}
                onChange={(e) => handleChange({ shape: e.target.value })}
                className="mt-1 w-full px-2 py-1 border rounded text-xs"
              >
                {Object.values(SHAPES).map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="space-y-1 pr-2 pl-2">
            <label className="block text-xs">
              Fill Color
              <input
                type="color"
                value={config.fill || "#888888"}
                onChange={(e) => handleChange({ fill: e.target.value })}
                className="mt-1 w-full h-8 px-1 py-1 border rounded"
              />
            </label>
          </div>
          {/* Add more specific inputs based on shape if needed */}
        </div>
      );
    case ELEMENT_TYPES.FLOOR:
      return (
        <div className="bg-white text-left  space-y-3">
          <h5 className="bg-black/5 text-sm font-semibold text-gray-700 uppercase p-2">
            Floor Options:
          </h5>
          <div className="space-y-1 pr-2 pl-2">
            <label className="block text-xs">
              Label
              <input
                type="text"
                value={config.text || ""}
                onChange={(e) => handleChange({ text: e.target.value })}
                className="mt-1 w-full px-2 py-1 border rounded text-xs"
              />
            </label>
          </div>
          <div className="space-y-1 pr-2 pl-2">
            <label className="block text-xs">
              Color
              <input
                type="color"
                value={config.color || "#4a5568"}
                onChange={(e) => handleChange({ color: e.target.value })}
                className="mt-1 w-full h-8 px-1 py-1 border rounded"
              />
            </label>
          </div>
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
