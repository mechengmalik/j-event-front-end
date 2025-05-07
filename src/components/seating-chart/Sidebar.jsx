// src/components/SeatingMapBuilder/Sidebar.jsx
import React from 'react';
import ElementPalette from './ElementPalette';
import PlacementConfigForms from './PlacementConfigForms';
import PropertiesPanel from './PropertiesPanel';
import { isPlacementTool } from './constants'; // Assuming this helper exists

const Sidebar = ({
    selectedTool,
    currentPlacementConfig,
    selectedSectionData,
    selectedElementData,
    selectedElementIds, // Need this to check if anything is selected
    elements,
    onSelectTool,
    onPlacementConfigChange,
    onUpdateSection,
    onUpdateElement,
    onDelete,
    onSave,
    selectedSectionId
 }) => {
  // Determine if any element (individual or section boundary) is selected
  const isAnythingSelected = selectedElementIds && selectedElementIds.length > 0;

  return (
    <div className="w-1/5 flex-shrink-0 bg-white shadow-md p-3 space-y-3 overflow-y-auto flex flex-col">
      {/* Element Palette */}
      <ElementPalette selectedTool={selectedTool} onSelectTool={onSelectTool} />

      {/* Configuration Forms (for placing NEW elements) */}
      {/* Show only if a placement tool is active AND NOTHING is selected on the canvas */}
      {isPlacementTool(selectedTool) && !isAnythingSelected && !selectedSectionId && (
        <PlacementConfigForms
           selectedTool={selectedTool}
           config={currentPlacementConfig}
           onConfigChange={onPlacementConfigChange}
        />
      )}

      {/* Selected Element/Section Properties Panel */}
      {/* Show if a section is selected OR any individual elements are selected */}
      {(selectedSectionData || isAnythingSelected) && (
        <div className="flex-grow flex flex-col min-h-0"> {/* Allow properties to scroll */}
           <PropertiesPanel
              selectedSectionData={selectedSectionData}
              selectedElementData={selectedElementData}
              selectedElementIds={selectedElementIds}
              elements={elements}
              onUpdateSection={onUpdateSection}
              onUpdateElement={onUpdateElement}
              onDelete={onDelete}
              onSave={onSave}
              // Remove seat select mode props if not used
            />
        </div>
      )}

      {/* Placeholder if nothing is selected and no placement tool is active for config */}
      {!selectedSectionData && !isAnythingSelected && !isPlacementTool(selectedTool) && (
          <p className="text-xs text-gray-500 text-center mt-4">
              Select an element to edit its properties, or choose a tool to place a new element.
          </p>
      )}
    </div>
  );
};

export default Sidebar;
