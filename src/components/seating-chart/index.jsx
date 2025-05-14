// src/components/SeatingMapBuilder/SeatingMapBuilder.jsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import backArrow from "../../assets/icons/back-arrow.svg";
import Sidebar from "./Sidebar"; // Assuming path is correct
import Toolbar from "./Toolbar"; // Assuming path is correct
import Canvas from "./Canvas"; // Assuming path is correct
import TextEditorOverlay from "./TextEditorOverlay"; // Assuming path is correct
import { useSeatingMapState } from "./hooks/useSeatingMapState";
import { TOOLS, ELEMENT_TYPES, getElementTypeFromTool } from "./constants"; // Adjust path if needed
import couchChair from "../../assets/icons/couch.svg";
import fancyChair from "../../assets/icons/chair.svg";
import traditionalChair from "../../assets/icons/traditional.svg";

const SeatingMapBuilder = () => {
  // Use the state hook (reverted version without seat select mode)
  const {
    // State
    elements, // This is actually elementsToRender from the hook
    selectedTool,
    selectedSVGPath,
    sections,
    currentPlacementConfig,
    selectedElementIds,
    selectedSectionId,
    history,
    future,
    isPasting,
    // Derived State
    selectedElementData,
    selectedSectionData,
    // Actions
    handleSelectTool,
    handleSelectedSVGPath,
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
    setSelectedElementIds,
    undo,
    redo,
    saveState,
    // prepareDataForExport,
    clearAll,
    copySelectedElements,
    cutSelectedElements,
    pasteElements,
    updateElementColor,
    updateSelectedSeatsSvgPath,
  } = useSeatingMapState();

  // const handleExport = () => {
  //   const dataToExport = prepareDataForExport();
  //   const jsonString = JSON.stringify(dataToExport, null, 2);
  //   console.log("Data for export:", jsonString);
  //   // Here you would typically send the jsonString to your backend/database
  // };
  // Text Editing State
  const navigate = useNavigate();
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;
  const DEFAULT_SCALE = 1;
  const ZOOM_AMOUNT = 0.2; // 20% zoom increment/decrement
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoomPercentage, setZoomPercentage] = useState(
    Math.round(DEFAULT_SCALE * 100)
  );

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
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: "",
  });
  console.log("🚀 ~ SeatingMapBuilder ~ contextMenu:", contextMenu)
  const stageRefForText = useRef(null);
  const transformerRef = useRef(null);

  const predefinedSvgPaths = [
    { name: "fancy", imageSrc: fancyChair },
    { name: "traditional", imageSrc: traditionalChair },
    { name: "couch", imageSrc: couchChair },
    // Add more as needed
  ];

  useEffect(() => {
  const handleClickOutside = () => {
    if (contextMenu.visible) {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    }
  };

  window.addEventListener('click', handleClickOutside);
  return () => window.removeEventListener('click', handleClickOutside);
}, [contextMenu.visible]);

  useEffect(() => {
    const stage = stageRefForText.current;
    if (!stage) return;

    const handleWheel = (e) => {
      e.evt.preventDefault();

      const scaleBy = 1.05;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (e.evt.deltaX !== 0) {
        const moveBy = 10;
        const newPos = {
          x: stage.x() - e.evt.deltaX * moveBy,
          y: stage.y(),
        };
        setPosition(newPos);
      }

      if (e.evt.deltaY !== 0) {
        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        let newScale =
          e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
        setScale(newScale);
        setZoomPercentage(Math.round(newScale * 100));

        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        setPosition(newPos);
      }
    };

    stage.on("wheel", handleWheel);

    return () => {
      stage.off("wheel", handleWheel);
    };
  }, []); // Empty dependency array ensures this runs only once after mount

  useEffect(() => {
    const stage = stageRefForText.current;
    if (stage) {
      stage.scale({ x: scale, y: scale });
      stage.position(position);
      stage.batchDraw();
    }
    setZoomPercentage(Math.round(scale * 100));
  }, [scale, position]);

  const handleZoomIn = () => {
    const stage = stageRefForText.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    let newScale = oldScale * (1 + ZOOM_AMOUNT);
    newScale = Math.min(MAX_SCALE, newScale);
    setScale(newScale);

    const pointer = stage.getPointerPosition() || {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setPosition(newPos);
  };

  const handleZoomOut = () => {
    const stage = stageRefForText.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    let newScale = oldScale * (1 - ZOOM_AMOUNT);
    newScale = Math.max(MIN_SCALE, newScale);
    setScale(newScale);

    const pointer = stage.getPointerPosition() || {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setPosition(newPos);
  };

  const handleResetZoom = () => {
    setScale(DEFAULT_SCALE);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      const newScale = value / 100;
      if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
        setScale(newScale);
      }
      setZoomPercentage(value);
    } else {
      setZoomPercentage(e.target.value); // Keep the input value as is if not a number
    }
  };

  const handleZoomInputBlur = () => {
    if (isNaN(parseInt(zoomPercentage, 10))) {
      setZoomPercentage(Math.round(scale * 100)); // Revert to current scale if input is invalid
    }
  };
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
      if (transformerRef.current) {
        // Check if ref is set
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
  const handleTextDblClick = useCallback(
    (konvaEvent, textElement) => {
      const textNode = konvaEvent.target;
      const stage = stageRefForText.current;

      if (!stage || !textNode || textElement.type !== ELEMENT_TYPES.TEXT)
        return;

      textNode.hide();
      if (transformerRef.current) {
        // Check if ref is set
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
        text: textElement.text,
        id: textElement.id,
        node: textNode,
        rotation: textNode.getAbsoluteRotation(),
        fontSize: textElement.fontSize || 14,
        padding: 0, // No padding for general text edit
        fontFamily: textNode.fontFamily() || "sans-serif",
        align: textNode.align() || "left", // Default to left align for general text
        fill: textElement.fill || "#333",
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

  useEffect(() => {
    if (selectedTool === TOOLS.DRAW_SECTION) {
      // Update currentPlacementConfig with the selected SVG path
      setCurrentPlacementConfig((prevConfig) => ({
        ...prevConfig,
        svgPath: selectedSVGPath,
      }));
    }
  }, [selectedTool, selectedSVGPath, setCurrentPlacementConfig]);

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
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copySelectedElements();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "x") {
        e.preventDefault();
        cutSelectedElements();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "v" &&
        !isPasting
      ) {
        e.preventDefault();
        pasteElements();
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
  }, [
    deleteSelected,
    undo,
    redo,
    handleSelectTool,
    textEditState.visible,
    copySelectedElements,
    cutSelectedElements,
    pasteElements,
    isPasting,
  ]);

  return (
    <div className="flex flex-col p-4 ">
      <div className="flex justify-between items-center">
        <div className="flex text-3xl font-bold justify-start items-center gap-4 pl-5">
          <button onClick={() => navigate(-1)}>
            <img src={backArrow} alt="Back" />
          </button>
          Seat Map Editor
        </div>
        <div className="create-events-wrapper">
          <button className="create-events-btn flex gap-2 bg-regal-purple hover:bg-purple-500 text-white py-2 px-3">
            <Link to="/dashboard/create-event" className="">
              Save Changes
            </Link>
          </button>
        </div>
      </div>
      <hr className="flex-grow border-t border-black/10 pb-8" />
      <div className="venue"></div>
      {/* // Main layout container */}
      <div className="flex overflow-hidden h-screen font-sans text-sm relative gap-4 min-w-0">
        {/* Left Sidebar */}

        {/* Main Canvas Area */}
        <div className="canvas-container flex-1 ">
          {/* Canvas Component */}
          <Canvas
            stageRefForText={stageRefForText}
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
            onTextElementDblClick={handleTextDblClick}
            setSelectedElementIds={setSelectedElementIds}
            setContextMenu={setContextMenu}
          />
          <TextEditorOverlay
            textEditState={textEditState}
            onChange={handleTextEditChange}
            onBlur={finishTextEdit}
            onKeyDown={handleTextEditKeyDown}
          />
        </div>
        <div className="editor-sidebar w-[30%] ">
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
            onCopy={copySelectedElements}
            onSave={saveState}
            sections={sections}
            onSelectedSVGPath={handleSelectedSVGPath}
            selectedSVGPath={selectedSVGPath}
            updateElementColor={updateElementColor}
            updateSelectedSeatsSvgPath={updateSelectedSeatsSvgPath}
            predefinedSvgPaths={predefinedSvgPaths}
            pasteElements={pasteElements}
            copySelectedElements={copySelectedElements}
            deleteSelected={deleteSelected}
          />
        </div>
        {/* <div>
      <button onClick={handleExport}>Export to Database</button>
    </div> */}

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
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleResetZoom}
          onZoomInputBlur={handleZoomInputBlur}
          onZoomInputChange={handleZoomInputChange}
          zoomPercentage={zoomPercentage}
        />
        {contextMenu.visible && (
          <div className="bg-white rounded-md shadow-md border border-gray-200 z-10"
            style={{
              position: "absolute",
              top: contextMenu.y,
              left: contextMenu.x,
              background: "white",
              border: "1px solid #ccc",
              padding: "4px",
            }}
            onClick={() => setContextMenu({ ...contextMenu, visible: false })}
          >
            {contextMenu.type === "element" ? (
              <>
                <div className="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"

                  onClick={() => {
                    copySelectedElements();
                    setContextMenu({ ...contextMenu, visible: false });
                  }}
                >
                  📋 Copy
                </div>
                <div className="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"

                  onClick={() => {
                    deleteSelected();
                    setContextMenu({ ...contextMenu, visible: false });
                  }}
                >
                  ❌ Delete
                </div>
              </>
            ) : (
              <div className="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"

                onClick={() => {
                  pasteElements();
                  setContextMenu({ ...contextMenu, visible: false });
                }}
              >
                📌 Paste
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatingMapBuilder;
