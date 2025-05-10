import React from 'react';
import ElementPalette from './ElementPalette';
import PlacementConfigForms from './PlacementConfigForms';
import PropertiesPanel from './PropertiesPanel';
import { isPlacementTool, PATH_DATA, TOOLS, ELEMENT_TYPES } from './constants';

const Sidebar = ({
  selectedTool,
  onSelectedSVGPath,
  currentPlacementConfig,
  selectedSectionData,
  selectedElementData,
  selectedElementIds,
  elements,
  onSelectTool,
  onPlacementConfigChange,
  onUpdateSection,
  onUpdateElement,
  onDelete,
  onSave,
  selectedSectionId,
  onCopy,
  updateElementColor,
  updateSelectedSeatsSvgPath,
  predefinedSvgPaths
}) => {
  const isAnythingSelected = selectedElementIds && selectedElementIds.length > 0;
  
  
  const selectedSVGPath = currentPlacementConfig?.svgPath;
  
  // Handle color changes for both placement and selected elements
  const handleColorChange = (color) => {
    // For new elements being placed (when nothing is selected)
    if (!isAnythingSelected && isPlacementTool(selectedTool)) {
      // Just update the placement config
      onPlacementConfigChange({
        ...currentPlacementConfig,
        fill: color
      });
    } 
    // For selected elements
    else if (selectedElementIds && selectedElementIds.length > 0) {
      // Pass the selected element IDs and the color update
      updateElementColor(selectedElementIds, { fill: color });
    }
    // For selected section
    else if (selectedSectionId) {
      // Find all elements with this section ID
      const sectionElementIds = elements
        .filter(el => el.sectionId === selectedSectionId)
        .map(el => el.id);
      
      if (sectionElementIds.length > 0) {
        updateElementColor([...sectionElementIds, selectedSectionId], { fill: color });
      } else if (selectedSectionId) {
        updateElementColor([selectedSectionId], { fill: color });
      }
    }
  };

  return (
    <div className="w-full h-full bg-white overflow-hidden border border-black/10">
      {/* Element Palette */}
      {((selectedTool === "select" || selectedTool === "hand") && !isAnythingSelected) && (
        <div>
          <ElementPalette selectedTool={selectedTool} onSelectTool={onSelectTool} />
        </div>
      )}

      {/* Configuration Forms (for placing NEW elements) */}
      {isPlacementTool(selectedTool) && !isAnythingSelected && !selectedSectionId && (
          <PlacementConfigForms
            selectedTool={selectedTool}
            config={currentPlacementConfig}
            onConfigChange={onPlacementConfigChange}
            handleColorChange={handleColorChange}
            onSelectedSVGPath={onSelectedSVGPath}
            selectedSVGPath={selectedSVGPath}
            predefinedSvgPaths={predefinedSvgPaths}
          />
          
      )}

      {/* Selected Element/Section Properties Panel */}
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
            onCopy={onCopy}
            handleColorChange={handleColorChange}
            onSelectedSVGPath={onSelectedSVGPath}
            selectedSVGPath={selectedSVGPath}
            predefinedSvgPaths={predefinedSvgPaths}
            updateSelectedSeatsSvgPath={updateSelectedSeatsSvgPath}

          />
        </div>
      )}

      {/* Placeholder if nothing is selected and no placement tool is active for config */}
      {!selectedSectionData && !isAnythingSelected && !isPlacementTool(selectedTool) && (
        <p className="text-xs text-gray-500 text-center mt-4">
          Select an element or section to edit properties, or choose a tool to place a new element.
        </p>
      )}

    </div>
  );
};

export default Sidebar;