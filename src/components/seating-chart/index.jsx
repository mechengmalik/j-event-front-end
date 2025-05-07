// src/components/SeatingMapBuilder/SeatingMapBuilder.jsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import Sidebar from "./Sidebar"; // Assuming path is correct
import Toolbar from "./Toolbar"; // Assuming path is correct
import Canvas from "./Canvas"; // Assuming path is correct
import TextEditorOverlay from "./TextEditorOverlay"; // Assuming path is correct
import { useSeatingMapState } from "./hooks/useSeatingMapState";
import { TOOLS, ELEMENT_TYPES, getElementTypeFromTool } from "./constants"; // Adjust path if needed

const SeatingMapBuilder = () => {
  // Use the state hook (reverted version without seat select mode)
  const {
    // State
    elements, // This is actually elementsToRender from the hook
    selectedTool,
    sections,
    currentPlacementConfig,
    selectedElementIds,
    selectedSectionId,
    history,
    future,
    // Derived State
    selectedElementData,
    selectedSectionData,
    // Actions
    handleSelectTool,
    handleSelectionChange,
    setCurrentPlacementConfig,
    addElement,
    addSection,
    deleteSelected,
    updateElementProperties,
    updateSectionProperties,
    handleElementDragEnd,
    handleSectionDragEnd,
    handleTransformEnd,
    undo,
    redo,
    saveState,
    clearAll,
  } = useSeatingMapState();

  // Text Editing State
  const [textEditState, setTextEditState] = useState({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    text: "",
    id: null,
    rotation: 0,
    node: null,
    fontSize: 14,
    padding: 5,
    fill: "",
    fontFamily: "",
    align: "",
  });
  const stageRefForText = useRef(null); // Ref for the Canvas stage
  const transformerRef = useRef(null);

  // Event Handlers Bridging Components
  const handleCanvasStageClick = useCallback(
    (posOrRect) => {
      // Handle placement or finalize section drawing
      if (selectedTool.startsWith("place-") && posOrRect && !posOrRect.width) {
        const elementType = getElementTypeFromTool(selectedTool);
        addElement(elementType, posOrRect);
      } else if (
        selectedTool === TOOLS.DRAW_SECTION &&
        posOrRect &&
        posOrRect.width
      ) {
        addSection(posOrRect);
        handleSelectTool(TOOLS.SELECT); // Switch back after drawing

      }
    },
    [selectedTool, addElement, addSection, handleSelectTool]
  ); // Dependencies

  const handleFloorTextDblClick = useCallback(
    (konvaEvent, floorElement) => {
      const textNode = konvaEvent.target;
      const stage = stageRefForText.current;

      if (!stage || !textNode || floorElement.type !== ELEMENT_TYPES.FLOOR)
        return;

      textNode.hide();
      if (transformerRef.current) { // Check if ref is set
        transformerRef.current.nodes([]);
        transformerRef.current.hide();
      }
      stage.container().style.cursor = "text";

      const textRect = textNode.getClientRect({
        relativeTo: stage.container(),
      });

      setTextEditState({
        visible: true,
        x: textRect.x,
        y: textRect.y,
        width: textRect.width,
        height: textRect.height,
        text: floorElement.text,
        id: floorElement.id,
        node: textNode,
        rotation: textNode.getAbsoluteRotation(),
        fontSize: floorElement.fontSize || 14,
        padding: floorElement.textPadding || 5,
        fontFamily: textNode.fontFamily() || "sans-serif",
        align: textNode.align() || "center",
      });
    },
    [transformerRef] // Dependency
  );


  const handleTextEditChange = useCallback((e) => {
    setTextEditState((prev) => ({ ...prev, text: e.target.value }));
  }, []);


  const finishTextEdit = useCallback(() => {
    if (!textEditState.visible || !textEditState.id) return;
    updateElementProperties(
      textEditState.id,
      { text: textEditState.text },
      true
    );
    textEditState.node?.show();
    if (transformerRef.current) {
      // Show transformer again if it was hidden
      transformerRef.current.show();
      // Optionally re-attach nodes if needed, though selection change should handle it
    }
    setTextEditState((prev) => ({
      ...prev,
      visible: false,
      id: null,
      node: null,
    }));
    const stage = stageRefForText.current;
    if (stage) stage.container().style.cursor = "default";
  }, [textEditState, updateElementProperties]);
  const cancelTextEdit = useCallback(() => {
    if (!textEditState.visible) return;
    textEditState.node?.show();
    if (transformerRef.current) {
      transformerRef.current.show();
    }
    setTextEditState((prev) => ({
      ...prev,
      visible: false,
      id: null,
      node: null,
    }));
    const stage = stageRefForText.current;
    if (stage) stage.container().style.cursor = "default";
  }, [textEditState]);


  const handleTextEditKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        finishTextEdit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelTextEdit();
      }
    },
    [finishTextEdit, cancelTextEdit]
  );

  // Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isTextInput = ["INPUT", "SELECT", "TEXTAREA"].includes(
        activeElement?.tagName
      );
      // Check if the focused element is our specific overlay textarea
      const isOverlayTextarea =
        activeElement ===
        document.querySelector('textarea[style*="position: absolute"]');

      // Ignore shortcuts if focus is on a regular input/select, or our overlay textarea
      if ((isTextInput && !isOverlayTextarea) || textEditState.visible) {
        return;
      }

      // Handle shortcuts if focus is not on inputs or the overlay is hidden
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))
      ) {
        e.preventDefault();
        redo();
      } else if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case "v":
            handleSelectTool(TOOLS.SELECT);
            break;
          case "h":
            handleSelectTool(TOOLS.HAND);
            break;
          // Add more shortcuts if desired
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [deleteSelected, undo, redo, handleSelectTool, textEditState.visible]); // Dependency on textEditState.visible

  return (
    // Main layout container
    <div className="flex w-full h-screen bg-gray-100 font-sans text-sm relative">
      {/* Left Sidebar */}
      <Sidebar
        selectedTool={selectedTool}
        currentPlacementConfig={currentPlacementConfig}
        selectedSectionData={selectedSectionData}
        selectedElementData={selectedElementData}
        selectedElementIds={selectedElementIds}
        elements={elements}
        onSelectTool={handleSelectTool}
        onPlacementConfigChange={setCurrentPlacementConfig}
        onUpdateSection={updateSectionProperties}
        onUpdateElement={updateElementProperties}
        onDelete={deleteSelected}
        onSave={saveState}
        sections={sections}
      />

      {/* Main Canvas Area */}
      <div className="flex-grow relative">
        {/* Canvas Component */}
        <Canvas
          ref={stageRefForText}
          elements={elements} // elementsToRender from hook
          selectedElementIds={selectedElementIds}
          selectedSectionId={selectedSectionId}
          selectedTool={selectedTool}
          onSelectionChange={handleSelectionChange}
          onElementDragEnd={handleElementDragEnd}
          onSectionDragEnd={handleSectionDragEnd}
          onTransformEnd={handleTransformEnd}
          onStageClick={handleCanvasStageClick}
          onTextDblClick={handleFloorTextDblClick}
          sections={sections}
        />
        <TextEditorOverlay
          textEditState={textEditState}
          onChange={handleTextEditChange}
          onBlur={finishTextEdit}
          onKeyDown={handleTextEditKeyDown}
        />
      </div>

      {/* Bottom Toolbar */}
      <Toolbar
        selectedTool={selectedTool}
        canUndo={history.length > 1}
        canRedo={future.length > 0}
        onSelectTool={handleSelectTool}
        onUndo={undo}
        onRedo={redo}
        onClearAll={() => {
          if (
            window.confirm(
              "Are you sure you want to clear everything? This cannot be undone."
            )
          ) {
            clearAll();
          }
        }}
      />
    </div>
  );
};

export default SeatingMapBuilder;
