import React, { useState, useEffect } from 'react';
import SectionProperties from './SectionProperties';
import ElementProperties from './ElementProperties';
import { ELEMENT_TYPES, PATH_DATA } from './constants';

const PropertiesPanel = ({
  selectedSectionData,
  selectedElementData,
  selectedElementIds,
  elements,
  onUpdateSection,
  onUpdateElement,
  onDelete,
  onSave,
  selectedSectionId,
  onCopy,
  handleColorChange,
  predefinedSvgPaths,
  selectedSVGPath,
  updateSelectedSeatsSvgPath
}) => {
 
  const getSelectedChairCount = () => {
    if (!selectedElementIds || selectedElementIds.length === 0 || selectedSectionId) return 0;
    return selectedElementIds.filter(id => {
      const el = elements.find(e => e.id === id);
      return el && el.type === ELEMENT_TYPES.CHAIR;
    }).length;
  };
  
  const selectedChairCount = getSelectedChairCount();
  
  // Local state for the UI
  const [newFillColor, setNewFillColor] = useState(() => {
    // Initialize with the fill color of the first selected chair, or default
    if (selectedElementIds && selectedElementIds.length > 0) {
      const firstElement = elements.find(e => e.id === selectedElementIds[0]);
      return firstElement?.fill || '#4A5568';
    }
    return '#4A5568';
  });
  
  // Update local state when selection changes
  useEffect(() => {
    if (selectedChairCount > 0) {
      // Update fill color from first selected element
      if (selectedElementIds && selectedElementIds.length > 0) {
        const firstElement = elements.find(e => e.id === selectedElementIds[0]);
        if (firstElement?.fill) {
          setNewFillColor(firstElement.fill);
        }
      }
    }
  }, [selectedElementIds, selectedChairCount, elements]);


  // Handle fill color change
  const handleSeatColorChange = (color) => {
    setNewFillColor(color);
    handleColorChange(color); // Pass to parent handler for immediate visual feedback
  };

  return (
    <div className=" pb-2 space-y-3 overflow-y-auto">
      {selectedSectionData ? (
        <SectionProperties
          section={selectedSectionData}
          onUpdate={onUpdateSection}
          onDelete={onDelete}
          onSave={onSave}
          onCopy={onCopy}
          handleColorChange={handleColorChange}
        />
      ) : selectedChairCount > 0 ? ( // *** Show if chairs are selected ***
        <div className="space-y-2 p-2">
          <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Selected Seat(s)
          </h4>
          <p className="text-xs text-gray-700">
            {selectedChairCount} seat(s) selected.
          </p>
          <div className="mb-2 flex gap-2">
            <label className="block text-gray-700 text-xs font-bold mb-1 w-full">Style:</label>
            <div className="flex gap-1">
              {predefinedSvgPaths.map((shape) => (
                <button
                  key={shape.name}
                  className={`w-8 h-8 border rounded flex items-center justify-center ${
                    selectedSVGPath === PATH_DATA[shape.name] ? 'bg-blue-200' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => updateSelectedSeatsSvgPath(selectedElementIds ,PATH_DATA[shape.name])}
                  title={shape.name}
                >
                  {PATH_DATA[shape.name]?.path ? (
                    <img src={PATH_DATA[shape.name]?.path} alt={shape.name} className="max-w-full max-h-full" />
                  ) : (
                    shape.name.charAt(0)
                  )}
                </button>
              ))}
            </div>
          </div>
          <label className="block text-gray-700 text-xs font-bold mb-2">
            Fill Color:
            <input
              type="color"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newFillColor}
              onChange={(e) => handleSeatColorChange(e.target.value)}
            />
          </label>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onDelete(selectedElementIds)}
              className="flex-1 p-2 rounded border text-xs bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
            >
              Delete
            </button>
            <button 
              onClick={() => onCopy(selectedElementIds)}
              className="flex-1 p-2 rounded border text-xs bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
            >
              Copy
            </button>
          </div>
        </div>
      ) : selectedElementData ? (
        <ElementProperties
          element={selectedElementData}
          onUpdate={onUpdateElement}
          onDelete={onDelete}
          onSave={onSave}
          onCopy={onCopy}
          handleColorChange={handleColorChange}
        />
      ) : (
        <p className="text-xs text-gray-500 text-center mt-4">
          Select an element or section to edit properties.
        </p>
      )}
    </div>
  );
};

export default PropertiesPanel;