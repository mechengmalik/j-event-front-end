// src/components/SeatingMapBuilder/PropertiesPanel.jsx
import React from 'react';
import SectionProperties from './SectionProperties';
import ElementProperties from './ElementProperties';
import { ELEMENT_TYPES } from './constants'; // Import ELEMENT_TYPES

const PropertiesPanel = ({
  selectedSectionData,
  selectedElementData,
  selectedElementIds, // Need this to check for selected chairs
  elements, // Need this to get type of selected elements
  onUpdateSection,
  onUpdateElement,
  onDelete,
  onSave,
  selectedSectionId
}) => {
  const getSelectedChairCount = () => {
    if (!selectedElementIds || selectedElementIds.length === 0 || selectedSectionId) return 0;
    return selectedElementIds.filter(id => {
        const el = elements.find(e => e.id === id);
        return el && el.type === ELEMENT_TYPES.CHAIR;
    }).length;
  };

  const selectedChairCount = getSelectedChairCount();

  return (
    <div className="border-t pt-3 pb-2 space-y-3 overflow-y-auto">
      {selectedSectionData ? (
        <SectionProperties
          section={selectedSectionData}
          onUpdate={onUpdateSection}
          onDelete={onDelete}
          onSave={onSave}
          // Remove seat select mode props if not used
        />
      ) : selectedChairCount > 0 ? ( // *** NEW: Show if chairs are selected ***
        <div className="space-y-2 p-2">
            <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                Selected Seat(s)
            </h4>
            <p className="text-xs text-gray-700">
                {selectedChairCount} seat(s) selected.
            </p>
            <button
                onClick={() => onDelete()} // onDelete from hook will handle chair deletion
                className="w-full mt-2 p-2 rounded border text-xs bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
            >
                Delete Selected Seat(s)
            </button>
        </div>
      ) : selectedElementData ? (
        <ElementProperties
          element={selectedElementData}
          onUpdate={onUpdateElement}
          onDelete={onDelete}
          onSave={onSave}
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
