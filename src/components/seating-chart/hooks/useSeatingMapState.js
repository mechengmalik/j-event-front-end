import { useState, useCallback, useMemo } from "react";
import {
  ELEMENT_TYPES,
  MIN_SIZE,
  SHAPES,
  TOOLS,
  getDefaultElementProps,
  DEFAULT_CHAIR_SIZE,
  DEFAULT_CONFIGS,
} from "../constants";
import { calculateChairPositions } from "../utils/chairUtils";
import { calculateSectionDimensions } from "../utils/sectionUtils";
import { calculateTableChairPositions } from "../utils/tableChairUtils.js";
let tableCounter = 0

const INITIAL_HISTORY_STATE = { elements: [], sections: [] };
export const DEFAULT_RECT_SIZE = { width: 100, height: 60 };
export const DEFAULT_CIRCLE_RADIUS = 50;
export const DEFAULT_POLYGON_SIDES = 6; // Default sides for polygon
export const DEFAULT_POLYGON_RADIUS = 60;
export const DEFAULT_STAR_POINTS = 5; // Default points for star
export const DEFAULT_STAR_RADIUS = 70; // Outer radius
export const DEFAULT_STAR_INNER_RADIUS_RATIO = 0.4; // Ratio for inner radius
export const DEFAULT_RING_INNER_RADIUS = 30;
export const DEFAULT_RING_OUTER_RADIUS = 60;
export const DEFAULT_WEDGE_RADIUS = 60;
export const DEFAULT_WEDGE_ANGLE = 90;
export const DEFAULT_ARC_INNER_RADIUS = 40;
export const DEFAULT_ARC_OUTER_RADIUS = 70;
export const DEFAULT_ARC_ANGLE = 120;

