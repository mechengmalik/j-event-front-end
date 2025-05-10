import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ELEMENT_TYPES,
  MIN_SIZE,
  SHAPES,
  TOOLS,
  PATH_DATA,
  getDefaultElementProps,
  DEFAULT_CHAIR_SIZE,
  DEFAULT_CONFIGS,
} from "../constants";
import { calculateChairPositions } from "../utils/chairUtils";
import { calculateSectionDimensions } from "../utils/sectionUtils";
import { calculateTableChairPositions } from "../utils/tableChairUtils.js";
let tableCounter = 0;

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
export const DEFAULT_COLOR = "#000000";

export const useSeatingMapState = () => {
  const [elements, setElements] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedTool, setSelectedTool] = useState(TOOLS.SELECT);
  const [selectedSVGPath, setSelectedSVGPath] = useState();

  const [currentPlacementConfig, setCurrentPlacementConfig] = useState(null);
  const [selectedElementIds, setSelectedElementIds] = useState([]);

  const [selectedSectionId, setSelectedSectionId] = useState(null); // ID of the selected section *data*
  const [history, setHistory] = useState([INITIAL_HISTORY_STATE]);
  const [future, setFuture] = useState([]);
  const [clipboard, setClipboard] = useState(null);
  const [isPasting, setPasting] = useState(false);

  // --- History Management ---
  const saveState = useCallback(() => {
    console.log("SAVE: Attempting to save current state");

    // Create a deep clone of the current state
    const currentState = {
      elements: JSON.parse(JSON.stringify(elements)),
      sections: JSON.parse(JSON.stringify(sections)),
    };

    // If history is empty, always save
    if (history.length === 0) {
      console.log("SAVE: Initial state saved");
      setHistory([currentState]);
      return;
    }

    // Get the last history state
    const lastHistory = history[history.length - 1];

    // Compare stringified versions of the states
    const lastStateStr = JSON.stringify(lastHistory);
    const currentStateStr = JSON.stringify(currentState);

    // Only save if there's a meaningful difference
    if (lastStateStr !== currentStateStr) {
      console.log("SAVE: State changed, saving to history");
      setHistory((prev) => [...prev, currentState]);

      // Clear future when new state is saved
      if (future.length > 0) {
        console.log("SAVE: Clearing future history");
        setFuture([]);
      }
    } else {
      console.log("SAVE: No changes detected, state not saved");
    }
  }, [elements, sections, history, future]);

  const undo = useCallback(() => {
    // First, add debugging to understand what's happening
    console.log("UNDO: Current history state:", {
      historyLength: history.length,
      currentState: history[history.length - 1],
      previousState: history.length > 1 ? history[history.length - 2] : "none",
      futureLength: future.length,
    });

    // Basic check: we need at least 2 states to undo (initial + current)
    if (history.length <= 1) {
      console.log("UNDO: Not enough history to undo");
      return;
    }

    // Get current and previous states
    const currentState = history[history.length - 1];
    const previousState = history[history.length - 2];

    // Create new references for history and future to avoid potential issues
    const newHistory = history.slice(0, history.length - 1);
    const newFuture = [currentState, ...future];

    console.log("UNDO: New state arrays prepared:", {
      newHistoryLength: newHistory.length,
      newFutureLength: newFuture.length,
      stateToApply: previousState,
    });

    // Apply updates in a controlled order to avoid race conditions
    // First update the history/future management
    setHistory(newHistory);
    setFuture(newFuture);

    // Then apply the actual state changes
    setElements(previousState.elements);
    setSections(previousState.sections);

    // Finally clear selections
    setSelectedElementIds([]);
    setSelectedSectionId(null);

    console.log("UNDO: Operation complete");
  }, [history, future]);

  const redo = useCallback(() => {
    if (future.length === 0) {
      console.log("Redo attempted but future array is empty");
      return;
    }

    console.log("Redo: Current state before operation", {
      historyLength: history.length,
      futureLength: future.length,
      currentState: history[history.length - 1],
      nextState: future[0],
    });

    // Get the next state from future
    const nextState = future[0];

    // Add it to history (this creates a new array reference)
    const newHistory = [...history, nextState];

    // Remove it from future (this creates a new array reference)
    const newFuture = future.slice(1);

    console.log("Redo: After arrays prepared", {
      newHistoryLength: newHistory.length,
      newFutureLength: newFuture.length,
    });

    // Update state all at once to avoid race conditions
    setHistory(newHistory);
    setFuture(newFuture);
    setElements(nextState.elements);
    setSections(nextState.sections);

    // Clear selections
    setSelectedElementIds([]);
    setSelectedSectionId(null);

    console.log("Redo: Operation complete");
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
      setTimeout(saveState, 0);
    },
    [elements]
  );

  // --- Element/Section Creation/Deletion ---
  const addElement = useCallback(
    (elementType, position) => {
      if (
        !currentPlacementConfig ||
        currentPlacementConfig.type !== elementType
      ) {
        const fallbackConfig = getDefaultElementProps(elementType);
        if (!fallbackConfig) {
          alert("Error: Cannot determine element properties.");
          return;
        }
        setCurrentPlacementConfig(fallbackConfig);
      }

      const elementId = `${elementType}-${Date.now()}`;
      // Ensure currentPlacementConfig is up-to-date before spreading
      const baseConfig =
        currentPlacementConfig || getDefaultElementProps(elementType);
      let newElement = {
        ...baseConfig,
        id: elementId,
        x: position.x,
        y: position.y,
        rotation: 0,
        fill: baseConfig.fill || DEFAULT_COLOR, // Ensure fill is set
        stroke: baseConfig.stroke || "#000000", // Ensure stroke is set
      };

      if (elementType === ELEMENT_TYPES.TABLE) {
        tableCounter++;
        newElement.name = newElement.name || `Table ${tableCounter}`;
        newElement.chairCount = newElement.chairCount ?? 0;
        newElement.chairSpacing = newElement.chairSpacing ?? 20;

        let tableChairs = [];
        if (newElement.chairCount > 0) {
          tableChairs = calculateTableChairPositions(newElement); // These chairs have absolute coords
          // Inherit color from table for chairs
          tableChairs = tableChairs.map((chair) => ({
            ...chair,
            fill: newElement.fill || DEFAULT_COLOR,
            stroke: chair.stroke || "#000000",
          }));
        }
        newElement.seats = tableChairs; // Embed full chair objects
      } else if (elementType === ELEMENT_TYPES.TEXT) {
        newElement = {
          id: elementId,
          type: ELEMENT_TYPES.TEXT,
          x: position.x,
          y: position.y,
          rotation: 0,
          text: "New Text", // Default text content
          fontSize: 24,
          fill: baseConfig.fill || "#333", // Text color
          align: "center",
          verticalAlign: "middle",
        };
      }

      setElements((prev) => [...prev, newElement]); // Add the single new element
      setTimeout(saveState, 0);
      // Save state after elements are updated
      handleSelectionChange({ elementIds: [elementId], sectionId: null });
      handleSelectTool(TOOLS.SELECT); // Switch to select tool after placing
    },
    [currentPlacementConfig, saveState, handleSelectionChange, handleSelectTool]
  );

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
        svgPath: selectedSVGPath,
        fill: sectionRect.fill || DEFAULT_COLOR, // New: Section color for chairs
        stroke: sectionRect.stroke || "#000000",
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
        fill: sectionData.fill,
        stroke: sectionData.stroke,
      };
      // Generate individual chair elements and add them
      const chairs = calculateChairPositions(sectionData); // Pass the full section data
      // Ensure chairs inherit section color
      const chairsWithColor = chairs.map((chair) => ({
        ...chair,
        fill: sectionData.fill,
        stroke: chair.stroke || "#000000",
      }));

      setElements((prev) => [...prev, boundaryElement, ...chairsWithColor]);
      setTimeout(saveState, 0);

      handleSelectionChange({ elementIds: [boundaryId], sectionId: sectionId });
    },
    [selectedSVGPath, saveState, handleSelectionChange]
  );

  const deleteSectionById = useCallback(
    (sectionId) => {
      // Internal helper
      if (!sectionId) return;
      const boundaryId = `boundary-${sectionId}`;
      setSections((prev) => prev.filter((sec) => sec.id !== sectionId));
      setElements((prev) =>
        prev.filter((el) => el.sectionId !== sectionId && el.id !== boundaryId)
      );
      setTimeout(saveState, 0);
    },
    [saveState]
  );

  const deleteSelected = useCallback(() => {
    let changed = false;
    const currentSelectedIds = [...selectedElementIds];
    const elementsBeforeDelete = [...elements];
    let elementsAfterDelete = [...elementsBeforeDelete];
    let sectionsWereModified = false;

    if (currentSelectedIds.length > 0) {
      const boundarySelectedId = currentSelectedIds.find(
        (id) =>
          elementsBeforeDelete.find((el) => el.id === id)?.type ===
          ELEMENT_TYPES.SECTION_BOUNDARY
      );
      const tableSelectedId = currentSelectedIds.find(
        (id) =>
          elementsBeforeDelete.find((el) => el.id === id)?.type ===
          ELEMENT_TYPES.TABLE
      );
      const chairsToDelete = currentSelectedIds.filter(
        (id) =>
          elementsBeforeDelete.find((el) => el.id === id)?.type ===
          ELEMENT_TYPES.CHAIR
      );

      if (boundarySelectedId) {
        const sectionIdToDelete = elementsBeforeDelete.find(
          (el) => el.id === boundarySelectedId
        )?.sectionId;
        if (sectionIdToDelete) {
          setSections((prev) => {
            const newSections = prev.filter(
              (sec) => sec.id !== sectionIdToDelete
            );
            if (newSections.length !== prev.length) sectionsWereModified = true;
            return newSections;
          });
          elementsAfterDelete = elementsAfterDelete.filter(
            (el) =>
              el.sectionId !== sectionIdToDelete && el.id !== boundarySelectedId
          );
          changed = true;
        }
      } else if (tableSelectedId) {
        elementsAfterDelete = elementsAfterDelete.filter(
          (el) => el.id !== tableSelectedId && el.tableId !== tableSelectedId
        );
        changed = true;
      } else if (chairsToDelete.length > 0) {
        const sectionChairsToDelete = chairsToDelete.filter(
          (chairId) =>
            elementsBeforeDelete.find((el) => el.id === chairId)?.sectionId
        );
        const tableChairsToDelete = chairsToDelete.filter(
          (chairId) =>
            elementsBeforeDelete.find((el) => el.id === chairId)?.tableId
        );

        elementsAfterDelete = elementsAfterDelete.filter(
          (el) => !chairsToDelete.includes(el.id)
        );
        changed = true;

        // Re-number seats in affected sections
        const affectedSectionIds = [
          ...new Set(
            sectionChairsToDelete
              .map(
                (id) =>
                  elementsBeforeDelete.find((el) => el.id === id)?.sectionId
              )
              .filter(Boolean)
          ),
        ];
        affectedSectionIds.forEach((sectionIdToUpdate) => {
          const updatedElements = elementsAfterDelete
            .filter(
              (el) =>
                el.type === ELEMENT_TYPES.CHAIR &&
                el.sectionId === sectionIdToUpdate
            )
            .sort((a, b) => a.r - b.r || a.c - b.c)
            .map((seat, index) => ({ ...seat, seatNumber: index + 1 }));
          elementsAfterDelete = elementsAfterDelete.map(
            (el) => updatedElements.find((s) => s.id === el.id) || el
          );
        });

        // Re-number seats in affected tables
        const affectedTableIds = [
          ...new Set(
            tableChairsToDelete
              .map(
                (id) => elementsBeforeDelete.find((el) => el.id === id)?.tableId
              )
              .filter(Boolean)
          ),
        ];
        affectedTableIds.forEach((tableIdToUpdate) => {
          const updatedElements = elementsAfterDelete
            .filter(
              (el) =>
                el.type === ELEMENT_TYPES.CHAIR &&
                el.tableId === tableIdToUpdate
            )
            .map((seat, index) => ({ ...seat, seatNumber: index + 1 }));
          elementsAfterDelete = elementsAfterDelete.map(
            (el) => updatedElements.find((s) => s.id === el.id) || el
          );
        });
      } else {
        elementsAfterDelete = elementsAfterDelete.filter(
          (el) => !currentSelectedIds.includes(el.id)
        );
        if (elementsAfterDelete.length !== elementsBeforeDelete.length)
          changed = true;
      }
    }

    if (changed || sectionsWereModified) {
      setElements(elementsAfterDelete);
      setSelectedElementIds([]);
      setSelectedSectionId(null);
      setTimeout(saveState, 0);
    }
  }, [selectedElementIds, elements, sections, deleteSectionById, saveState]);

  // *** UPDATED: updateElementProperties handles table chair updates ***

  const updateElementProperties = useCallback(
    (elementId, updates, shouldSave = true) => {
      if (!elementId) return;
      let objectChanged = false;
      let newElementsArray = [...elements]; // Create a copy to modify

      const elementIndex = newElementsArray.findIndex(
        (el) => el.id === elementId
      );
      if (elementIndex === -1) return;

      let originalElement = newElementsArray[elementIndex];
      let newProps = { ...originalElement, ...updates };

      // Handle color updates for tables and their chairs
      if (
        originalElement.type === ELEMENT_TYPES.TABLE &&
        (Object.hasOwn(updates, "fill") || Object.hasOwn(updates, "stroke"))
      ) {
        // If we're updating table color, update its chairs too
        const chairsToUpdate = newElementsArray.filter(
          (el) => el.tableId === elementId && el.type === ELEMENT_TYPES.CHAIR
        );

        if (chairsToUpdate.length > 0) {
          chairsToUpdate.forEach((chair) => {
            const chairIndex = newElementsArray.findIndex(
              (el) => el.id === chair.id
            );
            if (chairIndex !== -1) {
              if (Object.hasOwn(updates, "fill")) {
                newElementsArray[chairIndex] = {
                  ...newElementsArray[chairIndex],
                  fill: updates.fill,
                };
              }
              if (Object.hasOwn(updates, "stroke")) {
                newElementsArray[chairIndex] = {
                  ...newElementsArray[chairIndex],
                  stroke: updates.stroke,
                };
              }
            }
          });
          objectChanged = true;
        }
      }

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

          // Ensure new chairs inherit table color
          const chairsWithColor = newTableChairs.map((chair) => ({
            ...chair,
            fill: newProps.fill || DEFAULT_COLOR,
            stroke: newProps.stroke || "#000000",
          }));

          newElementsArray.push(...chairsWithColor);
        }
        // Update the table element itself
        newElementsArray = newElementsArray.map((el) =>
          el.id === elementId ? newProps : el
        );
        objectChanged = true; // Assume change as chairs are regenerated
      }
      // For individual chairs or other elements
      else {
        if (originalElement.type === ELEMENT_TYPES.CHAIR) {
          newProps = {
            ...originalElement,
            x: updates.x ?? originalElement.x,
            y: updates.y ?? originalElement.y,
            rotation: updates.rotation ?? originalElement.rotation,
            fill: updates.fill ?? originalElement.fill,
            stroke: updates.stroke ?? originalElement.stroke,
            svgPath: updates.svgPath ?? originalElement.svgPath,
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
        setTimeout(saveState, 0);
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
      let colorChanged =
        Object.hasOwn(updates, "fill") || Object.hasOwn(updates, "stroke");
      console.log("🚀 ~ useSeatingMapState ~ updates:", updates);

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
          // Ensure chairs have section color
          const chairsWithColor = newChairs.map((chair) => ({
            ...chair,
            fill: updatedSectionData.fill || DEFAULT_COLOR,
            stroke: updatedSectionData.stroke || "#000000",
          }));
          newElementsList.push(...chairsWithColor);
        } else if (colorChanged) {
          // Just update colors of existing chairs without regenerating layout
          newElementsList = newElementsList.map((el) => {
            if (el.sectionId === sectionId && el.type === ELEMENT_TYPES.CHAIR) {
              return {
                ...el,
                fill: updates.fill !== undefined ? updates.fill : el.fill,
                stroke:
                  updates.stroke !== undefined ? updates.stroke : el.stroke,
              };
            }
            return el;
          });
        }

        // Update the boundary element's size and color
        return newElementsList.map((el) => {
          if (
            el.type === ELEMENT_TYPES.SECTION_BOUNDARY &&
            el.sectionId === sectionId
          ) {
            return {
              ...el,
              width: updatedSectionData.width,
              height: updatedSectionData.height,
              fill: updatedSectionData.fill,
              stroke: updatedSectionData.stroke,
            };
          }
          return el;
        });
      });

      setTimeout(saveState, 0);
    },
    [sections, elements, saveState]
  );

  // --- Drag/Transform Updates (called by Canvas event handlers) ---
  const handleElementDragEnd = useCallback(
    (draggedElementIds, dragDelta) => {
      // draggedElementIds is the array of IDs selected at the START of the drag
      // dragDelta is the {x, y} difference calculated in Canvas based on the initially grabbed node

      // Ensure we have valid IDs and a delta to apply
      if (!draggedElementIds || !dragDelta || draggedElementIds.length === 0) {
        console.warn(
          "handleElementDragEnd called with invalid arguments:",
          draggedElementIds,
          dragDelta
        );
        return;
      }

      let changed = false; // Flag to track if any element's position actually changed

      setElements((prevElements) => {
        // Create a new array using map to ensure immutability
        const newElements = prevElements.map((el) => {
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
        console.log(
          `[Hook] Applied drag delta ${JSON.stringify(dragDelta)} to ${
            draggedElementIds.length
          } elements.`
        );
        // Use setTimeout to ensure state update is processed before saving history
        setTimeout(saveState, 0);
      } else {
        console.log(
          "DragEnd: No positional change detected for selected elements."
        );
      }
    },
    [saveState]
  ); // Dependencies: 'elements' to map over, 'saveState' to save history

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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

          const newWidth = Math.max(MIN_SIZE, originalWidth || 0);
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

          // Get existing chairs for this section
          const existingChairs = currentElements.filter(
            (el) =>
              el.sectionId === sectionId && el.type === ELEMENT_TYPES.CHAIR
          );

          // Store existing chair properties by row-column index
          const chairProps = {};
          existingChairs.forEach((chair) => {
            const key = `${chair.r}-${chair.c}`;
            chairProps[key] = {
              isReserved: chair.isReserved,
              fill: chair.fill,
              svgPath: chair.svgPath,
              // Add any other properties you want to preserve
              // Like custom styles, individual rotations, etc.
            };
          });

          // Generate base chair positions with the new section geometry
          const newChairs = calculateChairPositions(updatedSectionData);

          // Apply preserved properties to the new chairs
          newChairs.forEach((chair) => {
            const key = `${chair.r}-${chair.c}`;
            if (chairProps[key]) {
              Object.assign(chair, chairProps[key]);
            }
          });

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
        setTimeout(saveState, 0);
      }
    },
    [elements, sections, saveState, calculateChairPositions]
  );

  // Memoized values derived from state
  const selectedElementData = useMemo(() => {
    if (selectedElementIds.length !== 1 || selectedSectionId) return null;
    return elements.find((el) => el.id === selectedElementIds[0]); // Find from the main elements array
  }, [elements, selectedElementIds, selectedSectionId]);

  const selectedSectionData = useMemo(() => {
    if (!selectedSectionId) return null;
    return sections.find((sec) => sec.id === selectedSectionId);
  }, [sections, selectedSectionId]);

  const prepareDataForExport = useCallback(() => {
    const tables = elements
      .filter((el) => el.type === ELEMENT_TYPES.TABLE)
      .map((table) => ({
        ...table,
        seats: elements.filter(
          (seat) =>
            seat.type === ELEMENT_TYPES.CHAIR && seat.tableId === table.id
        ),
      }));

    const sectionsWithSeats = sections.map((section) => ({
      ...section,
      seats: elements.filter(
        (seat) =>
          seat.type === ELEMENT_TYPES.CHAIR && seat.sectionId === section.id
      ),
    }));

    const otherElements = elements.filter(
      (el) =>
        el.type !== ELEMENT_TYPES.TABLE &&
        el.type !== ELEMENT_TYPES.CHAIR &&
        el.type !== ELEMENT_TYPES.SECTION_BOUNDARY
    );

    return {
      elements: otherElements,
      sections: sectionsWithSeats,
      // If you still want a flat list of all seats for some reason:
      seats: elements.filter((el) => el.type === ELEMENT_TYPES.CHAIR),
      tables: tables,
    };
  }, [elements, sections]);

  const copySelectedElements = useCallback(() => {
    if (selectedElementIds.length > 0) {
      console.log(
        "🚀 ~ copySelectedElements ~ selectedElementIds:",
        selectedElementIds
      );
      const copiedItems = selectedElementIds
        .map((id) => {
          const element = elements.find((el) => el.id === id);
          if (element) {
            if (
              element.type === ELEMENT_TYPES.SECTION_BOUNDARY &&
              element.sectionId
            ) {
              const section = sections.find(
                (sec) => sec.id === element.sectionId
              );
              const sectionSeats = elements.filter(
                (el) =>
                  el.type === ELEMENT_TYPES.CHAIR &&
                  el.sectionId === element.sectionId
              );
              return {
                boundary: JSON.parse(JSON.stringify(element)),
                section: section ? JSON.parse(JSON.stringify(section)) : null,
                seats: JSON.parse(JSON.stringify(sectionSeats)),
              };
            }
            return {
              element: JSON.parse(JSON.stringify(element)),
              section: null,
              seats:
                element.type === ELEMENT_TYPES.TABLE
                  ? JSON.parse(JSON.stringify(element.seats))
                  : null,
            };
          }
          return null;
        })
        .filter(Boolean);
      setClipboard(copiedItems);
    } else if (selectedSectionId) {
      const section = sections.find((sec) => sec.id === selectedSectionId);
      const boundary = elements.find(
        (el) =>
          el.type === ELEMENT_TYPES.SECTION_BOUNDARY &&
          el.sectionId === selectedSectionId
      );
      const sectionSeats = elements.filter(
        (el) =>
          el.type === ELEMENT_TYPES.CHAIR && el.sectionId === selectedSectionId
      );
      if (section && boundary) {
        setClipboard([
          {
            boundary: JSON.parse(JSON.stringify(boundary)),
            section: JSON.parse(JSON.stringify(section)),
            seats: JSON.parse(JSON.stringify(sectionSeats)),
          },
        ]);
      }
    }
    setTimeout(saveState, 0);
  }, [elements, saveState, sections, selectedElementIds, selectedSectionId]);

  // --- Cut Functionality ---
  const cutSelectedElements = useCallback(() => {
    if (selectedElementIds.length > 0) {
      copySelectedElements(); // Copy first
      deleteSelected(); // Then delete
    } else if (selectedSectionId) {
      copySelectedElements(); // Copy first
      // Implement section deletion here (similar to deleteSelected for boundaries)
      const sectionIdToDelete = selectedSectionId;
      setSections((prev) => prev.filter((sec) => sec.id !== sectionIdToDelete));
      setElements((prev) =>
        prev.filter(
          (el) =>
            el.sectionId !== sectionIdToDelete &&
            el.id !== `boundary-${sectionIdToDelete}`
        )
      );
      setSelectedSectionId(null);
      setSelectedElementIds([]);
      setTimeout(saveState, 0);
    }
  }, [
    copySelectedElements,
    deleteSelected,
    selectedElementIds,
    selectedSectionId,
    saveState,
  ]);

  // --- Paste Functionality ---
  const pasteElements = (position = null) => {
    if (clipboard && clipboard.length > 0) {
      const pastedElements = clipboard
        .map((item) => {
          if (item.section && item.boundary) {
            const newSectionId = `section-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 15)}`;
            const newBoundaryId = `boundary-${newSectionId}`;

            // Fallback to +20 offset if position is not provided
            const baseX = position ? position.x : item.section.x + 20;
            const baseY = position ? position.y : item.section.y + 20;

            const offsetX = baseX - item.section.x;
            const offsetY = baseY - item.section.y;

            const newSection = {
              ...item.section,
              id: newSectionId,
              x: baseX,
              y: baseY,
              seats: [],
            };

            setSections((prev) => [...prev, newSection]);

            const newChairs = item.seats.map((seat) => ({
              ...seat,
              id: `chair-${newSectionId}-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 15)}`,
              sectionId: newSectionId,
              x: seat.x + offsetX,
              y: seat.y + offsetY,
            }));

            setElements((prev) => [...prev, ...newChairs]);

            return {
              id: newBoundaryId,
              type: ELEMENT_TYPES.SECTION_BOUNDARY,
              sectionId: newSectionId,
              x: item.boundary.x + offsetX,
              y: item.boundary.y + offsetY,
              width: item.boundary.width,
              height: item.boundary.height,
              rotation: item.boundary.rotation,
            };
          } else if (item.element) {
            const newId = `${item.element.type}-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 15)}`;

            const baseX = position ? position.x : item.element.x + 20;
            const baseY = position ? position.y : item.element.y + 20;

            const offsetX = baseX - item.element.x;
            const offsetY = baseY - item.element.y;

            const newItem = {
              ...item.element,
              id: newId,
              x: baseX,
              y: baseY,
            };

            if (newItem.type === ELEMENT_TYPES.TABLE && newItem.seats) {
              newItem.seats = newItem.seats.map((seat) => ({
                ...seat,
                id: `${seat.type}-${Date.now()}-${Math.random()
                  .toString(36)
                  .substring(2, 15)}`,
                tableId: newId,
                x: seat.x + offsetX,
                y: seat.y + offsetY,
              }));
            }

            return newItem;
          }
          return null;
        })
        .filter(Boolean);

      setPasting(true);
      setElements((prev) => [...prev, ...pastedElements]);
      setSelectedElementIds(pastedElements.map((el) => el.id));
      setSelectedSectionId(
        pastedElements.find((el) => el.type === ELEMENT_TYPES.SECTION_BOUNDARY)
          ?.sectionId || null
      );
      setTimeout(saveState, 0);
      setTimeout(() => setPasting(false), 100);
    }
  };

  const updateElementColor = useCallback(
    (elementIds, colorUpdates) => {
      if (!elementIds || elementIds.length === 0 || !colorUpdates) return;

      setElements((prevElements) => {
        const updatedElements = [...prevElements];
        let changed = false;

        elementIds.forEach((elementId) => {
          const index = updatedElements.findIndex((el) => el.id === elementId);
          if (index !== -1) {
            // Update this element's color
            updatedElements[index] = {
              ...updatedElements[index],
              ...colorUpdates,
            };
            changed = true;

            // If it's a table, update its chairs too
            const element = updatedElements[index];
            if (element.type === ELEMENT_TYPES.TABLE) {
              // Find and update all chairs for this table
              for (let i = 0; i < updatedElements.length; i++) {
                if (
                  updatedElements[i].tableId === elementId &&
                  updatedElements[i].type === ELEMENT_TYPES.CHAIR
                ) {
                  updatedElements[i] = {
                    ...updatedElements[i],
                    ...colorUpdates,
                  };
                }
              }
            }

            // If it's a section boundary, update section and all its chairs
            if (
              element.type === ELEMENT_TYPES.SECTION_BOUNDARY &&
              element.sectionId
            ) {
              // First update the section data
              setSections((prevSections) =>
                prevSections.map((section) =>
                  section.id === element.sectionId
                    ? { ...section, ...colorUpdates }
                    : section
                )
              );

              // Then update all chairs in this section
              for (let i = 0; i <= updatedElements.length; i++) {
                if (
                  updatedElements[i]?.sectionId === element.sectionId &&
                  updatedElements[i]?.type === ELEMENT_TYPES.CHAIR
                ) {
                  updatedElements[i] = {
                    ...updatedElements[i],
                    ...colorUpdates,
                  };
                }
              }
            }
          }
        });

        if (changed) {
          setTimeout(saveState, 0);
          return updatedElements;
        }
        return prevElements;
      });
    },
    [saveState, setSections]
  );

  const handleSelectedSVGPath = useCallback(
    (shapeName) => {
      setSelectedSVGPath(shapeName);
    },
    [setSelectedSVGPath]
  );
  const updateSelectedSeatsSvgPath = useCallback(
    (elementIds, path) => {
      console.log("Running updateSelectedSeatsSvgPath with path:", path);
      console.log("Element IDs:", elementIds);

      if (!elementIds || elementIds.length === 0) {
        console.warn("No elements selected");
        return;
      }

      if (!path) {
        console.warn("No SVG path provided");
        return;
      }

      // Filter for chair elements
      const chairIds = elementIds.filter((id) => {
        const el = elements.find((e) => e.id === id);
        return el && el.type === ELEMENT_TYPES.CHAIR;
      });


      if (chairIds.length === 0) {
        console.warn("No chairs found in selection");
        return;
      }

      // Create a batch of updates
      const updates = [];

      // Prepare updates for each chair
      chairIds.forEach((id) => {
        console.log(`Preparing update for chair ID: ${id}`);
        updates.push({
          id: id,
          props: { svgPath: path },
        });
      });

      console.log(`Prepared ${updates.length} updates`);

      // Apply all updates at once using batch update
      setElements((prevElements) =>
        prevElements.map((element) => {
          // Find if this element has an update
          const update = updates.find((u) => u.id === element.id);
          if (update) {
            console.log(`Updating element ${element.id} with new svgPath`);
            return { ...element, ...update.props };
          }
          return element;
        })
      );
      setTimeout(saveState, 0);
    },
    [elements, saveState]
  );

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
    clipboard,
    isPasting,
    selectedSVGPath,

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
    saveState,
    prepareDataForExport,
    copySelectedElements,
    cutSelectedElements,
    pasteElements,
    handleSelectedSVGPath,
    updateSelectedSeatsSvgPath,
    updateElementColor,
    setSelectedElementIds,

    // Clear All (specific action)
    clearAll: useCallback(() => {
      setElements([]);
      setSections([]);
      setSelectedElementIds([]);
      setSelectedSectionId(null);
      setHistory([INITIAL_HISTORY_STATE]);
      setFuture([]);
    }, []),
  };
};
