// src/components/SeatingMapBuilder/Canvas.jsx
import React, { useRef, useState, useCallback, useEffect } from "react";
import { Stage, Layer, Group, Transformer, Rect, Text } from "react-konva";
import {
  ELEMENT_TYPES,
  TOOLS,
  MIN_SIZE,
  SHAPES,
  DEFAULT_POLYGON_RADIUS,
  DEFAULT_STAR_RADIUS,
  DEFAULT_CIRCLE_RADIUS,
  DEFAULT_RECT_SIZE,
} from "./constants"; // Adjust path if needed

// Import Element Components
import ChairElement from "./elements/ChairElement";
import ShapeBasedElement from "./elements/ShapeBasedElement";
import FloorElement from "./elements/FloorElement";
import PathElement from "./elements/PathElement";
import BoundaryElement from "./elements/BoundaryElement";
// Import Layers
import GridLayer from "./layers/GridLayer";
import DrawingPreviewLayer from "./layers/DrawingPreviewLayer";
import ShapeRenderer from "./elements/ShapeRenderer";

// Helper function to check if a Konva node is within a rectangle
const isNodeInRect = (node, rect, stage) => {
  if (!node || !rect) return false;
  const nodeRect = node.getClientRect({ relativeTo: stage });
  return (
    nodeRect.x >= rect.x &&
    nodeRect.y >= rect.y &&
    nodeRect.x + nodeRect.width <= rect.x + rect.width &&
    nodeRect.y + nodeRect.height <= rect.y + rect.height
  );
};