export const useSeatingMapState = () => {
  const [elements, setElements] = useState([]);
  console.log("🚀 ~ useSeatingMapState ~ elements:", elements);
  const [sections, setSections] = useState([]);
  const [selectedTool, setSelectedTool] = useState(TOOLS.SELECT);
  const [currentPlacementConfig, setCurrentPlacementConfig] = useState(null);
  const [selectedElementIds, setSelectedElementIds] = useState([]);
  console.log(
    "🚀 ~ useSeatingMapState ~ selectedElementIds:",
    selectedElementIds
  );
  const [selectedSectionId, setSelectedSectionId] = useState(null); // ID of the selected section *data*
  const [history, setHistory] = useState([INITIAL_HISTORY_STATE]);
  const [future, setFuture] = useState([]);

  // --- History Management ---
  const saveState = useCallback(() => {
    const currentState = {
      elements: JSON.parse(JSON.stringify(elements)), // Deep clone for history
      sections: JSON.parse(JSON.stringify(sections)),
    };
    const lastHistory = history[history.length - 1];
    if (JSON.stringify(lastHistory) !== JSON.stringify(currentState)) {
      setHistory((prev) => [...prev, currentState]);
      setFuture([]);
      console.log("State Saved", currentState);
    } else {
      console.log(
        "State not saved, no change detected from previous history state."
      );
    }
  }, [elements, sections, history]);

  const undo = useCallback(() => {
    if (history.length <= 1) return;
    const currentState = history[history.length - 1];
    setFuture((f) => [currentState, ...f]);
    const previousState = history[history.length - 2];
    setElements(previousState.elements); // Restore directly from history
    setSections(previousState.sections);
    setHistory((h) => h.slice(0, h.length - 1));
    setSelectedElementIds([]);
    setSelectedSectionId(null);
    console.log("Undo applied");
  }, [history]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const nextState = future[0];
    setHistory((h) => [...h, nextState]);
    setFuture((f) => f.slice(1));
    setElements(nextState.elements); // Restore directly from history
    setSections(nextState.sections);
    setSelectedElementIds([]);
    setSelectedSectionId(null);
    console.log("Redo applied");
  }, [future, history]);

  // --- Tool and Selection ---
  const handleSelectTool = useCallback((toolType) => {
    setSelectedTool(toolType);
    setSelectedElementIds([]);
    setSelectedSectionId(null);
    if (toolType.startsWith("place-")) {
      const elementType = toolType.replace("place-", "");
      const initialConfig = getDefaultElementProps(elementType);
      setCurrentPlacementConfig(initialConfig);
    } else {
      setCurrentPlacementConfig(null);
    }
  }, []);

  const handleSelectionChange = useCallback(
    ({ elementIds, sectionId }) => {
      const newSelectedIds = elementIds || [];
      let newSelectedSectionId = sectionId || null;
      const currentElementsState = elements;

      const hasChairSelected = newSelectedIds.some((id) => {
        const el = currentElementsState.find((e) => e.id === id);
        return el && el.type === ELEMENT_TYPES.CHAIR;
      });
      if (
        hasChairSelected &&
        !newSelectedIds.every(
          (id) =>
            currentElementsState.find((e) => e.id === id)?.type ===
            ELEMENT_TYPES.CHAIR
        )
      ) {
        // If mixing chairs and non-chairs in selection, prioritize non-chairs or clear chair selection
        // For now, let's clear section if chairs are involved
        newSelectedSectionId = null;
      } else if (hasChairSelected) {
        newSelectedSectionId = null;
      }

      setSelectedElementIds(newSelectedIds);
      setSelectedSectionId(newSelectedSectionId);
    },
    [elements]
  );

  // --- Element/Section Creation/Deletion ---
  const addElement = useCallback((elementType, position) => {
    if (!currentPlacementConfig || currentPlacementConfig.type !== elementType) {
        const fallbackConfig = getDefaultElementProps(elementType);
        if (!fallbackConfig) { alert("Error: Cannot determine element properties."); return; }
        setCurrentPlacementConfig(fallbackConfig);
    }
    const elementId = `${elementType}-${Date.now()}`;
    const newElementConfig = { ...(currentPlacementConfig || getDefaultElementProps(elementType)) };
    let newElement = { ...newElementConfig, id: elementId, x: position.x, y: position.y, rotation: 0 };

    let newElementsToAdd = [newElement];

    if (elementType === ELEMENT_TYPES.TABLE) {
        tableCounter++; // Increment table counter
        newElement.name = `Table ${tableCounter}`; // *** Assign default table name ***
        newElement.chairCount = newElement.chairCount ?? 0;
        newElement.chairSpacing = newElement.chairSpacing ?? 20;
        if (newElement.chairCount > 0) {
            const tableChairs = calculateTableChairPositions(newElement);
            newElementsToAdd = [...newElementsToAdd, ...tableChairs];
        }
    }
    setElements((prev) => [...prev, ...newElementsToAdd]);
    saveState();
    handleSelectionChange({ elementIds: [elementId], sectionId: null });
    handleSelectTool(TOOLS.SELECT);
}, [currentPlacementConfig, saveState, handleSelectionChange, handleSelectTool]);


  const addSection = useCallback(
    (sectionRect) => {
      if (
        !sectionRect ||
        sectionRect.width < MIN_SIZE ||
        sectionRect.height < MIN_SIZE
      )
        return;
      const sectionId = `section-${Date.now()}`;
      const boundaryId = `boundary-${sectionId}`;

      const sectionData = {
        id: sectionId,
        x: sectionRect.x,
        y: sectionRect.y,
        rows: sectionRect.rows || 1,
        cols: sectionRect.cols || 1,
        rowSpacing:
          sectionRect.rowSpacing ||
          DEFAULT_CONFIGS[ELEMENT_TYPES.SEAT].rowSpacing,
        colSpacing:
          sectionRect.colSpacing ||
          DEFAULT_CONFIGS[ELEMENT_TYPES.SEAT].colSpacing,
        curve: 0,
        rotation: 0,
        ...calculateSectionDimensions({
          rows: sectionRect.rows,
          cols: sectionRect.cols,
        }),
      };
      setSections((prev) => [...prev, sectionData]);

      const boundaryElement = {
        id: boundaryId,
        type: ELEMENT_TYPES.SECTION_BOUNDARY,
        sectionId: sectionId,
        x: sectionData.x,
        y: sectionData.y,
        width: sectionData.width,
        height: sectionData.height,
        rotation: sectionData.rotation,
      };
      // Generate individual chair elements and add them
      const chairs = calculateChairPositions(sectionData); // Pass the full section data

      setElements((prev) => [...prev, boundaryElement, ...chairs]);
      saveState();
      handleSelectionChange({ elementIds: [boundaryId], sectionId: sectionId });
    },
    [saveState, handleSelectionChange]
  );

  const deleteSectionById = useCallback((sectionId) => {
    // Internal helper
    if (!sectionId) return;
    const boundaryId = `boundary-${sectionId}`;
    setSections((prev) => prev.filter((sec) => sec.id !== sectionId));
    setElements((prev) =>
      prev.filter((el) => el.sectionId !== sectionId && el.id !== boundaryId)
    );
  }, []);

  const deleteSelected = useCallback(() => {
    let changed = false;
    const currentSelectedIds = [...selectedElementIds];
    const elementsBeforeDelete = [...elements];
    let elementsAfterDelete = [...elementsBeforeDelete];

    if (currentSelectedIds.length > 0) {
      const boundarySelected = currentSelectedIds.find(
        (id) =>
          elementsBeforeDelete.find((el) => el.id === id)?.type ===
          ELEMENT_TYPES.SECTION_BOUNDARY
      );
      const tableSelected = currentSelectedIds.find(
        (id) =>
          elementsBeforeDelete.find((el) => el.id === id)?.type ===
          ELEMENT_TYPES.TABLE
      );

      if (boundarySelected) {
        const sectionIdToDelete = elementsBeforeDelete.find(
          (el) => el.id === boundarySelected
        )?.sectionId;
        if (sectionIdToDelete) {
          // Remove section data
          setSections((prev) =>
            prev.filter((sec) => sec.id !== sectionIdToDelete)
          );
          // Remove boundary and its chairs
          elementsAfterDelete = elementsAfterDelete.filter(
            (el) =>
              el.sectionId !== sectionIdToDelete && el.id !== boundarySelected
          );
          changed = true;
        }
      } else if (tableSelected) {
        // Remove table and its associated chairs
        elementsAfterDelete = elementsAfterDelete.filter(
          (el) => el.id !== tableSelected && el.tableId !== tableSelected
        );
        changed = true;
      } else {
        // Deleting individual elements (could be chairs, independent tables, floor, etc.)
        elementsAfterDelete = elementsAfterDelete.filter(
          (el) => !currentSelectedIds.includes(el.id)
        );
        changed = true;
      }
    }

    if (changed) {
      setElements(elementsAfterDelete);
      setSelectedElementIds([]);
      setSelectedSectionId(null);
      saveState();
    }
  }, [selectedElementIds, elements, sections, deleteSectionById, saveState]);

  // --- Element/Section Updates ---

  // *** UPDATED: updateElementProperties handles table chair updates ***
  const updateElementProperties = useCallback(
    (elementId, updates, shouldSave = true) => {
      let objectChanged = false;
      let newElementsArray = [...elements]; // Create a copy to modify

      const elementIndex = newElementsArray.findIndex(
        (el) => el.id === elementId
      );
      if (elementIndex === -1) return;

      let originalElement = newElementsArray[elementIndex];
      let newProps = { ...originalElement, ...updates };

      // If updating a table's chairCount or chairSpacing, regenerate its chairs
      if (
        originalElement.type === ELEMENT_TYPES.TABLE &&
        (Object.hasOwn(updates, "chairCount") ||
          Object.hasOwn(updates, "chairSpacing"))
      ) {
        if (Object.hasOwn(updates, "chairCount"))
          newProps.chairCount = Math.max(
            0,
            parseInt(updates.chairCount, 10) || 0
          );
        if (Object.hasOwn(updates, "chairSpacing"))
          newProps.chairSpacing = Math.max(
            5,
            parseFloat(updates.chairSpacing) || 15
          );

        // Remove old chairs for this table
        newElementsArray = newElementsArray.filter(
          (el) => el.tableId !== elementId
        );
        // Generate new chairs with updated table props
        if (newProps.chairCount > 0) {
          const newTableChairs = calculateTableChairPositions(newProps); // Pass the updated table props
          newElementsArray.push(...newTableChairs);
        }
        // Update the table element itself
        newElementsArray = newElementsArray.map((el) =>
          el.id === elementId ? newProps : el
        );
        objectChanged = true; // Assume change as chairs are regenerated
      }
      // Handle shape changes for Tables/Stages (adds default dimensions for new shape)
      else if (
        (originalElement.type === ELEMENT_TYPES.TABLE ||
          originalElement.type === ELEMENT_TYPES.STAGE) &&
        Object.hasOwn(updates, "shape") &&
        updates.shape !== originalElement.shape
      ) {
        const newShape = updates.shape;
        delete newProps.width;
        delete newProps.height;
        delete newProps.radius;
        delete newProps.innerRadius;
        delete newProps.outerRadius;
        delete newProps.sides;
        delete newProps.numPoints;
        delete newProps.angle;
        switch (newShape) {
          case SHAPES.RECT:
            newProps.width = originalElement.width || DEFAULT_RECT_SIZE.width;
            newProps.height =
              originalElement.height || DEFAULT_RECT_SIZE.height;
            break;
          case SHAPES.CIRCLE:
            newProps.radius = originalElement.radius || DEFAULT_CIRCLE_RADIUS;
            break;
          case SHAPES.POLYGON:
            newProps.radius = originalElement.radius || DEFAULT_POLYGON_RADIUS;
            newProps.sides = originalElement.sides || DEFAULT_POLYGON_SIDES;
            break;
          case SHAPES.STAR:
            newProps.radius = originalElement.radius || DEFAULT_STAR_RADIUS;
            newProps.numPoints =
              originalElement.numPoints || DEFAULT_STAR_POINTS;
            newProps.innerRadius =
              originalElement.innerRadius > 0 &&
              originalElement.innerRadius < newProps.radius
                ? originalElement.innerRadius
                : newProps.radius * DEFAULT_STAR_INNER_RADIUS_RATIO;
            break;
          case SHAPES.RING:
            newProps.outerRadius =
              originalElement.outerRadius || DEFAULT_RING_OUTER_RADIUS;
            newProps.innerRadius =
              originalElement.innerRadius > 0 &&
              originalElement.innerRadius < newProps.outerRadius
                ? originalElement.innerRadius
                : DEFAULT_RING_INNER_RADIUS;
            break;
          // ... other shapes ...
        }
        newElementsArray = newElementsArray.map((el) =>
          el.id === elementId ? newProps : el
        );
        objectChanged = true;
      }
      // For individual chairs or other elements
      else {
        if (originalElement.type === ELEMENT_TYPES.CHAIR) {
          newProps = {
            ...originalElement,
            x: updates.x ?? originalElement.x,
            y: updates.y ?? originalElement.y,
            rotation: updates.rotation ?? originalElement.rotation,
          };
        }
        if (JSON.stringify(originalElement) !== JSON.stringify(newProps)) {
          newElementsArray = newElementsArray.map((el) =>
            el.id === elementId ? newProps : el
          );
          objectChanged = true;
        }
      }

      if (objectChanged) {
        setElements(newElementsArray);
        if (shouldSave) setTimeout(saveState, 0);
      }
    },
    [elements, saveState]
  );

  const elementsToRender = elements;
  // Recalculate when core elements or sections change

  const updateSectionProperties = useCallback(
    (sectionId, updates, shouldSave = true) => {
      let updatedSectionData = null;
      let layoutChanged = false;

      const newSections = sections.map((sec) => {
        if (sec.id === sectionId) {
          const oldLayoutProps = {
            rows: sec.rows,
            cols: sec.cols,
            curve: sec.curve,
            rowSpacing: sec.rowSpacing,
            colSpacing: sec.colSpacing,
          };
          const potentialUpdate = { ...sec, ...updates }; // 'name' will be in updates
          updatedSectionData = {
            ...potentialUpdate,
            ...calculateSectionDimensions(potentialUpdate),
          };

          if (
            updatedSectionData.rows !== oldLayoutProps.rows ||
            updatedSectionData.cols !== oldLayoutProps.cols ||
            updatedSectionData.curve !== oldLayoutProps.curve ||
            updatedSectionData.rowSpacing !== oldLayoutProps.rowSpacing ||
            updatedSectionData.colSpacing !== oldLayoutProps.colSpacing
          ) {
            layoutChanged = true;
          }
          return updatedSectionData;
        }
        return sec;
      });

      if (!updatedSectionData) {
        console.warn("Section not found for update:", sectionId);
        return;
      }
      setSections(newSections);

      setElements((prevElements) => {
        let newElementsList = [...prevElements];
        if (layoutChanged) {
          // Remove old chairs for this section
          newElementsList = newElementsList.filter(
            (el) =>
              !(el.sectionId === sectionId && el.type === ELEMENT_TYPES.CHAIR)
          );
          // Generate and add new chairs
          const newChairs = calculateChairPositions(updatedSectionData);
          newElementsList.push(...newChairs);
        }
        // Update the boundary element's size
        return newElementsList.map((el) => {
          if (
            el.type === ELEMENT_TYPES.SECTION_BOUNDARY &&
            el.sectionId === sectionId
          ) {
            return {
              ...el,
              width: updatedSectionData.width,
              height: updatedSectionData.height,
            };
          }
          return el;
        });
      });

      if (shouldSave) setTimeout(saveState, 0);
    },
    [sections, elements, saveState]
  );

  // --- Drag/Transform Updates (called by Canvas event handlers) ---
  const handleElementDragEnd = useCallback((draggedElementIds, dragDelta) => {
    // draggedElementIds is the array of IDs selected at the START of the drag
    // dragDelta is the {x, y} difference calculated in Canvas based on the initially grabbed node

    // Ensure we have valid IDs and a delta to apply
    if (!draggedElementIds || !dragDelta || draggedElementIds.length === 0) {
        console.warn("handleElementDragEnd called with invalid arguments:", draggedElementIds, dragDelta);
        return;
    }

    let changed = false; // Flag to track if any element's position actually changed

    setElements(prevElements => {
        // Create a new array using map to ensure immutability
        const newElements = prevElements.map(el => {
            // Check if this element was part of the group being dragged
            if (draggedElementIds.includes(el.id)) {
                // Calculate the new position by applying the delta
                const newX = el.x + dragDelta.x;
                const newY = el.y + dragDelta.y;

                // Check if the position actually changed to set the 'changed' flag
                if (el.x !== newX || el.y !== newY) {
                    changed = true;
                }

                // Return a *new* element object with the updated position
                return { ...el, x: newX, y: newY };
            }
            // Otherwise, return the element unchanged
            return el;
        });
        return newElements; // Return the potentially updated array for setElements
    });

    // Save state only if any element actually moved
    if (changed) {
         console.log(`[Hook] Applied drag delta ${JSON.stringify(dragDelta)} to ${draggedElementIds.length} elements.`);
         // Use setTimeout to ensure state update is processed before saving history
         setTimeout(saveState, 0);
    } else {
        console.log("DragEnd: No positional change detected for selected elements.");
    }

 }, [elements, saveState]); // Dependencies: 'elements' to map over, 'saveState' to save history



  // src/hooks/useSeatingMapState.js

  const handleSectionDragEnd = useCallback(
    (sectionId, delta) => {
      // Update section data (for boundary position)
      let newSectionX, newSectionY;
      setSections((prev) =>
        prev.map((sec) => {
          if (sec.id === sectionId) {
            newSectionX = sec.x + delta.x;
            newSectionY = sec.y + delta.y;
            return { ...sec, x: newSectionX, y: newSectionY };
          }
          return sec;
        })
      );
      // Update boundary and all its chairs in the elements array
      setElements((prev) =>
        prev.map((el) => {
          if (el.id === `boundary-${sectionId}`)
            return { ...el, x: newSectionX, y: newSectionY };
          if (el.sectionId === sectionId && el.type === ELEMENT_TYPES.CHAIR) {
            return { ...el, x: el.x + delta.x, y: el.y + delta.y };
          }
          return el;
        })
      );
      setTimeout(saveState, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [sections, elements, saveState]
  );

  const handleTransformEnd = useCallback(
    (transformedDataArray) => {
      console.log(
        "[Hook] handleTransformEnd received data from Canvas:",
        transformedDataArray
      );
      let changed = false;
      let currentElements = [...elements]; // Work with a copy
      let currentSections = [...sections];

      transformedDataArray.forEach((data) => {
        if (!data) {
          // data can be null if originalElement not found in Canvas
          console.warn(
            "[Hook] handleTransformEnd: Received null data object in array."
          );
          return;
        }

        const elementIndex = currentElements.findIndex(
          (el) => el.id === data.id
        );
        if (elementIndex === -1) {
          console.warn(`[Hook] Element ${data.id} not found during transform.`);
          return;
        }

        const originalElementInState = currentElements[elementIndex];
        // Start with position and rotation updates
        let updates = { x: data.x, y: data.y, rotation: data.rotation };

        // Destructure necessary props from the 'data' object (passed from Canvas)
        const {
          type,
          shape,
          originalWidth,
          originalHeight,
          originalRadius,
          originalOuterRadius,
          originalInnerRadius,
          originalLength,
          originalScaleX,
          originalScaleY,
          scaleX,
          scaleY, // These are the scale factors from this transform operation
        } = data;

        // Apply scale effects to dimensions/radii for specific types
        if (type === ELEMENT_TYPES.TABLE || type === ELEMENT_TYPES.STAGE) {
          switch (shape) {
            case SHAPES.RECT:
              updates.width = Math.max(
                MIN_SIZE,
                (originalWidth || DEFAULT_RECT_SIZE.width) * scaleX
              );
              updates.height = Math.max(
                MIN_SIZE,
                (originalHeight || DEFAULT_RECT_SIZE.height) * scaleY
              );
              break;
            case SHAPES.CIRCLE:
            case SHAPES.WEDGE:
            case SHAPES.POLYGON:
            case SHAPES.STAR: {
              const avgScaleRad = (scaleX + scaleY) / 2;
              const currentRadius =
                originalRadius ||
                (shape === SHAPES.STAR
                  ? DEFAULT_STAR_RADIUS
                  : shape === SHAPES.POLYGON
                  ? DEFAULT_POLYGON_RADIUS
                  : DEFAULT_CIRCLE_RADIUS);
              updates.radius = Math.max(MIN_SIZE, currentRadius * avgScaleRad);
              if (shape === SHAPES.STAR) {
                const currentInnerRadius =
                  originalInnerRadius ||
                  currentRadius * DEFAULT_STAR_INNER_RADIUS_RATIO;
                updates.innerRadius = Math.max(
                  MIN_SIZE / 2,
                  currentInnerRadius * avgScaleRad
                );
                updates.innerRadius = Math.min(
                  updates.innerRadius,
                  updates.radius * 0.95
                );
              }
              break;
            }
            case SHAPES.RING:
            case SHAPES.ARC: {
              const avgScaleOuterRing = (scaleX + scaleY) / 2;
              const currentOuterR =
                originalOuterRadius ||
                (shape === SHAPES.RING
                  ? DEFAULT_RING_OUTER_RADIUS
                  : DEFAULT_ARC_OUTER_RADIUS);
              const currentInnerR =
                originalInnerRadius ||
                (shape === SHAPES.RING
                  ? DEFAULT_RING_INNER_RADIUS
                  : DEFAULT_ARC_INNER_RADIUS);
              updates.outerRadius = Math.max(
                MIN_SIZE,
                currentOuterR * avgScaleOuterRing
              );
              updates.innerRadius = Math.max(
                MIN_SIZE / 2,
                currentInnerR * avgScaleOuterRing
              );
              updates.innerRadius = Math.min(
                updates.innerRadius,
                updates.outerRadius * 0.95
              );
              updates.outerRadius = Math.max(
                updates.outerRadius,
                updates.innerRadius * 1.02
              );
              // Note: Angle for ARC/WEDGE is not scaled by transformer, only by direct input
              break;
            }
            default:
              break;
          }
        } else if (
          type === ELEMENT_TYPES.ENTRANCE ||
          type === ELEMENT_TYPES.EXIT
        ) {
          // Accumulate scale for paths
          updates.scaleX = (originalScaleX || 1) * scaleX;
          updates.scaleY = (originalScaleY || 1) * scaleY;
        } else if (type === ELEMENT_TYPES.FLOOR) {
          // Scale length for Floor
          const avgScaleLen = (scaleX + scaleY) / 2; // Use average for 1D scaling
          const currentLength = originalLength || 200;
          const newLength = Math.max(MIN_SIZE * 2, currentLength * avgScaleLen);
          updates.length = newLength;
          updates.startX = -newLength / 2; // Recalculate points based on new length
          updates.endX = newLength / 2;
          updates.startY = 0; // Assuming floor line is always horizontal relative to its group
          updates.endY = 0;
        } else if (type === ELEMENT_TYPES.SECTION_BOUNDARY && data.sectionId) {
          const sectionId = data.sectionId;
          const sectionIndex = currentSections.findIndex(
            (sec) => sec.id === sectionId
          );
          if (sectionIndex === -1) return; // Should not happen
          const oldSectionData = currentSections[sectionIndex];

          const newWidth = Math.max(MIN_SIZE, (originalWidth || 0) * scaleX);
          const newHeight = Math.max(MIN_SIZE, (originalHeight || 0) * scaleY);
          const updatedSectionData = {
            ...oldSectionData,
            x: data.x,
            y: data.y,
            width: newWidth,
            height: newHeight,
            rotation: data.rotation,
          };
          currentSections[sectionIndex] = updatedSectionData;

          // Update boundary element in currentElements
          currentElements[elementIndex] = {
            ...originalElementInState,
            ...updates,
            width: newWidth,
            height: newHeight,
          };
          changed = true; // Mark sections changed

          // Regenerate chairs for the section based on new boundary dimensions
          const newChairs = calculateChairPositions(updatedSectionData);
          // Remove old chairs for this section and add new ones
          currentElements = currentElements.filter(
            (el) =>
              !(el.sectionId === sectionId && el.type === ELEMENT_TYPES.CHAIR)
          );
          currentElements.push(...newChairs);
          // No return here, let the main element update check proceed if needed (though boundary is handled)
        } else if (type === ELEMENT_TYPES.CHAIR) {
          // Chairs only update position and rotation, no scaling from transformer
          updates = { x: data.x, y: data.y, rotation: data.rotation };
        }

        // Apply updates if it's not a section boundary (already handled and chairs regenerated)
        // For other elements (Table, Stage, Floor, Path, Chair), apply the calculated 'updates'
        if (type !== ELEMENT_TYPES.SECTION_BOUNDARY) {
          const newElementData = { ...originalElementInState, ...updates };
          if (
            JSON.stringify(originalElementInState) !==
            JSON.stringify(newElementData)
          ) {
            currentElements[elementIndex] = newElementData;
            changed = true;
          }
        }
      }); // End forEach transformedData

      if (changed) {
        setElements(currentElements);
        if (JSON.stringify(currentSections) !== JSON.stringify(sections)) {
          setSections(currentSections);
        }
        saveState();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [elements, sections, saveState, calculateChairPositions]
  ); // Added calculateChairPositions

  // Memoized values derived from state
  const selectedElementData = useMemo(() => {
    if (selectedElementIds.length !== 1 || selectedSectionId) return null;
    return elements.find((el) => el.id === selectedElementIds[0]); // Find from the main elements array
  }, [elements, selectedElementIds, selectedSectionId]);

  const selectedSectionData = useMemo(() => {
    if (!selectedSectionId) return null;
    return sections.find((sec) => sec.id === selectedSectionId);
  }, [sections, selectedSectionId]);

  return {
    // State
    elements: elementsToRender,
    sections,
    selectedTool,
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
    setCurrentPlacementConfig, // Allow direct config changes from form
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
    saveState, // Expose saveState for onBlur etc.

    // Clear All (specific action)
    clearAll: useCallback(() => {
      setElements([]);
      setSections([]);
      setSelectedElementIds([]);
      setSelectedSectionId(null);
      setHistory([INITIAL_HISTORY_STATE]);
      setFuture([]);
      // saveState(); // No need to save an empty state? Or maybe save it.
      console.log("Cleared All");
    }, []),
  };
};