const Canvas = ({
  elements,
  selectedElementIds,
  selectedSectionId,
  selectedTool,
  onSelectionChange,
  onElementDragEnd,
  onSectionDragEnd,
  onTransformEnd,
  onStageClick,
  onTextDblClick,
  sections,
}) => {
  console.log("🚀 ~ sections:", sections);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const layerRef = useRef(null);
  const shapeRefs = useRef({});
  const isDraggingElementRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const dragStartPositionsRef = useRef({});
  const dragStartNodeIdRef = useRef(null);

  // Drawing State
  const [isDrawingSection, setIsDrawingSection] = useState(false);
  const [drawStartPos, setDrawStartPos] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const [tempPreviewText, setTempPreviewText] = useState(null);

  // Selection Box State
  const [selectionBox, setSelectionBox] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });
  const selectionBoxStart = useRef({ x: 0, y: 0 });
  const isSelectingWithBox = useRef(false);

  // Update Transformer
  useEffect(() => {
    if (!transformerRef.current) return;

    const nodesToSelect = selectedElementIds
      .map((id) => shapeRefs.current[id])
      .filter(Boolean);

    transformerRef.current.nodes(nodesToSelect);

    if (nodesToSelect.length === 1) {
      const selectedNode = nodesToSelect[0];
      const element = elements.find((el) => el.id === selectedNode.id());

      if (element) {
        transformerRef.current.rotateEnabled(true); // Always allow rotation for single elements
        switch (element.type) {
          case ELEMENT_TYPES.FLOOR:
            transformerRef.current.enabledAnchors([
              "middle-left",
              "middle-right",
            ]);
            transformerRef.current.keepRatio(false);
            break;
          case ELEMENT_TYPES.ENTRANCE:
          case ELEMENT_TYPES.EXIT:
            transformerRef.current.enabledAnchors([
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]);
            transformerRef.current.keepRatio(true); // Keep aspect ratio for icons
            break;
          case ELEMENT_TYPES.TABLE:
          case ELEMENT_TYPES.STAGE: {
            const radialShapes = [
              SHAPES.CIRCLE,
              SHAPES.POLYGON,
              SHAPES.STAR,
              SHAPES.RING,
              SHAPES.ARC,
              SHAPES.WEDGE,
            ];
            if (radialShapes.includes(element.shape)) {
              transformerRef.current.keepRatio(true); // Resize radially
              transformerRef.current.enabledAnchors([
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]); // Corner anchors for radial resize
            } else {
              // Rect
              transformerRef.current.keepRatio(false); // Free resize for rect
              transformerRef.current.enabledAnchors(undefined); // All anchors
            }
            break;
          }
          case ELEMENT_TYPES.SECTION_BOUNDARY:
            transformerRef.current.keepRatio(false); // Allow free resize for sections
            transformerRef.current.enabledAnchors(undefined);
            break;
          case ELEMENT_TYPES.CHAIR: // Chairs (if individually selectable)
            transformerRef.current.enabledAnchors([
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]); // Only rotation
            transformerRef.current.keepRatio(true); // Keep aspect ratio for chairs
            break;
          default:
            transformerRef.current.enabledAnchors(undefined);
            transformerRef.current.keepRatio(false);
            break;
        }
      }
    } else if (nodesToSelect.length > 1) {
      // For multi-selection, allow rotation and uniform scaling
      transformerRef.current.rotateEnabled(true);
      transformerRef.current.keepRatio(true);
      transformerRef.current.enabledAnchors(undefined); // All anchors for uniform scale/rotate
    } else {
      transformerRef.current.rotateEnabled(false); // No nodes, disable rotation
    }

    transformerRef.current.forceUpdate();
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedElementIds, elements, transformerRef]);

  // Cursor Style
  const getCursorStyle = useCallback(() => {
    if (isDrawingSection) return "crosshair";
    if (selectedTool === TOOLS.DRAW_SECTION) return "crosshair";
    if (selectedTool.startsWith("place-")) return "copy";
    if (selectedTool === TOOLS.HAND)
      return isMouseDownRef.current ? "grabbing" : "grab";
    if (selectedTool === TOOLS.SELECT && isSelectingWithBox.current)
      return "crosshair";
    return "default";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedTool,
    isDrawingSection,
    isMouseDownRef.current,
    isSelectingWithBox.current,
  ]);

  // --- Event Handlers ---
  const handleMouseDown = (e) => {
    isMouseDownRef.current = true;
    isDraggingElementRef.current = false;
    const stage = stageRef.current;
    if (!stage) return;
    const relativePos = stage.getRelativePointerPosition();
    if (!relativePos) return;
    const target = e.target;
    const targetIsStage = target === stage;

    if (targetIsStage) {
      if (selectedTool === TOOLS.DRAW_SECTION) {
        setIsDrawingSection(true);
        setDrawStartPos(relativePos);
        setCurrentRect({
          x: relativePos.x,
          y: relativePos.y,
          width: 0,
          height: 0,
          rows: 1,
          cols: 1,
        });
        setTempPreviewText({
          x: relativePos.x + 5,
          y: relativePos.y + 5,
          text: `R:1, C:1`,
        });
        onSelectionChange({ elementIds: [], sectionId: null });
        transformerRef.current?.nodes([]);
      } else if (selectedTool.startsWith("place-")) {
        onStageClick(relativePos);
      } else if (selectedTool === TOOLS.SELECT) {
        // Start selection box
        isSelectingWithBox.current = true;
        selectionBoxStart.current = relativePos;
        setSelectionBox({
          x: relativePos.x,
          y: relativePos.y,
          width: 0,
          height: 0,
          visible: true,
        });
        onSelectionChange({ elementIds: [], sectionId: null });
        transformerRef.current?.nodes([]);
      }
    } else {
      // Clicked on an element
      if (isDrawingSection) {
        setIsDrawingSection(false);
        setDrawStartPos(null);
        setCurrentRect(null);
        setTempPreviewText(null);
      }
    }
  };
  const handleMouseMove = () => {
    const stage = stageRef.current;
    if (!stage || !isMouseDownRef.current) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;
    if (isDrawingSection && drawStartPos) {
      /* ... update drawing rect ... */
      isDraggingElementRef.current = true;
      const newWidth = Math.abs(pos.x - drawStartPos.x);
      const newHeight = Math.abs(pos.y - drawStartPos.y);
      const newX = Math.min(pos.x, drawStartPos.x);
      const newY = Math.min(pos.y, drawStartPos.y);
      const cols = Math.max(1, Math.floor(newWidth / 50) + 1);
      const rows = Math.max(1, Math.floor(newHeight / 60) + 1);
      setCurrentRect({
        ...currentRect,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
        rows,
        cols,
      });
      setTempPreviewText({
        x: pos.x + 10,
        y: pos.y + 10,
        text: `R:${rows}, C:${cols}`,
      });
    } else if (isSelectingWithBox.current) {
      /* ... update selection box ... */
      isDraggingElementRef.current = true;
      const currentX = pos.x;
      const currentY = pos.y;
      setSelectionBox({
        x: Math.min(selectionBoxStart.current.x, currentX),
        y: Math.min(selectionBoxStart.current.y, currentY),
        width: Math.abs(currentX - selectionBoxStart.current.x),
        height: Math.abs(currentY - selectionBoxStart.current.y),
        visible: true,
      });
    }
  };
  const handleMouseUp = () => {
    const wasDrawingSection = isDrawingSection;
    const wasSelectingWithBox = isSelectingWithBox.current;
    isMouseDownRef.current = false;
    setIsDrawingSection(false);
    isSelectingWithBox.current = false;
    if (
      wasDrawingSection &&
      currentRect &&
      currentRect.width > MIN_SIZE &&
      currentRect.height > MIN_SIZE
    ) {
      onStageClick(currentRect);
    } else if (
      wasSelectingWithBox &&
      selectionBox.visible &&
      selectionBox.width > 5 &&
      selectionBox.height > 5
    ) {
      const stage = stageRef.current;
      const finalSelectionRect = selectionBox;
      const elementsToSelect = [];
      Object.values(shapeRefs.current).forEach((node) => {
        // Select non-chair elements within the box
        if (
          node &&
          node.attrs.id &&
          !node.attrs.id.startsWith("chair-") &&
          !node.attrs.id.startsWith("tchair-")
        ) {
          if (isNodeInRect(node, finalSelectionRect, stage)) {
            elementsToSelect.push(node.attrs.id);
          }
        }
      });
      onSelectionChange({ elementIds: elementsToSelect, sectionId: null });
    }
    setDrawStartPos(null);
    setCurrentRect(null);
    setTempPreviewText(null);
    setSelectionBox({ x: 0, y: 0, width: 0, height: 0, visible: false });
    setTimeout(() => {
      isDraggingElementRef.current = false;
    }, 0);
  };
  const handleWheel = useCallback(() => {
    /* ... */
  }, []);
  const handleDragStart = useCallback(
    (e) => {
      isDraggingElementRef.current = true;
      const id = e.target.id();
      dragStartNodeIdRef.current = id;
      dragStartPositionsRef.current = {};
      selectedElementIds.forEach((selectedId) => {
        const node = shapeRefs.current[selectedId];
        if (node) {
          dragStartPositionsRef.current[selectedId] = {
            x: node.x(),
            y: node.y(),
          };
        }
      });
      const elementData = elements.find((el) => el.id === id);
      if (
        elementData &&
        elementData.type !== ELEMENT_TYPES.SECTION_BOUNDARY &&
        elementData.type !== ELEMENT_TYPES.CHAIR
      ) {
        // Don't move chairs to top
        e.target.moveToTop();
        transformerRef.current?.moveToTop();
      }
    },
    [selectedElementIds, elements]
  );

  const handleDragEnd = useCallback(
    (e) => {
      const draggedNodeId = dragStartNodeIdRef.current;
      const node = e.target;
      const elementId = node.id();
      if (!draggedNodeId || !selectedElementIds.includes(elementId)) return;
      const originalElement = elements.find((el) => el.id === elementId);
      if (!originalElement) return;
      const startPos = dragStartPositionsRef.current[draggedNodeId] || {
        x: originalElement.x,
        y: originalElement.y,
      };
      const newPos = node.position();
      const deltaX = newPos.x - startPos.x;
      const deltaY = newPos.y - startPos.y;
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return; // Ignore tiny drags

      if (
        originalElement.type === ELEMENT_TYPES.SECTION_BOUNDARY &&
        originalElement.sectionId
      ) {
        onSectionDragEnd(originalElement.sectionId, { x: deltaX, y: deltaY });
      } else if (
        selectedElementIds.includes(elementId) &&
        originalElement.type !== ELEMENT_TYPES.CHAIR
      ) {
        // Only drag non-chairs
        onElementDragEnd(elementId, newPos, { x: deltaX, y: deltaY });
      }
      dragStartPositionsRef.current = {};
      dragStartNodeIdRef.current = null;
    },
    [elements, selectedElementIds, onElementDragEnd, onSectionDragEnd]
  );

  const handleInternalTransformEnd = useCallback(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;
    const nodes = transformer.nodes();
    if (nodes.length === 0) return;

    const transformData = nodes
      .map((node) => {
        const elementId = node.id();
        // Find the element from the main 'elements' array to get its state *before* this transform
        const originalElement = elements.find((el) => el.id === elementId);

        if (!originalElement) {
          console.warn(
            `Original element ${elementId} not found during transform end.`
          );
          return null; // Should not happen
        }

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset Konva node scale AFTER getting values
        node.scaleX(1);
        node.scaleY(1);

        return {
          id: elementId,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: scaleX, // Scale factor applied during this transform
          scaleY: scaleY,
          // Pass original dimensions and type/shape for calculation in the hook
          originalWidth: originalElement.width,
          originalHeight: originalElement.height,
          originalRadius: originalElement.radius,
          originalOuterRadius: originalElement.outerRadius,
          originalInnerRadius: originalElement.innerRadius,
          originalLength: originalElement.length,
          originalScaleX: originalElement.scaleX, // For Entrance/Exit
          originalScaleY: originalElement.scaleY, // For Entrance/Exit
          type: originalElement.type,
          shape: originalElement.shape,
          sectionId: originalElement.sectionId, // For sections
        };
      })
      .filter(Boolean); // Filter out nulls if any originalElement wasn't found

    if (transformData.length > 0) {
      onTransformEnd(transformData); // Call the hook's handler
    }
  }, [elements, onTransformEnd, transformerRef]); // Added elements and transformerRef

  // Reverted Click Handler (Mixed Multi-Select)
  const handleElementClick = useCallback(
    (e, element) => {
      if (
        isDraggingElementRef.current ||
        transformerRef.current?.isTransforming() ||
        isSelectingWithBox.current
      )
        return;
      if (selectedTool === TOOLS.SELECT) {
        const isMeta = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const currentId = element.id;
        const isBoundary = element.type === ELEMENT_TYPES.SECTION_BOUNDARY;
        const isChair = element.type === ELEMENT_TYPES.CHAIR;
        let nextSelectedIds = [...selectedElementIds];
        let nextSectionId = selectedSectionId;

        if (isChair) {
          if (isMeta) {
            nextSelectedIds = nextSelectedIds.includes(currentId)
              ? nextSelectedIds.filter((id) => id !== currentId)
              : [
                  ...nextSelectedIds.filter(
                    (id) =>
                      elements.find((el) => el.id === id)?.type ===
                      ELEMENT_TYPES.CHAIR
                  ),
                  currentId,
                ];
          } else {
            nextSelectedIds =
              nextSelectedIds.includes(currentId) &&
              nextSelectedIds.length === 1
                ? []
                : [currentId];
          }
          nextSectionId = null; // Clear section selection
        } else if (isBoundary) {
          nextSelectedIds = [currentId];
          nextSectionId = element.sectionId;
        } else {
          // Independent element
          if (isMeta) {
            nextSelectedIds = nextSelectedIds.includes(currentId)
              ? nextSelectedIds.filter((id) => id !== currentId)
              : [
                  ...nextSelectedIds.filter(
                    (id) => !elements.find((el) => el.id === id)?.sectionId
                  ),
                  currentId,
                ];
          } else {
            nextSelectedIds =
              nextSelectedIds.includes(currentId) &&
              nextSelectedIds.length === 1
                ? []
                : [currentId];
          }
          nextSectionId = null;
        }
        // Filter out section boundary if chairs are selected
        if (
          nextSelectedIds.some(
            (id) =>
              elements.find((el) => el.id === id)?.type === ELEMENT_TYPES.CHAIR
          )
        ) {
          nextSelectedIds = nextSelectedIds.filter(
            (id) =>
              elements.find((el) => el.id === id)?.type === ELEMENT_TYPES.CHAIR
          );
        }
        if (
          JSON.stringify(nextSelectedIds) !==
            JSON.stringify(selectedElementIds) ||
          nextSectionId !== selectedSectionId
        ) {
          onSelectionChange({
            elementIds: nextSelectedIds,
            sectionId: nextSectionId,
          });
        }
      }
    },
    [
      selectedTool,
      selectedElementIds,
      selectedSectionId,
      onSelectionChange,
      elements,
    ]
  );

  const renderSingleElement = useCallback(
    (el) => {
      const isElementSelected = selectedElementIds.includes(el.id);
      // For section boundary, highlight is based on selectedSectionId
      const isBoundaryOfSelectedSection =
        el.type === ELEMENT_TYPES.SECTION_BOUNDARY &&
        selectedSectionId === el.sectionId;

      switch (el.type) {
        case ELEMENT_TYPES.CHAIR:
          return (
            <ChairElement elementData={el} isSelected={isElementSelected} />
          );
        case ELEMENT_TYPES.TABLE:
        case ELEMENT_TYPES.STAGE: {
          const name = el.name || "";
          // *** Changed const to let for textContent to allow reassignment ***
          let textContent =
            name || (el.type === ELEMENT_TYPES.TABLE ? "T" : "S");
          const hasName = !!name;
          let fontSize = 14;
          let textWidth = 0,
            textHeight = 0;
          let shapeComponent;

          // Determine shape component and dimensions for text
          if (el.shape === SHAPES.POLYGON || el.shape === SHAPES.STAR) {
            shapeComponent = (
              <ShapeRenderer element={el} isSelected={isElementSelected} />
            );
            // Use default radius if element's radius is not set or invalid
            const outerRad =
              el.radius && el.radius > 0
                ? el.radius
                : el.shape === SHAPES.STAR
                ? DEFAULT_STAR_RADIUS
                : DEFAULT_POLYGON_RADIUS;
            textWidth = outerRad * 2;
            textHeight = outerRad * 2;
            fontSize = hasName
              ? Math.max(10, outerRad * 0.25)
              : Math.max(10, outerRad * (el.shape === SHAPES.STAR ? 0.5 : 0.7));
          } else {
            // Rect, Circle, Ring etc.
            shapeComponent = (
              <ShapeBasedElement element={el} isSelected={isElementSelected} />
            );
            if (el.shape === SHAPES.RECT) {
              textWidth = el.width || DEFAULT_RECT_SIZE.width;
              textHeight = el.height || DEFAULT_RECT_SIZE.height;
              fontSize = hasName
                ? Math.max(10, Math.min(textWidth * 0.2, textHeight * 0.4, 18))
                : Math.min(
                    textWidth * 0.5,
                    textHeight * 0.5,
                    el.type === "stage" ? 18 : 14
                  );
              if (!hasName) {
                // This is where textContent was reassigned for Rect if no name
                textContent =
                  el.type.charAt(0).toUpperCase() + el.type.slice(1);
              }
            } else if (el.shape === SHAPES.CIRCLE) {
              const radiusC = el.radius || DEFAULT_CIRCLE_RADIUS;
              textWidth = radiusC * 2;
              textHeight = radiusC * 2;
              fontSize = hasName
                ? Math.max(10, radiusC * 0.3)
                : Math.max(10, radiusC * 0.7);
              // textContent remains "T" or "S" if no name for Circle
            } // Add similar dimension calculations for Ring, Wedge, Arc if they need specific text sizing
          }
          return (
            <>
              {shapeComponent}
              <Text
                text={textContent}
                fontSize={fontSize}
                fill={el.type === "table" ? "#2d3748" : "#4a5568"}
                fontStyle={
                  el.type === ELEMENT_TYPES.STAGE && !hasName
                    ? "bold"
                    : "normal"
                }
                width={textWidth}
                height={textHeight}
                align="center"
                verticalAlign="middle"
                // For Rects (via ShapeBasedElement), the group origin is top-left.
                // Text box is full size of rect, align/verticalAlign centers the text content.
                // For centered shapes (Circle, Polygon, Star via ShapeRenderer), group origin is center.
                // Text box is full size, offsetX/Y centers the text box itself over the shape.
                offsetX={el.shape === SHAPES.RECT ? 0 : textWidth / 2}
                offsetY={el.shape === SHAPES.RECT ? 0 : textHeight / 2}
                listening={false}
                padding={hasName ? 5 : 0} // Add padding if it's a name
                wrap={hasName ? "char" : "none"} // Allow character wrapping for names
              />
            </>
          );
        }
        case ELEMENT_TYPES.FLOOR:
          return (
            <FloorElement
              element={el}
              isSelected={isElementSelected}
              onTextDblClick={onTextDblClick}
            />
          );
        case ELEMENT_TYPES.ENTRANCE:
        case ELEMENT_TYPES.EXIT:
          return <PathElement element={el} isSelected={isElementSelected} />;
        case ELEMENT_TYPES.SECTION_BOUNDARY: {
          const sectionData = sections.find((sec) => sec.id === el.sectionId);
          const sectionName = sectionData?.name || "";
          // Estimate text width for centering section name (adjust multiplier as needed)
          const estimatedNameTextWidth = sectionName.length * (16 * 0.6); // Use a factor of fontSize

          return (
            <>
              <BoundaryElement
                element={el}
                isSelected={isBoundaryOfSelectedSection}
              />
              {sectionName && (
                <Text
                  text={sectionName}
                  fontSize={16 / (stageRef.current?.scaleX() || 1)} // Adjust with zoom
                  fontStyle="bold"
                  fill="#333333"
                  // Position relative to the boundary's group origin (top-left of boundary)
                  x={el.width / 2} // Center horizontally within the boundary
                  y={-25 / (stageRef.current?.scaleY() || 1)} // Position above the boundary, adjust with zoom
                  offsetX={estimatedNameTextWidth / 2} // Center the text itself
                  listening={false}
                  perfectDrawEnabled={false} // Optimization for text
                />
              )}
            </>
          );
        }
        default:
          return null;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      selectedElementIds,
      selectedSectionId,
      onTextDblClick,
      sections,
      elements,
      stageRef,
    ]
  ); // Dependencies

  return (
    <div className="flex-grow bg-gray-200 overflow-hidden relative h-full w-full">
      <Stage
        width={window.innerWidth * 0.8}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        draggable={selectedTool === TOOLS.HAND}
        ref={stageRef}
        className="bg-white"
        style={{ cursor: getCursorStyle() }}
      >
        <GridLayer />
        <Layer ref={layerRef}>
          {/* Map over elements (which includes dynamic chairs) */}
          {elements.map((el) => (
            <Group
              key={el.id}
              id={el.id}
              x={el.x}
              y={el.y}
              rotation={el.rotation || 0}
              offsetX={el.offsetX || 0} // Used by chairs for center rotation
              offsetY={el.offsetY || 0}
              draggable={
                selectedTool === TOOLS.SELECT &&
                selectedElementIds.includes(el.id)
              }
              ref={(node) => (shapeRefs.current[el.id] = node)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onClick={(e) => handleElementClick(e, el)}
              onDblClick={(e) => {
                if (el.type === ELEMENT_TYPES.FLOOR) {
                  onTextDblClick(e, el);
                }
              }}
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (!stage) return;
                const canDrag =
                  selectedTool === TOOLS.SELECT &&
                  selectedElementIds.includes(el.id);
                const canSelect = selectedTool === TOOLS.SELECT; // All elements are potentially selectable
                if (canDrag) stage.container().style.cursor = "move";
                else if (canSelect) stage.container().style.cursor = "pointer";
                else stage.container().style.cursor = getCursorStyle();
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = getCursorStyle();
              }}
              listening={true}
            >
              {renderSingleElement(el)}
            </Group>
          ))}
          <Transformer
            ref={transformerRef}
            rotateEnabled={true}
            enabledAnchors={
              selectedElementIds.some(
                (id) =>
                  elements.find((el) => el.id === id)?.type ===
                  ELEMENT_TYPES.CHAIR
              )
                ? ["top-left", "top-right", "bottom-left", "bottom-right"] // Only rotation for chairs
                : selectedElementIds.length === 1 &&
                  elements.find((el) => el.id === selectedElementIds[0])
                    ?.type === ELEMENT_TYPES.FLOOR
                ? ["top-left", "top-right", "bottom-left", "bottom-right"]
                : undefined
            }
            borderStroke="#6b46c1"
            borderStrokeWidth={1.5}
            anchorFill="#fff"
            anchorStroke="#6b46c1"
            anchorStrokeWidth={1}
            anchorSize={8}
            anchorCornerRadius={4}
            onTransformEnd={handleInternalTransformEnd}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < MIN_SIZE || newBox.height < MIN_SIZE) {
                return oldBox;
              }
              return newBox;
            }}
            shouldOverdrawWholeArea={true}
          />
          {/* Selection Box Visual */}
          {selectionBox.visible && (
            <Rect
              x={selectionBox.x}
              y={selectionBox.y}
              width={selectionBox.width}
              height={selectionBox.height}
              fill="rgba(0, 161, 255, 0.3)"
              stroke="#0078d4"
              strokeWidth={1}
              listening={false}
            />
          )}
        </Layer>
        <DrawingPreviewLayer
          isDrawing={isDrawingSection}
          currentRect={currentRect}
          previewText={tempPreviewText}
        />
      </Stage>
    </div>
  );
};

export default Canvas;
