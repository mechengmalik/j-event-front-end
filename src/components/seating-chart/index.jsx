import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Text,
  Group,
  Transformer,
  Line,
  Path,
  RegularPolygon, // Added
  Ring, // Added
  Wedge, // Added
  Arc, // Added
} from "react-konva";
import selectIcon from "../../assets/icons/select-tool.svg";
import handIcon from "../../assets/icons/hand-free.svg";
import undoIcon from "../../assets/icons/undo.svg";
import redoIcon from "../../assets/icons/redo.svg";

// --- Constants ---
const STAGE_WIDTH = 1800; // Example large stage size
const STAGE_HEIGHT = 1800;
const MIN_SCALE = 0.1; // Allow zooming out further
const MAX_SCALE = 4.0; // Allow zooming in further
const GRID_SIZE = 50;

// Default settings
const DEFAULT_ROW_SPACING = 60;
const DEFAULT_COL_SPACING = 60;
const DEFAULT_CHAIR_SIZE = { width: 30, height: 25 };

// Default Shape Sizes
const DEFAULT_RECT_SIZE = { width: 100, height: 60 };
const DEFAULT_CIRCLE_RADIUS = 50;
const DEFAULT_POLYGON_RADIUS = 60;
const DEFAULT_STAR_RADIUS = 70;
const DEFAULT_RING_INNER_RADIUS = 30;
const DEFAULT_RING_OUTER_RADIUS = 60;
const DEFAULT_WEDGE_RADIUS = 60;
const DEFAULT_WEDGE_ANGLE = 90;
const DEFAULT_ARC_INNER_RADIUS = 40;
const DEFAULT_ARC_OUTER_RADIUS = 70;
const DEFAULT_ARC_ANGLE = 120;

const MIN_SIZE = 10; // Minimum dimension/radius for elements

const SHAPES = {
  RECT: "rect",
  CIRCLE: "circle",
  ARC: "arc",
  POLYGON: "polygon",
  STAR: "star",
  RING: "ring",
  WEDGE: "wedge",
};

// Element Types Enum (NEW)
const ELEMENT_TYPES = {
  SEAT: "seat", // Represents a Section/Group of chairs
  TABLE: "table",
  STAGE: "stage",
  FLOOR: "floor", // Line with text label
  ENTRANCE: "entrance", // Path icon
  EXIT: "exit", // Path icon
  // Internal types (might not be directly selectable from palette)
  CHAIR: "chair",
  SECTION_BOUNDARY: "section-boundary",
};

// Tool Types Enum (NEW/MODIFIED)
const TOOLS = {
  SELECT: "select",
  HAND: "hand",
  DRAW_SECTION: "draw-section",
  PLACE_TABLE: `place-${ELEMENT_TYPES.TABLE}`,
  PLACE_STAGE: `place-${ELEMENT_TYPES.STAGE}`,
  PLACE_FLOOR: `place-${ELEMENT_TYPES.FLOOR}`,
  PLACE_ENTRANCE: `place-${ELEMENT_TYPES.ENTRANCE}`,
  PLACE_EXIT: `place-${ELEMENT_TYPES.EXIT}`,
};

// SVG Path Data (NEW)
const PATH_DATA = {
  [ELEMENT_TYPES.EXIT]:
    "M39 47.8H9V31.1333C9 29.1635 9.38799 27.2129 10.1418 25.393C10.8956 23.5732 12.0005 21.9196 13.3934 20.5267C14.7863 19.1338 16.4399 18.0289 18.2597 17.2751C20.0796 16.5213 22.0302 16.1333 24 16.1333C25.9698 16.1333 27.9204 16.5213 29.7403 17.2751C31.5601 18.0289 33.2137 19.1338 34.6066 20.5267C35.9995 21.9196 37.1044 23.5732 37.8582 25.393C38.612 27.2129 39 29.1635 39 31.1333V47.8Z",
  [ELEMENT_TYPES.ENTRANCE]:
    "M26.2337 26.4167C24.6837 26.4167 23.417 25.1333 23.417 23.5833C23.417 22.8363 23.7137 22.1199 24.242 21.5917C24.7702 21.0634 25.4866 20.7667 26.2337 20.7667C27.8003 20.7667 29.067 22.0333 29.067 23.5833C29.067 25.1333 27.8003 26.4167 26.2337 26.4167ZM21.167 46.0167L11.2837 44.05L11.8503 41.2167L18.767 42.6333L21.017 31.2L18.4837 32.2V36.9667H15.667V30.3667L23.0003 27.25L24.117 27.1167C25.117 27.1167 25.9503 27.6833 26.5003 28.5333L27.9337 30.7833C29.067 32.8 31.317 34.1667 34.0003 34.1667V36.9667C30.9003 36.9667 28.067 35.5833 26.2337 33.4667L25.4003 37.7L28.3503 40.5167V51.1333H25.5337V42.6333L22.567 39.8167L21.167 46.0167ZM39.0003 51.1333H35.667V17.8H14.0003V39.65L10.667 38.95V14.4667H39.0003V51.1333ZM14.0003 51.1333H10.667V45.7667L14.0003 46.4667V51.1333Z",
};

// Default Configs (NEW)
const DEFAULT_CONFIGS = {
  [ELEMENT_TYPES.SEAT]: {
    rows: 1,
    cols: 1,
    rowSpacing: 60,
    colSpacing: 50,
    curve: 0,
  },
  [ELEMENT_TYPES.TABLE]: {
    shape: SHAPES.RECT,
    width: 120,
    height: 70,
    fill: "#a0aec0",
    cornerRadius: 8,
    stroke: "#4A5568",
    strokeWidth: 1,
  },
  [ELEMENT_TYPES.STAGE]: {
    shape: SHAPES.RECT,
    width: 250,
    height: 120,
    fill: "#e2e8f0",
    cornerRadius: 4,
    stroke: "#4A5568",
    strokeWidth: 1,
  },
  [ELEMENT_TYPES.FLOOR]: {
    text: "Floor",
    length: 200,
    strokeWidth: 2,
    color: "#4a5568",
  },
  [ELEMENT_TYPES.ENTRANCE]: {
    fill: "#38a169",
    stroke: "#2F6C4F",
    strokeWidth: 0.5,
  },
  [ELEMENT_TYPES.EXIT]: {
    fill: "#e53e3e",
    stroke: "#9B2C2C",
    strokeWidth: 0.5,
  },
};

// --- Main Component ---
const SeatingMapBuilder = () => {
  const [elements, setElements] = useState([]);
  const [sections, setSections] = useState([]); // Still need this to store section *data* separate from elements array
  const [selectedTool, setSelectedTool] = useState(TOOLS.SELECT); // Active tool
  const [currentConfig, setCurrentConfig] = useState(null); // Holds config for the active placement tool
  const [selectedElementIds, setSelectedElementIds] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [history, setHistory] = useState([{ elements: [], sections: [] }]);
  const [future, setFuture] = useState([]);
  const [textEdit, setTextEdit] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
    id: null,
    node: null,
  }); // For Floor text editing
  // --- State ---
  const [isDrawingSection, setIsDrawingSection] = useState(false);
  const [drawStartPos, setDrawStartPos] = useState(null);
  const [currentRect, setCurrentRect] = useState(null); // For drawing section preview
  const [tempPreviewText, setTempPreviewText] = useState(null); // For drawing section preview text

  // --- Refs ---
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const shapeRefs = useRef({}); // Store refs to Konva Groups for transformer attachment
  const isMouseDownRef = useRef(false); // Track if mouse button is down
  const isDraggingRef = useRef(false); // Track if a drag operation is in progress
  const textEditRef = useRef(null); //

  // --- Helper Functions ---

  /**
   * Calculates the positions and rotations of chairs within a given section.
   * (Assuming this logic is correct as per the original code)
   */

  const calculateChairPositions = useCallback((section) => {
    const chairs = [];
    const {
      id: sectionId,
      x: sectionX,
      y: sectionY,
      rows,
      cols,
      rowSpacing = DEFAULT_ROW_SPACING,
      colSpacing = DEFAULT_COL_SPACING,
      curve = 0,
      rotation = 0,
      width: sectionWidth,
      height: sectionHeight,
    } = section;
    const contentWidth = Math.max(
      DEFAULT_CHAIR_SIZE.width,
      (cols - 1) * colSpacing
    );
    const sectionAngleRad = (rotation * Math.PI) / 180;
    const offsetX = Math.max(
      0,
      (sectionWidth - contentWidth - DEFAULT_CHAIR_SIZE.width) / 2
    );
    const offsetY = Math.max(
      0,
      (sectionHeight - ((rows - 1) * rowSpacing + DEFAULT_CHAIR_SIZE.height)) /
        2
    );

    for (let r = 0; r < rows; r++) {
      const naturalRowY = r * rowSpacing;
      for (let c = 0; c < cols; c++) {
        const chairId = `chair-${sectionId}-${r}-${c}`;
        let relativeX = 0,
          relativeY = 0,
          chairRotation = 0;
        const defaultRelativeX = c * colSpacing;
        const defaultRelativeY = naturalRowY;

        if (curve !== 0 && cols > 1) {
          const effectiveCurve = curve / 100;
          if (effectiveCurve > 0) {
            // --- Start: Restored Curve Logic from initial code ---
            const maxAngle = Math.PI * 0.8 * effectiveCurve;
            const chordLength = contentWidth;
            const angle = maxAngle;
            const radius =
              angle > 0.01 ? chordLength / 2 / Math.sin(angle / 2) : Infinity;

            if (isFinite(radius) && radius > 0) {
              const arcCenterX = contentWidth / 2;
              const arcCenterOffsetY = Math.sqrt(
                Math.max(0, radius * radius - (chordLength / 2) ** 2)
              );
              const arcCenterY = naturalRowY + arcCenterOffsetY;
              // Previous Y shift calculation (slightly different from the other reverted logic, choose one)
              // const centerArcVerticalPos = arcCenterY - radius;
              // const yShift = Math.max(0, naturalRowY - centerArcVerticalPos);

              const anglePerChair = cols > 1 ? angle / (cols - 1) : 0;
              const startAngle = -angle / 2;
              const currentAngle = startAngle + c * anglePerChair;

              relativeX = arcCenterX + radius * Math.sin(currentAngle);
              // Original Y calculation
              const initialRelativeY =
                arcCenterY - radius * Math.cos(currentAngle);
              // relativeY = initialRelativeY + yShift; // Apply Y shift if using that version
              // Use Y correction to align start of row (as in previous full code)
              const yCorrection =
                naturalRowY - (arcCenterY - radius * Math.cos(startAngle));
              relativeY = initialRelativeY + yCorrection;

              chairRotation = (currentAngle * 180) / Math.PI;
            } else {
              relativeX = defaultRelativeX;
              relativeY = defaultRelativeY;
              chairRotation = 0;
            }
            // --- End: Restored Curve Logic ---
          } else {
            relativeX = defaultRelativeX;
            relativeY = defaultRelativeY;
            chairRotation = 0;
          }
        } else {
          relativeX = defaultRelativeX;
          relativeY = defaultRelativeY;
          chairRotation = 0;
        }

        const offsetXedRelativeX = relativeX + offsetX;
        const offsetXedRelativeY = relativeY + offsetY;
        const rotatedX =
          offsetXedRelativeX * Math.cos(sectionAngleRad) -
          offsetXedRelativeY * Math.sin(sectionAngleRad);
        const rotatedY =
          offsetXedRelativeX * Math.sin(sectionAngleRad) +
          offsetXedRelativeY * Math.cos(sectionAngleRad);
        const finalX = sectionX + rotatedX;
        const finalY = sectionY + rotatedY;
        const finalRotation = rotation + chairRotation;

        chairs.push({
          id: chairId,
          type: ELEMENT_TYPES.CHAIR,
          x: finalX,
          y: finalY,
          rotation: finalRotation,
          width: DEFAULT_CHAIR_SIZE.width,
          height: DEFAULT_CHAIR_SIZE.height,
          sectionId: sectionId,
          fill: "#4a5568",
        });
      }
    }
    return chairs;
  }, []); // Keep dependencies minimal

  const handleSelectTool = useCallback((toolType) => {
    setSelectedTool(toolType);
    setSelectedElementIds([]);
    setSelectedSectionId(null);
    transformerRef.current?.nodes([]);
    setIsDrawingSection(false); // Turn off drawing mode

    // Set default config only for PLACE tools
    if (toolType.startsWith("place-")) {
      const elementType = toolType.replace("place-", "");
      const defaultConfig = DEFAULT_CONFIGS[elementType]
        ? JSON.parse(JSON.stringify(DEFAULT_CONFIGS[elementType]))
        : {};
      // Add shape/size/fill defaults if missing (as before)
      if (
        (elementType === ELEMENT_TYPES.TABLE ||
          elementType === ELEMENT_TYPES.STAGE) &&
        !defaultConfig.shape
      ) {
        defaultConfig.shape = SHAPES.RECT;
        defaultConfig.width = DEFAULT_RECT_SIZE.width;
        defaultConfig.height = DEFAULT_RECT_SIZE.height;
      }
      if (
        (elementType === ELEMENT_TYPES.TABLE ||
          elementType === ELEMENT_TYPES.STAGE) &&
        !defaultConfig.fill
      ) {
        defaultConfig.fill = DEFAULT_CONFIGS[elementType]?.fill || "#cccccc";
      }
      setCurrentConfig(defaultConfig);
    } else {
      setCurrentConfig(null); // Clear config for non-placement tools (like DRAW_SECTION)
    }
  }, []);

  const saveState = useCallback(() => {
    // Deep copy to avoid state mutation issues in history
    const currentState = {
      elements: JSON.parse(JSON.stringify(elements)),
      sections: JSON.parse(JSON.stringify(sections)),
    };
    const lastHistory = history[history.length - 1];
    // Avoid saving duplicate states
    if (JSON.stringify(lastHistory) !== JSON.stringify(currentState)) {
      setHistory((prev) => [...prev, currentState]);
      setFuture([]); // Clear redo stack on new action
    }
  }, [elements, sections, history]);

  const handleConfigChange = useCallback((updates) => {
    setCurrentConfig((prevConfig) => ({ ...prevConfig, ...updates }));
    // No need to saveState here, only save when element is placed
  }, []);

  const calculateSectionDimensions = useCallback((sectionData) => {
    const {
      rows = 1,
      cols = 1,
      rowSpacing = DEFAULT_ROW_SPACING,
      colSpacing = DEFAULT_COL_SPACING,
    } = sectionData;
    const calculatedWidth =
      cols <= 0
        ? 0
        : cols === 1
        ? DEFAULT_CHAIR_SIZE.width
        : (cols - 1) * colSpacing + DEFAULT_CHAIR_SIZE.width;
    const calculatedHeight =
      rows <= 0
        ? 0
        : rows === 1
        ? DEFAULT_CHAIR_SIZE.height
        : (rows - 1) * rowSpacing + DEFAULT_CHAIR_SIZE.height;
    const PADDING = 10;
    const MIN_DIMENSION = 30;
    return {
      width: Math.max(MIN_DIMENSION, calculatedWidth + PADDING * 2),
      height: Math.max(MIN_DIMENSION, calculatedHeight + PADDING * 2),
    };
  }, []);

  const placeElement = useCallback(
    (x, y) => {
      if (!selectedTool.startsWith("place-") || !currentConfig) {
        console.error("placeElement guard condition failed or config is null.");
        return;
      }
      const elementType = selectedTool.replace("place-", "");
      const elementId = `${elementType}-${Date.now()}`;
      let newElement = null; // Initialize as null

      console.log(`Placing ${elementType} with config:`, currentConfig); // Added log

      switch (elementType) {
        // SEAT case is removed - handled by drawing flow

        case ELEMENT_TYPES.TABLE:
        case ELEMENT_TYPES.STAGE: {
          const shape = currentConfig.shape || SHAPES.RECT; // Default to rect if not specified
          let sizeProps = {};
          // Determine default size based on shape if not provided in config
          switch (shape) {
            case SHAPES.RECT:
              sizeProps = {
                width: currentConfig.width || DEFAULT_RECT_SIZE.width,
                height: currentConfig.height || DEFAULT_RECT_SIZE.height,
              };
              break;
            case SHAPES.CIRCLE:
              sizeProps = {
                radius: currentConfig.radius || DEFAULT_CIRCLE_RADIUS,
              };
              break;
            case SHAPES.POLYGON:
              sizeProps = {
                radius: currentConfig.radius || DEFAULT_POLYGON_RADIUS,
                sides: currentConfig.sides || 6,
              };
              break; // Add sides default
            case SHAPES.STAR:
              sizeProps = {
                radius: currentConfig.radius || DEFAULT_STAR_RADIUS,
                numPoints: currentConfig.numPoints || 5,
                innerRadius:
                  currentConfig.innerRadius || DEFAULT_STAR_RADIUS / 2.5,
              };
              break; // Add points/innerRadius defaults
            case SHAPES.RING:
              sizeProps = {
                outerRadius:
                  currentConfig.outerRadius || DEFAULT_RING_OUTER_RADIUS,
                innerRadius:
                  currentConfig.innerRadius || DEFAULT_RING_INNER_RADIUS,
              };
              break;
            case SHAPES.WEDGE:
              sizeProps = {
                radius: currentConfig.radius || DEFAULT_WEDGE_RADIUS,
                angle: currentConfig.angle || DEFAULT_WEDGE_ANGLE,
              };
              break; // Add angle default
            case SHAPES.ARC:
              sizeProps = {
                outerRadius:
                  currentConfig.outerRadius || DEFAULT_ARC_OUTER_RADIUS,
                innerRadius:
                  currentConfig.innerRadius || DEFAULT_ARC_INNER_RADIUS,
                angle: currentConfig.angle || DEFAULT_ARC_ANGLE,
              };
              break; // Add angle default
            default:
              sizeProps = {
                width: DEFAULT_RECT_SIZE.width,
                height: DEFAULT_RECT_SIZE.height,
              }; // Fallback
          }
          // Create the element object
          newElement = {
            id: elementId,
            type: elementType,
            x,
            y,
            rotation: 0,
            ...currentConfig, // Include potentially overridden fill, stroke, etc.
            shape: shape, // Ensure shape is explicitly set
            ...sizeProps, // Add calculated size props
            // Ensure mandatory props have fallbacks if not in currentConfig or defaults
            fill:
              currentConfig.fill ||
              DEFAULT_CONFIGS[elementType]?.fill ||
              "#cccccc",
            stroke:
              currentConfig.stroke || DEFAULT_CONFIGS[elementType]?.stroke,
            strokeWidth:
              currentConfig.strokeWidth ??
              DEFAULT_CONFIGS[elementType]?.strokeWidth,
          };
          break; // Exit switch case
        }
        case ELEMENT_TYPES.FLOOR: {
          const length = currentConfig.length || 200;
          const strokeWidth = currentConfig.strokeWidth || 2;
          const color = currentConfig.color || "#4a5568";
          const text = currentConfig.text || "Floor";
          const fontSize = 14;
          const textPadding = 5;
          const textHeight = 24;
          // Create the element object
          newElement = {
            id: elementId,
            type: ELEMENT_TYPES.FLOOR,
            x,
            y,
            startX: -length / 2,
            startY: 0,
            endX: length / 2,
            endY: 0,
            length: length,
            text: text,
            stroke: color,
            strokeWidth: strokeWidth,
            rotation: 0,
            fontSize: fontSize,
            textFill: "#ffffff",
            textBgFill: color,
            textPadding: textPadding,
            textHeight: textHeight,
          };
          break; // Exit switch case
        }
        case ELEMENT_TYPES.ENTRANCE:
        case ELEMENT_TYPES.EXIT: {
          // Create the element object WITH fill, NO stroke
          newElement = {
            id: elementId,
            type: elementType,
            x,
            y,
            rotation: 0,
            pathData: PATH_DATA[elementType],
            fill: "black", // <-- Set default fill to black (or #2D3748 etc.)
            // stroke: undefined, // Ensure no stroke properties are stored
            // strokeWidth: undefined,
            scaleX: 1,
            scaleY: 1,
          };
          console.log("Creating Entrance/Exit (Filled Black):", newElement);
          break;
        }
        default:
          console.error("placeElement: Unknown element type:", elementType);
          return; // Exit function if type is unknown
      }

      // --- This block now executes correctly if newElement was created ---
      if (newElement) {
        console.log("Adding new element:", newElement);
        setElements((prev) => [...prev, newElement]);
        saveState();
        setSelectedTool(TOOLS.SELECT);
        setCurrentConfig(null);
      } else {
        // Log if something went wrong and newElement wasn't created
        console.error(
          `placeElement: Failed to create newElement object for type ${elementType}`
        );
        // Reset tool even on failure to avoid getting stuck
        setSelectedTool(TOOLS.SELECT);
        setCurrentConfig(null);
      }
    },
    [selectedTool, currentConfig, saveState] // Dependencies
  );

  // --- History Management ---

  const undo = useCallback(() => {
    if (history.length <= 1) return; // Can't undo initial state

    const currentState = history[history.length - 1];
    setFuture((f) => [currentState, ...f]); // Add current state to redo stack

    const previousState = history[history.length - 2];
    setElements(previousState.elements);
    setSections(previousState.sections);
    setHistory((h) => h.slice(0, h.length - 1)); // Remove current state from history

    // Clear selection after undo/redo
    setSelectedElementIds([]);
    setSelectedSectionId(null);
    transformerRef.current?.nodes([]);
  }, [history]);

  const redo = useCallback(() => {
    if (future.length === 0) return; // Nothing to redo

    const nextState = future[0];
    setHistory((h) => [...h, nextState]); // Add redo state back to history
    setFuture((f) => f.slice(1)); // Remove from redo stack

    setElements(nextState.elements);
    setSections(nextState.sections);

    // Clear selection after undo/redo
    setSelectedElementIds([]);
    setSelectedSectionId(null);
    transformerRef.current?.nodes([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [future, history]);

  // --- Element/Section Creation/Deletion ---

  const deleteSectionById = useCallback(
    // Renamed from deleteSection
    (sectionId) => {
      if (!sectionId) return;
      const boundaryId = `boundary-${sectionId}`;
      const wasSelected =
        selectedSectionId === sectionId ||
        selectedElementIds.includes(boundaryId);

      setSections((prev) => prev.filter((sec) => sec.id !== sectionId));
      setElements((prev) =>
        prev.filter((el) => el.sectionId !== sectionId && el.id !== boundaryId)
      );

      if (wasSelected) {
        setSelectedSectionId(null);
        setSelectedElementIds([]);
        transformerRef.current?.nodes([]);
      }
      saveState();
    },
    [saveState, selectedElementIds, selectedSectionId] // dependencies
  );

  const deleteSelected = useCallback(() => {
    // Renamed from deleteSelectedElements
    // If a section is selected (via its boundary), delete the section data + elements
    if (selectedSectionId) {
      deleteSectionById(selectedSectionId);
      return;
    }
    // Otherwise, delete selected individual elements (non-boundary, non-chair)
    const elementsToDelete = elements.filter(
      (el) =>
        selectedElementIds.includes(el.id) &&
        el.type !== ELEMENT_TYPES.SECTION_BOUNDARY &&
        !el.sectionId
    );
    if (elementsToDelete.length > 0) {
      setElements((prev) =>
        prev.filter((el) => !elementsToDelete.find((del) => del.id === el.id))
      );
      setSelectedElementIds([]);
      transformerRef.current?.nodes([]);
      saveState();
    }
  }, [
    elements,
    selectedElementIds,
    selectedSectionId,
    saveState,
    deleteSectionById,
  ]);

  // --- Section Modification ---

  const updateSectionProperties = useCallback(
    (sectionId, updates) => {
      let updatedSectionData;
      let calculatedDimensions = null;
      const boundaryId = `boundary-${sectionId}`; // ID of the boundary element

      const affectsDimensions =
        Object.hasOwn(updates, "rows") ||
        Object.hasOwn(updates, "cols") ||
        Object.hasOwn(updates, "rowSpacing") ||
        Object.hasOwn(updates, "colSpacing");
      const newSections = sections.map((sec) => {
        if (sec.id === sectionId) {
          // ... calculation logic same ...
          const potentialUpdate = { ...sec, ...updates };
          if (affectsDimensions) {
            calculatedDimensions = calculateSectionDimensions(potentialUpdate);
            updatedSectionData = {
              ...potentialUpdate,
              ...calculatedDimensions,
            };
          } else {
            updatedSectionData = potentialUpdate;
          }
          return updatedSectionData;
        }
        return sec;
      });

      if (!updatedSectionData) return;

      let newElements = elements.filter(
        (el) => el.sectionId !== sectionId && el.id !== boundaryId // Filter using boundaryId
      );
      const updatedChairs = calculateChairPositions(updatedSectionData);
      const updatedBoundary = {
        // Update the boundary element
        id: boundaryId, // Use boundaryId
        type: ELEMENT_TYPES.SECTION_BOUNDARY,
        x: updatedSectionData.x,
        y: updatedSectionData.y,
        width: updatedSectionData.width,
        height: updatedSectionData.height,
        rotation: updatedSectionData.rotation || 0,
        sectionId: sectionId, // Link back to data
      };
      newElements = [...newElements, updatedBoundary, ...updatedChairs];

      setSections(newSections);
      setElements(newElements);

      // Update transformer if boundary selected
      if (selectedElementIds.includes(boundaryId) && transformerRef.current) {
        const boundaryNode = shapeRefs.current[boundaryId];
        if (boundaryNode) {
          boundaryNode.width(updatedBoundary.width);
          boundaryNode.height(updatedBoundary.height);
          boundaryNode.x(updatedBoundary.x);
          boundaryNode.y(updatedBoundary.y);
          boundaryNode.rotation(updatedBoundary.rotation);
          transformerRef.current.nodes([boundaryNode]);
          transformerRef.current.forceUpdate();
          transformerRef.current.getLayer()?.batchDraw();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      elements,
      sections,
      calculateChairPositions,
      calculateSectionDimensions,
      selectedElementIds,
      saveState,
    ] // Added saveState if not called onBlur
  );

  // --- Element Property Modification ---
  const updateElementProperties = useCallback(
    (elementId, updates) => {
      setElements((prevElements) =>
        prevElements.map((el) => {
          if (el.id === elementId) {
            const newProps = { ...el, ...updates };
            // --- Validation ---
            if (newProps.shape === SHAPES.RECT) {
              if (Object.hasOwn(newProps, "width"))
                newProps.width = Math.max(MIN_SIZE, newProps.width);
              if (Object.hasOwn(newProps, "height"))
                newProps.height = Math.max(MIN_SIZE, newProps.height);
            } else if (
              [
                SHAPES.CIRCLE,
                SHAPES.WEDGE,
                SHAPES.POLYGON,
                SHAPES.STAR,
              ].includes(newProps.shape)
            ) {
              if (Object.hasOwn(newProps, "radius")) {
                newProps.radius = Math.max(MIN_SIZE, newProps.radius);
                // Adjust inner radius proportionally if outer radius changes for star
                if (
                  newProps.shape === SHAPES.STAR &&
                  Object.hasOwn(updates, "radius") &&
                  el.radius > 0
                ) {
                  const outerR = newProps.radius;
                  const innerRRatio = el.innerRadius / el.radius || 0.4;
                  newProps.innerRadius = Math.max(
                    MIN_SIZE / 2,
                    outerR * innerRRatio
                  );
                  // Ensure inner is smaller
                  newProps.innerRadius = Math.min(
                    newProps.innerRadius,
                    newProps.radius * 0.95
                  );
                }
              }
              // Adjust inner radius if it's changed directly for star
              if (
                newProps.shape === SHAPES.STAR &&
                Object.hasOwn(updates, "innerRadius")
              ) {
                newProps.innerRadius = Math.max(
                  MIN_SIZE / 2,
                  newProps.innerRadius
                );
                // Ensure inner is smaller than outer
                newProps.innerRadius = Math.min(
                  newProps.innerRadius,
                  newProps.radius * 0.95
                );
              }
            } else if ([SHAPES.RING, SHAPES.ARC].includes(newProps.shape)) {
              // Outer Radius changed
              if (Object.hasOwn(newProps, "outerRadius")) {
                newProps.outerRadius = Math.max(MIN_SIZE, newProps.outerRadius);
                // Ensure inner is smaller
                newProps.innerRadius = Math.min(
                  newProps.innerRadius,
                  Math.max(MIN_SIZE / 2, newProps.outerRadius * 0.95)
                );
              }
              // Inner Radius changed
              if (Object.hasOwn(newProps, "innerRadius")) {
                newProps.innerRadius = Math.max(
                  MIN_SIZE / 2,
                  newProps.innerRadius
                );
                // Ensure outer is larger
                newProps.outerRadius = Math.max(
                  newProps.outerRadius,
                  Math.max(MIN_SIZE, newProps.innerRadius * 1.05)
                );
              }
            }
            // Other constraints
            if (Object.hasOwn(newProps, "angle"))
              newProps.angle = Math.max(1, Math.min(360, newProps.angle));
            if (Object.hasOwn(newProps, "sides"))
              newProps.sides = Math.max(3, newProps.sides);
            if (Object.hasOwn(newProps, "numPoints"))
              newProps.numPoints = Math.max(3, newProps.numPoints);

            return newProps;
          }
          return el;
        })
      );

      // Note: This function only updates the state. Konva nodes might need manual updates
      // if the change needs immediate visual feedback without relying on selection/transform cycle.
      // For size/color changes triggered by inputs, the re-render based on state is usually sufficient.
    },
    [setElements]
  );

  // --- Event Handlers ---
  const handleMouseDown = useCallback(
    (e) => {
      isMouseDownRef.current = true;
      isDraggingRef.current = false;
      const stage = stageRef.current;
      if (!stage) return;
      const pos = stage.getRelativePointerPosition();
      if (!pos) return;
      const didClickOnStage = e.target === stage;

      if (didClickOnStage) {
        // --- ADDED: Start drawing section ---
        if (selectedTool === TOOLS.DRAW_SECTION) {
          setIsDrawingSection(true);
          setDrawStartPos(pos);
          setCurrentRect({
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            rows: 1,
            cols: 1,
          }); // Initial rect
          setTempPreviewText({ x: pos.x + 5, y: pos.y + 5, text: `R:1, C:1` });
          setSelectedElementIds([]);
          setSelectedSectionId(null);
          transformerRef.current?.nodes([]); // Deselect others
        }
        // --- End Added ---
        else if (selectedTool.startsWith("place-")) {
          placeElement(pos.x, pos.y);
        } else if (
          selectedTool === TOOLS.SELECT ||
          selectedTool === TOOLS.HAND
        ) {
          setSelectedElementIds([]);
          setSelectedSectionId(null);
          transformerRef.current?.nodes([]);
        }
      } else {
        // --- ADDED: Cancel drawing if clicking on existing element ---
        if (isDrawingSection) {
          setIsDrawingSection(false);
          setDrawStartPos(null);
          setCurrentRect(null);
          setTempPreviewText(null);
        }
        // --- End Added ---
        // Selection logic is in Group onClick
      }
    },
    [selectedTool, placeElement, isDrawingSection] // Added isDrawingSection
  );

  const handleMouseMove = useCallback(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      const pos = stage.getRelativePointerPosition();
      if (!pos) return;

      // --- ADDED: Update drawing preview ---
      if (isDrawingSection && drawStartPos) {
        isDraggingRef.current = true;
        const newWidth = Math.abs(pos.x - drawStartPos.x);
        const newHeight = Math.abs(pos.y - drawStartPos.y);
        const newX = Math.min(pos.x, drawStartPos.x);
        const newY = Math.min(pos.y, drawStartPos.y);
        const cols =
          newWidth > DEFAULT_COL_SPACING / 2
            ? Math.max(1, Math.floor(newWidth / DEFAULT_COL_SPACING) + 1)
            : 1;
        const rows =
          newHeight > DEFAULT_ROW_SPACING / 2
            ? Math.max(1, Math.floor(newHeight / DEFAULT_ROW_SPACING) + 1)
            : 1;
        setCurrentRect({
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
      }
      // --- End Added ---
      else if (
        isMouseDownRef.current &&
        selectedTool === TOOLS.SELECT &&
        selectedElementIds.length > 0 &&
        !transformerRef.current?.isTransforming()
      ) {
        // isDraggingRef.current = true; // Set in onDragStart
      }
    },
    [isDrawingSection, drawStartPos, selectedTool, selectedElementIds.length] // Added dependencies
  );

  const handleMouseUp = useCallback(
    () => {
      const wasDrawing = isDrawingSection; // Capture before reset
      isMouseDownRef.current = false;
      isDraggingRef.current = false;
      setIsDrawingSection(false); // Reset drawing flag

      // --- ADDED: Finalize Section Drawing ---
      if (
        wasDrawing &&
        currentRect &&
        currentRect.width > MIN_SIZE &&
        currentRect.height > MIN_SIZE
      ) {
        const sectionId = `section-${Date.now()}`;
        const newSectionData = {
          id: sectionId,
          x: currentRect.x,
          y: currentRect.y,
          rows: currentRect.rows || 1,
          cols: currentRect.cols || 1,
          rowSpacing: DEFAULT_ROW_SPACING,
          colSpacing: DEFAULT_COL_SPACING,
          curve: 0,
          rotation: 0, // Defaults for new section
          width: currentRect.width,
          height: currentRect.height,
        };
        const boundaryId = `boundary-${sectionId}`;
        const newBoundaryElement = {
          id: boundaryId,
          type: ELEMENT_TYPES.SECTION_BOUNDARY,
          sectionId: sectionId,
          x: newSectionData.x,
          y: newSectionData.y,
          width: newSectionData.width,
          height: newSectionData.height,
          rotation: 0,
        };
        const newChairElements = calculateChairPositions(newSectionData);

        setSections((prev) => [...prev, newSectionData]);
        setElements((prev) => [
          ...prev,
          newBoundaryElement,
          ...newChairElements,
        ]);
        saveState();
        setSelectedTool(TOOLS.SELECT); // Switch back to select
      }
      // --- End Added ---

      // Reset preview visuals
      setDrawStartPos(null);
      setCurrentRect(null);
      setTempPreviewText(null);
    },
    [currentRect, isDrawingSection, saveState, calculateChairPositions] // Added dependencies
  );

  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? -1 : 1; // -1 for zoom out, 1 for zoom in
    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
  }, []); // No dependencies needed

  const handleDragStart = useCallback(
    (e) => {
      isDraggingRef.current = true;
      const id = e.target.id();
      // If dragging a non-section element, lift it to top visually during drag
      if (
        selectedElementIds.includes(id) &&
        !elements.find((el) => el.id === id)?.sectionId
      ) {
        e.target.moveToTop();
        transformerRef.current?.moveToTop(); // Keep transformer on top of dragged element
      }
      // Dim element slightly on drag start (optional)
      // e.target.opacity(0.8);
    },
    [selectedElementIds, elements]
  ); // Depend on elements to find sectionId

  const handleDragEnd = useCallback(
    (e) => {
      isDraggingRef.current = false;
      const node = e.target;
      const newPos = node.position();
      const originalElement = elements.find((el) => el.id === node.id());

      if (
        !originalElement ||
        (newPos.x === originalElement.x && newPos.y === originalElement.y)
      )
        return;

      // --- Update Section Position ---
      if (
        originalElement.type === ELEMENT_TYPES.SECTION_BOUNDARY &&
        originalElement.sectionId
      ) {
        const sectionId = originalElement.sectionId;
        const deltaX = newPos.x - originalElement.x;
        const deltaY = newPos.y - originalElement.y;
        // Update Section Data
        setSections((prevSections) =>
          prevSections.map((sec) =>
            sec.id === sectionId ? { ...sec, x: newPos.x, y: newPos.y } : sec
          )
        );
        // Update Elements (Boundary + Chairs)
        setElements((prevElements) =>
          prevElements.map((el) => {
            if (el.id === node.id()) return { ...el, x: newPos.x, y: newPos.y }; // Boundary
            if (el.sectionId === sectionId)
              return { ...el, x: el.x + deltaX, y: el.y + deltaY }; // Chairs
            return el;
          })
        );
        saveState();
      }
      // --- Update Individual Element Position (Table, Stage, Floor, Path) ---
      else if (!originalElement.sectionId) {
        setElements((prevElements) =>
          prevElements.map((el) =>
            el.id === node.id() ? { ...el, x: newPos.x, y: newPos.y } : el
          )
        );
        saveState();
      }
    },
    [elements, saveState] // dependencies
  );

  const handleTransformEnd = useCallback(
    () => {
      const transformer = transformerRef.current;
      if (!transformer) return;
      const transformedNodes = transformer.nodes();
      if (transformedNodes.length === 0) return;

      let currentElements = [...elements];
      let currentSections = [...sections];
      let changesMade = false;

      transformedNodes.forEach((konvaNode) => {
        const elementId = konvaNode.id(); // Group ID
        const elementIndex = currentElements.findIndex(
          (el) => el.id === elementId
        );
        if (elementIndex === -1) return;

        const originalElement = currentElements[elementIndex];

        const scaleX = konvaNode.scaleX();
        const scaleY = konvaNode.scaleY();
        const rotation = konvaNode.rotation();
        const x = konvaNode.x();
        const y = konvaNode.y();

        konvaNode.scaleX(1);
        konvaNode.scaleY(1); // Reset node scale

        let updatedProps = { x, y, rotation };

        // --- Apply Scale based on Element Type/Shape ---
        if (
          originalElement.type === ELEMENT_TYPES.TABLE ||
          originalElement.type === ELEMENT_TYPES.STAGE
        ) {
          // ... (Existing shape scaling logic based on originalElement.shape) ...
          // eslint-disable-next-line no-empty
          switch (
            originalElement.shape /* ... scale radius, width/height etc. ... */
          ) {
          }
        } else if (
          originalElement.type === ELEMENT_TYPES.ENTRANCE ||
          originalElement.type === ELEMENT_TYPES.EXIT
        ) {
          // For Paths, store the scale factor
          updatedProps.scaleX = scaleX;
          updatedProps.scaleY = scaleY;
        } else if (originalElement.type === ELEMENT_TYPES.FLOOR) {
          // Scale the line length (relative points) based on average scale?
          const avgScale = (scaleX + scaleY) / 2;
          updatedProps.startX = (originalElement.startX || 0) * avgScale;
          updatedProps.endX = (originalElement.endX || 0) * avgScale;
          // Maybe scale text height/padding? For now, keep fixed.
        }
        // Section Boundary Transform
        else if (
          originalElement.type === ELEMENT_TYPES.SECTION_BOUNDARY &&
          originalElement.sectionId
        ) {
          const sectionId = originalElement.sectionId;
          const sectionIndex = currentSections.findIndex(
            (sec) => sec.id === sectionId
          );
          if (sectionIndex === -1) return;
          const oldSection = currentSections[sectionIndex];
          const newWidth = Math.max(MIN_SIZE, originalElement.width * scaleX);
          const newHeight = Math.max(MIN_SIZE, originalElement.height * scaleY);
          const updatedSectionData = {
            ...oldSection,
            x,
            y,
            width: newWidth,
            height: newHeight,
            rotation,
          };
          currentSections[sectionIndex] = updatedSectionData; // Update section metadata

          currentElements = currentElements.filter(
            (el) => el.sectionId !== sectionId && el.id !== elementId
          ); // Filter old boundary/chairs
          const updatedChairs = calculateChairPositions(updatedSectionData);
          const updatedBoundary = {
            ...originalElement,
            x,
            y,
            width: newWidth,
            height: newHeight,
            rotation,
          }; // Update boundary element data
          currentElements = [
            ...currentElements,
            updatedBoundary,
            ...updatedChairs,
          ];
          changesMade = true; // Mark changes for section
        }

        // Apply updates to the element in the temporary array if not a section boundary
        if (originalElement.type !== ELEMENT_TYPES.SECTION_BOUNDARY) {
          currentElements[elementIndex] = {
            ...originalElement,
            ...updatedProps,
          };
          changesMade = true;
        }
      }); // End forEach node

      if (changesMade) {
        setElements(currentElements);
        if (JSON.stringify(currentSections) !== JSON.stringify(sections))
          setSections(currentSections);
        saveState();
      }

      // Re-attach transformer
      setTimeout(() => {
        /* ... (keep existing timeout logic) ... */
      }, 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elements, sections, calculateChairPositions, saveState, selectedElementIds] // dependencies
  );

  // --- Keyboard Handler ---
  const handleTextDblClick = useCallback(
    (e, element) => {
      const textNode = e.target; // The Konva.Text node that was double-clicked
      const stage = stageRef.current;
      if (!stage || !textNode || element.type !== ELEMENT_TYPES.FLOOR) return;

      // Hide the Konva Text node
      textNode.hide();
      // Also hide the transformer if it's attached to this element
      if (selectedElementIds.includes(element.id)) {
        transformerRef.current?.nodes([]); // Detach transformer temporarily
        transformerRef.current?.hide();
      }
      stage.container().style.cursor = "text"; // Change cursor to text input

      // Calculate the bounding box of the text node relative to the stage container
      const textRect = textNode.getClientRect({
        relativeTo: stage.container(),
      });

      // Set state for the textarea
      setTextEdit({
        visible: true,
        x: textRect.x, // Use clientRect x
        y: textRect.y, // Use clientRect y
        width: textRect.width, // Use clientRect width
        height: textRect.height, // Use clientRect height
        text: element.text,
        id: element.id,
        node: textNode, // Keep reference to the Konva node
        rotation: textNode.getAbsoluteRotation(), // Use absolute rotation
        // Keep other style properties needed for the textarea
        fontSize: element.fontSize || 14,
        padding: element.textPadding || 5,
        fill: element.textFill || "#ffffff", // For potential textarea styling
        fontFamily: textNode.fontFamily() || "sans-serif", // Get from Konva node if possible
        align: textNode.align() || "center", // Get from Konva node
      });
    },
    [selectedElementIds]
  ); // Added selectedElementIds dependency

  const handleTextEditChange = useCallback((e) => {
    setTextEdit((prev) => ({ ...prev, text: e.target.value }));
  }, []);

  const handleTextEditBlur = useCallback(() => {
    if (!textEdit.visible || !textEdit.id) return;
    // Update element state
    updateElementProperties(textEdit.id, { text: textEdit.text });
    saveState();
    // Hide textarea, show text node
    textEdit.node?.show();
    transformerRef.current?.show();
    setTextEdit({ visible: false, x: 0, y: 0, text: "", id: null, node: null });
  }, [textEdit, updateElementProperties, saveState]);

  // Handle Enter key in textarea to finish editing
  const handleTextEditKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        // Enter finishes edit
        e.preventDefault(); // Prevent newline
        handleTextEditBlur();
      }
      if (e.key === "Escape") {
        // Escape cancels edit
        e.preventDefault();
        textEdit.node?.show();
        transformerRef.current?.show();
        setTextEdit({
          visible: false,
          x: 0,
          y: 0,
          text: "",
          id: null,
          node: null,
        });
      }
    },
    [handleTextEditBlur, textEdit.node]
  );

  // Sync textarea position/size on stage move/zoom (more complex, skip for now)
  // useEffect(() => {
  //     if (textEdit.visible && textEdit.node) {
  //         // Recalculate position if stage moves/zooms
  //     }
  // }, [stageRef.current?.x(), stageRef.current?.y(), stageRef.current?.scaleX(), textEdit]);

  useEffect(() => {
    if (textEdit.visible && textEditRef.current) {
      textEditRef.current.style.transform = `rotate(${
        textEdit.rotation || 0
      }deg)`; // Apply rotation
      textEditRef.current.focus();
      textEditRef.current.select();
    }
  }, [textEdit.visible, textEdit.rotation]);

  // --- Keyboard Handler ---
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Existing undo/redo/tool shortcuts...
      const activeElement = document.activeElement;
      if (
        ["INPUT", "SELECT", "TEXTAREA"].includes(activeElement?.tagName) &&
        activeElement !== textEditRef.current
      ) {
        // Allow keydown in our textarea
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected(); // Use unified delete
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.shiftKey && e.key === "Z"))
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
          // Add shortcuts for palette items if desired
          // case 's': handleSelectTool(TOOLS.PLACE_SEAT); break;
          // case 't': handleSelectTool(TOOLS.PLACE_TABLE); break; etc.
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [deleteSelected, undo, redo, handleSelectTool]); // dependencies

  // --- Effect to update Transformer ---
  useEffect(() => {
    if (!transformerRef.current) return;
    const selectedNodes = selectedElementIds
      .map((id) => shapeRefs.current[id]) // Get Konva Group refs
      .filter(Boolean);
    transformerRef.current.nodes(selectedNodes);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedElementIds]); // Update only when selection changes

  // --- Rendering Components ---
  const PaletteItem = ({ tool, label, icon, currentTool, onSelect }) => (
    <button
      title={label}
      onClick={() => onSelect(tool)}
      className={`flex flex-col items-center justify-center p-2 rounded border text-xs w-16 h-16 ${
        // Fixed size
        currentTool === tool
          ? "bg-blue-100 border-blue-400 text-blue-800 ring-1 ring-blue-500" // Highlight active tool
          : "bg-gray-50 border-gray-300 hover:bg-gray-200"
      }`}
    >
      <div className="w-8 h-8 mb-1 flex items-center justify-center">
        {icon}
      </div>
      {label}
    </button>
  );

  const icons = {
    [TOOLS.PLACE_SEAT]: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 18v3h3v-3h10v3h3v-6H4zm15-8h3v3h-3v-3zM2 10h3v3H2v-3zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z"></path>
      </svg>
    ), // Material chair icon
    [TOOLS.PLACE_TABLE]: (
      <svg viewBox="0 0 40 40" fill="currentColor" className="w-6 h-6">
        <path d="M36.6663 12.9001C36.6663 9.68341 29.1997 7.06674 19.9997 7.06674C10.7997 7.06674 3.33301 9.68341 3.33301 12.9001C3.33301 15.9167 9.91634 18.4167 18.333 18.7001V25.4001H15.583C14.2163 25.4001 12.9997 26.2334 12.483 27.5001L9.99967 33.7334H13.333L15.333 28.7334H24.6663L26.6663 33.7334H29.9997L27.4997 27.5001C26.9997 26.2334 25.7663 25.4001 24.4163 25.4001H21.6663V18.7001C30.083 18.4167 36.6663 15.9167 36.6663 12.9001ZM19.9997 10.4001C26.7497 10.4001 31.233 11.8334 32.8663 12.9001C31.233 13.9667 26.7497 15.4001 19.9997 15.4001C13.2497 15.4001 8.76634 13.9667 7.13301 12.9001C8.76634 11.8334 13.2497 10.4001 19.9997 10.4001Z"></path>
      </svg>
    ), // Material table icon
    [TOOLS.PLACE_STAGE]: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M18 4v1h-2V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v1H8V4c0-.55-.45-1-1-1s-1 .45-1 1v16c0 .55.45 1 1 1s1-.45 1-1v-3h8v3c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1s-1 .45-1 1zM8 16H6v-2h2v2zm0-3H6v-2h2v2zm0-3H6V8h2v2zm10 6h-2v-2h2v2zm0-3h-2v-2h2v2zm0-3h-2V8h2v2z"></path>
      </svg>
    ), // Material stage icon
    [TOOLS.PLACE_FLOOR]: (
      <svg
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 12l16 0" />
        <path d="M9 10h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1z" />
      </svg>
    ),
    [TOOLS.PLACE_ENTRANCE]: (
      <svg
        viewBox="0 0 40 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
      >
        {/* Changed fill to currentColor */}
        <path
          d="M22.2337 14.4167C20.6837 14.4167 19.417 13.1333 19.417 11.5833C19.417 10.8363 19.7137 10.1199 20.242 9.59166C20.7702 9.06343 21.4866 8.76668 22.2337 8.76668C23.8003 8.76668 25.067 10.0333 25.067 11.5833C25.067 13.1333 23.8003 14.4167 22.2337 14.4167ZM17.167 34.0167L7.28366 32.05L7.85033 29.2167L14.767 30.6333L17.017 19.2L14.4837 20.2V24.9667H11.667V18.3667L19.0003 15.25L20.117 15.1167C21.117 15.1167 21.9503 15.6833 22.5003 16.5333L23.9337 18.7833C25.067 20.8 27.317 22.1667 30.0003 22.1667V24.9667C26.9003 24.9667 24.067 23.5833 22.2337 21.4667L21.4003 25.7L24.3503 28.5167V39.1333H21.5337V30.6333L18.567 27.8167L17.167 34.0167ZM35.0003 39.1333H31.667V5.80001H10.0003V27.65L6.66699 26.95V2.46667H35.0003V39.1333ZM10.0003 39.1333H6.66699V33.7667L10.0003 34.4667V39.1333Z"
          fill="currentColor"
        />
      </svg>
    ), // Use provided path, flip Y
    [TOOLS.PLACE_EXIT]: (
      <svg
        viewBox="0 0 40 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
      >
        <path
          d="M35 35.8H5V19.1333C5 17.1635 5.38799 15.2129 6.14181 13.393C6.89563 11.5732 8.00052 9.91958 9.3934 8.5267C10.7863 7.13382 12.4399 6.02893 14.2597 5.27511C16.0796 4.52129 18.0302 4.1333 20 4.1333C21.9698 4.1333 23.9204 4.52129 25.7403 5.27511C27.5601 6.02893 29.2137 7.13382 30.6066 8.5267C31.9995 9.91958 33.1044 11.5732 33.8582 13.393C34.612 15.2129 35 17.1635 35 19.1333V35.8Z"
          fill="none" // Ensure path is not filled
          stroke="black" // Set stroke to black
          strokeWidth="3.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34.6167 15.8H20V22.4667M13.3333 29.1334V22.4667H35M5 29.1334H35"
          fill="none" // Ensure path is not filled
          stroke="black" // Set stroke to black
          strokeWidth="3.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  const ConfigForms = () => {
    if (!selectedTool.startsWith("place-") || !currentConfig) return null;
    const elementType = selectedTool.replace("place-", "");

    switch (elementType) {
      case ELEMENT_TYPES.SEAT:
        return (
          <div className="space-y-2 mt-2 p-2 border rounded bg-gray-50">
            <h5 className="text-xs font-semibold mb-1">
              Seat Section Options:
            </h5>
            <label className="block text-xs">
              Rows{" "}
              <input
                type="number"
                min="1"
                step="1"
                value={currentConfig.rows || ""}
                onChange={(e) =>
                  handleConfigChange({
                    rows: parseInt(e.target.value, 10) || 1,
                  })
                }
                className="mt-1 w-full px-2 py-1 border rounded text-xs"
              />
            </label>
            <label className="block text-xs">
              Cols{" "}
              <input
                type="number"
                min="1"
                step="1"
                value={currentConfig.cols || ""}
                onChange={(e) =>
                  handleConfigChange({
                    cols: parseInt(e.target.value, 10) || 1,
                  })
                }
                className="mt-1 w-full px-2 py-1 border rounded text-xs"
              />
            </label>
            <label className="block text-xs">
              Row Spacing{" "}
              <input
                type="number"
                min="10"
                step="5"
                value={currentConfig.rowSpacing || ""}
                onChange={(e) =>
                  handleConfigChange({
                    rowSpacing:
                      parseInt(e.target.value, 10) || DEFAULT_ROW_SPACING,
                  })
                }
                className="mt-1 w-full px-2 py-1 border rounded text-xs"
              />
            </label>
            <label className="block text-xs">
              Col Spacing{" "}
              <input
                type="number"
                min="10"
                step="5"
                value={currentConfig.colSpacing || ""}
                onChange={(e) =>
                  handleConfigChange({
                    colSpacing:
                      parseInt(e.target.value, 10) || DEFAULT_COL_SPACING,
                  })
                }
                className="mt-1 w-full px-2 py-1 border rounded text-xs"
              />
            </label>
            <label className="block text-xs">
              Curve ({currentConfig.curve || 0}%){" "}
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={currentConfig.curve || 0}
                onChange={(e) =>
                  handleConfigChange({ curve: parseInt(e.target.value, 10) })
                }
                className="mt-1 w-full h-2 accent-blue-600"
              />
            </label>
          </div>
        );
      case ELEMENT_TYPES.TABLE:
      case ELEMENT_TYPES.STAGE:
        return (
          <div className="space-y-2 mt-2 p-2 border rounded bg-gray-50">
            <h5 className="text-xs font-semibold mb-1">
              {elementType.charAt(0).toUpperCase() + elementType.slice(1)}{" "}
              Options:
            </h5>
            <label className="block text-xs">
              Shape
              <select
                value={currentConfig.shape || ""}
                onChange={(e) => handleConfigChange({ shape: e.target.value })}
                className="mt-1 w-full px-2 py-1 border rounded text-xs"
              >
                {Object.values(SHAPES).map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs">
              Fill Color{" "}
              <input
                type="color"
                value={currentConfig.fill || "#888888"}
                onChange={(e) => handleConfigChange({ fill: e.target.value })}
                className="mt-1 w-full h-8 px-1 py-1 border rounded"
              />
            </label>
            {/* Add inputs for default size based on shape? Optional */}
          </div>
        );
      case ELEMENT_TYPES.FLOOR:
        return (
          <div className="space-y-2 mt-2 p-2 border rounded bg-gray-50">
            <h5 className="text-xs font-semibold mb-1">Floor Options:</h5>
            <label className="block text-xs">
              Label{" "}
              <input
                type="text"
                value={currentConfig.text || ""}
                onChange={(e) => handleConfigChange({ text: e.target.value })}
                className="mt-1 w-full px-2 py-1 border rounded text-xs"
              />
            </label>
            <label className="block text-xs">
              Default Length{" "}
              <input
                type="number"
                min="50"
                step="10"
                value={currentConfig.length || ""}
                onChange={(e) =>
                  handleConfigChange({
                    length: parseInt(e.target.value, 10) || 200,
                  })
                }
                className="mt-1 w-full px-2 py-1 border rounded text-xs"
              />
            </label>
            <label className="block text-xs">
              Color{" "}
              <input
                type="color"
                value={currentConfig.color || "#4a5568"}
                onChange={(e) => handleConfigChange({ color: e.target.value })}
                className="mt-1 w-full h-8 px-1 py-1 border rounded"
              />
            </label>
          </div>
        );
      case ELEMENT_TYPES.ENTRANCE:
      case ELEMENT_TYPES.EXIT:
        // Return null or a simple message, ensuring no color option is presented
        return (
          <div className="mt-2 p-2 text-center">
            <p className="text-xs text-gray-500">Click canvas to place.</p>
          </div>
        );
      // --- End Correct ---

      default:
        return null;
    }
  };
  // --- Child Component: ChairImage ---
  const ChairImage = React.memo(({ elementData, isSelected }) => {
    // Pass element data for color
    const chairPath =
      "M24.9997 8.33333V20H14.9997V8.33333H24.9997ZM24.9997 5H14.9997C13.1663 5 11.6663 6.5 11.6663 8.33333V23.3333H28.333V8.33333C28.333 6.5 26.833 5 24.9997 5ZM36.6663 16.6667H31.6663V21.6667H36.6663V16.6667ZM8.33301 16.6667H3.33301V21.6667H8.33301V16.6667ZM33.333 25H6.66634V35H9.99967V28.3333H29.9997V35H33.333V25Z";
    const scale = 0.7;
    const pathWidth = 36.6663 - 3.33301;
    const pathHeight = 35 - 5;

    // Use fixed scale for now, centering based on visual inspection
    const offsetX = (pathWidth * scale) / 2 - 1.6 * scale;
    const offsetY = (pathHeight * scale) / 2 + 5 * scale;

    return (
      <Path
        data={chairPath}
        fill={isSelected ? "#a3bffa" : elementData.fill || "#4a5568"} // Use highlight or element's fill
        scale={{ x: scale, y: scale }}
        offsetX={offsetX}
        offsetY={offsetY}
        listening={false} // Chairs usually not interactive
      />
    );
  });

  // --- Child Component: Shape Renderer ---
  const ShapeRenderer = React.memo(({ element, isSelected }) => {
    const commonProps = {
      fill: element.fill || (element.type === "table" ? "#a0aec0" : "#e2e8f0"),
      stroke: isSelected ? "#4299e1" : element.stroke || "transparent",
      strokeWidth: isSelected ? 2 : element.strokeWidth || 1,
    };

    let textWidth = 0,
      textHeight = 0,
      textOffsetX = 0,
      textOffsetY = 0;
    let fontSize = 14;
    let textContent = element.type === "table" ? "T" : "S"; // Default T/S

    switch (element.shape) {
      case SHAPES.CIRCLE: {
        const radiusC = element.radius || DEFAULT_CIRCLE_RADIUS;
        textWidth = radiusC * 2;
        textHeight = radiusC * 2;
        textOffsetX = -radiusC;
        textOffsetY = -radiusC;
        fontSize = Math.max(10, radiusC * 0.7);
        return (
          <>
            <Circle radius={radiusC} {...commonProps} />
            <Text
              text={textContent}
              fontSize={fontSize}
              fill="#1a202c"
              width={textWidth}
              height={textHeight}
              align="center"
              verticalAlign="middle"
              offsetX={-textOffsetX}
              offsetY={-textOffsetY}
              listening={false}
            />
          </>
        );
      }
      case SHAPES.ARC: {
        const outerRadiusA = element.outerRadius || DEFAULT_ARC_OUTER_RADIUS;
        const innerRadiusA = element.innerRadius || DEFAULT_ARC_INNER_RADIUS;
        fontSize = Math.max(8, (outerRadiusA - innerRadiusA) * 0.5);
        return (
          <>
            <Arc
              innerRadius={innerRadiusA}
              outerRadius={outerRadiusA}
              angle={element.angle || DEFAULT_ARC_ANGLE}
              {...commonProps}
            />
            {/* Simple text positioning for Arc */}
            <Text
              text={textContent}
              fontSize={fontSize}
              fill="#1a202c"
              x={0}
              y={-(outerRadiusA + innerRadiusA) / 3}
              align="center"
              verticalAlign="middle"
              listening={false}
            />
          </>
        );
      }
      case SHAPES.POLYGON:
      case SHAPES.STAR: {
        const radiusPS =
          element.radius ||
          (element.shape === SHAPES.STAR
            ? DEFAULT_STAR_RADIUS
            : DEFAULT_POLYGON_RADIUS);
        textWidth = radiusPS * 2;
        textHeight = radiusPS * 2;
        textOffsetX = -radiusPS;
        textOffsetY = -radiusPS;
        fontSize = Math.max(
          10,
          radiusPS * (element.shape === SHAPES.STAR ? 0.5 : 0.7)
        ); // Smaller text for star potentially
        return (
          <>
            <RegularPolygon
              sides={
                element.shape === SHAPES.STAR
                  ? element.numPoints || 5
                  : element.sides || 6
              }
              innerRadius={
                element.shape === SHAPES.STAR
                  ? element.innerRadius || radiusPS / 2.5
                  : undefined
              }
              outerRadius={radiusPS}
              {...commonProps}
            />
            <Text
              text={textContent}
              fontSize={fontSize}
              fill="#1a202c"
              width={textWidth}
              height={textHeight}
              align="center"
              verticalAlign="middle"
              offsetX={-textOffsetX}
              offsetY={-textOffsetY}
              listening={false}
            />
          </>
        );
      }
      case SHAPES.RING: {
        const outerRadiusR = element.outerRadius || DEFAULT_RING_OUTER_RADIUS;
        const innerRadiusR = element.innerRadius || DEFAULT_RING_INNER_RADIUS;
        textWidth = outerRadiusR * 2;
        textHeight = outerRadiusR * 2;
        textOffsetX = -outerRadiusR;
        textOffsetY = -outerRadiusR;
        fontSize = Math.max(8, (outerRadiusR - innerRadiusR) * 0.5);
        return (
          <>
            <Ring
              innerRadius={innerRadiusR}
              outerRadius={outerRadiusR}
              {...commonProps}
            />
            <Text
              text={textContent}
              fontSize={fontSize}
              fill="#1a202c"
              width={textWidth}
              height={textHeight}
              align="center"
              verticalAlign="middle"
              offsetX={-textOffsetX}
              offsetY={-textOffsetY}
              listening={false}
            />
          </>
        );
      }
      case SHAPES.WEDGE: {
        const radiusW = element.radius || DEFAULT_WEDGE_RADIUS;
        fontSize = Math.max(10, radiusW * 0.6);
        return (
          <>
            <Wedge
              radius={radiusW}
              angle={element.angle || DEFAULT_WEDGE_ANGLE}
              {...commonProps}
            />
            {/* Simple text positioning for Wedge */}
            <Text
              text={textContent}
              fontSize={fontSize}
              fill="#1a202c"
              x={0}
              y={-radiusW / 2.5}
              align="center"
              verticalAlign="middle"
              listening={false}
            />
          </>
        );
      }
      case SHAPES.RECT:
      default:
        textWidth = element.width || DEFAULT_RECT_SIZE.width;
        textHeight = element.height || DEFAULT_RECT_SIZE.height;
        fontSize = Math.min(
          textWidth * 0.5,
          textHeight * 0.5,
          element.type === "stage" ? 18 : 14
        );
        return (
          <>
            <Rect
              width={textWidth}
              height={textHeight}
              cornerRadius={element.cornerRadius || 0}
              {...commonProps}
            />
            <Text
              text={
                element.type.charAt(0).toUpperCase() + element.type.slice(1)
              } // Full text for Rect
              fontSize={fontSize}
              fill={element.type === "table" ? "#2d3748" : "#4a5568"}
              fontStyle={element.type === "stage" ? "bold" : "normal"}
              width={textWidth}
              height={textHeight}
              align="center"
              verticalAlign="middle"
              listening={false}
            />
          </>
        );
    }
  });

  // --- Main Render Function Hook ---
  const renderElement = useCallback(
    (el) => {
      const isDirectlySelected = selectedElementIds.includes(el.id.toString());
      const isSectionSelected =
        el.sectionId && selectedSectionId === el.sectionId;
      const isEffectivelySelected =
        isDirectlySelected ||
        (el.type !== ELEMENT_TYPES.SECTION_BOUNDARY && isSectionSelected);

      switch (el.type) {
        case ELEMENT_TYPES.CHAIR:
          return (
            <ChairImage elementData={el} isSelected={isEffectivelySelected} />
          );
        case ELEMENT_TYPES.TABLE:
        case ELEMENT_TYPES.STAGE:
          return <ShapeRenderer element={el} isSelected={isDirectlySelected} />;
        case ELEMENT_TYPES.SECTION_BOUNDARY:
          return (
            <Rect
              width={el.width}
              height={el.height}
              stroke={
                selectedSectionId === el.sectionId ? "#6b46c1" : "#cbd5e0"
              }
              strokeWidth={selectedSectionId === el.sectionId ? 2 : 1}
              dash={selectedSectionId === el.sectionId ? [] : [6, 4]}
              listening={true}
            />
          );

        // --- MODIFIED FLOOR CASE ---
        case ELEMENT_TYPES.FLOOR: {
          const text = el.text || "";
          const fontSize = el.fontSize || 14;
          const textPadding = el.textPadding || 5;
          const textHeight = el.textHeight || 24;
          // Estimate background width based on text length and padding OR use a fixed moderate width
          // Option A: Estimate based on text length (adjust multiplier as needed)
          // const estimatedTextWidth = (text.length * fontSize * 0.7) + (textPadding * 2);
          // Option B: Use a fixed width + padding, let text align inside
          const backgroundWidth = Math.max(
            50,
            text.length * fontSize * 0.7 + textPadding * 2
          ); // Ensure minimum width

          return (
            <>
              <Line
                points={[
                  el.startX ?? 0,
                  el.startY ?? 0,
                  el.endX ?? 0,
                  el.endY ?? 0,
                ]} // Use ?? 0 for safety
                stroke={el.stroke || "#4a5568"}
                strokeWidth={el.strokeWidth || 2}
                lineCap="round"
              />
              {/* Group for text + background, positioned at the line's center */}
              <Group
                x={((el.startX ?? 0) + (el.endX ?? 0)) / 2}
                y={((el.startY ?? 0) + (el.endY ?? 0)) / 2}
                offsetX={backgroundWidth / 2} // Center the group horizontally
                offsetY={textHeight / 2} // Center the group vertically
              >
                <Rect
                  width={backgroundWidth}
                  height={textHeight}
                  fill={el.textBgFill || el.stroke || "#4a5568"}
                  cornerRadius={4}
                />
                <Text
                  text={text}
                  fontSize={fontSize}
                  fill={el.textFill || "#ffffff"}
                  x={0} // Position text at the start of the group
                  y={0} // Position text at the start of the group
                  width={backgroundWidth} // Constrain text width to background
                  height={textHeight} // Constrain text height
                  padding={textPadding}
                  align="center" // Center text within its bounds
                  verticalAlign="middle" // Vertically align text
                  listening={true} // Make text listen for dblclick
                  onDblClick={(e) => handleTextDblClick(e, el)}
                />
              </Group>
            </>
          );
        }
        // --- End Modified Floor Case ---

        case ELEMENT_TYPES.ENTRANCE:
        case ELEMENT_TYPES.EXIT:
          return (
            <Path
              data={el.pathData}
              fill={el.fill || "black"} // Apply fill from element data
              // No stroke props needed
              scaleX={el.scaleX ?? 1}
              scaleY={el.scaleY ?? 1}
            />
          );
        default:
          return null;
      }
    },
    [selectedElementIds, selectedSectionId, handleTextDblClick] // Dependencies
  );

  // --- Grid Lines ---
  const gridLines = useMemo(() => {
    const lines = [];
    const extents = Math.max(STAGE_WIDTH, STAGE_HEIGHT) * 1.5; // Extend grid beyond initial view
    const gridColor = "#e2e8f0";
    const gridStrokeWidth = 0.5;

    for (let i = -extents / GRID_SIZE; i < extents / GRID_SIZE; i++) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * GRID_SIZE, -extents, i * GRID_SIZE, extents]}
          stroke={gridColor}
          strokeWidth={gridStrokeWidth}
          listening={false}
        />
      );
    }
    for (let j = -extents / GRID_SIZE; j < extents / GRID_SIZE; j++) {
      lines.push(
        <Line
          key={`h-${j}`}
          points={[-extents, j * GRID_SIZE, extents, j * GRID_SIZE]}
          stroke={gridColor}
          strokeWidth={gridStrokeWidth}
          listening={false}
        />
      );
    }
    return lines;
  }, []); // Empty dependency array - grid doesn't change

  // --- Cursor Style ---
  const getCursorStyle = useCallback(() => {
    if (selectedTool === TOOLS.DRAW_SECTION) return "crosshair";
    if (selectedTool.startsWith("place-")) return "copy";
    if (selectedTool === TOOLS.HAND)
      return isMouseDownRef.current ? "grabbing" : "grab";
    if (selectedTool === TOOLS.SELECT) return "default";
    return "default";
  }, [selectedTool]);

  // --- JSX Structure ---
  return (
    <div className="flex w-full h-screen bg-gray-100 font-sans text-sm">
      {/* Left Sidebar */}
      <div className="w-1/5 flex-shrink-0 bg-white s p-3 space-y-3 overflow-y-auto flex flex-col">
        {/* Element Palette */}
        <div className="">
          {" "}
          <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">
            Elements
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {/* --- MODIFIED: Seat now activates DRAW_SECTION tool --- */}
            <PaletteItem
              tool={TOOLS.DRAW_SECTION}
              label="Seat"
              icon={icons[TOOLS.PLACE_SEAT]}
              currentTool={selectedTool}
              onSelect={handleSelectTool}
            />
            <PaletteItem
              tool={TOOLS.PLACE_TABLE}
              label="Table"
              icon={icons[TOOLS.PLACE_TABLE]}
              currentTool={selectedTool}
              onSelect={handleSelectTool}
            />
            <PaletteItem
              tool={TOOLS.PLACE_STAGE}
              label="Stage"
              icon={icons[TOOLS.PLACE_STAGE]}
              currentTool={selectedTool}
              onSelect={handleSelectTool}
            />
            <PaletteItem
              tool={TOOLS.PLACE_FLOOR}
              label="Floor"
              icon={icons[TOOLS.PLACE_FLOOR]}
              currentTool={selectedTool}
              onSelect={handleSelectTool}
            />
            <PaletteItem
              tool={TOOLS.PLACE_ENTRANCE}
              label="Entrance"
              icon={icons[TOOLS.PLACE_ENTRANCE]}
              currentTool={selectedTool}
              onSelect={handleSelectTool}
            />
            <PaletteItem
              tool={TOOLS.PLACE_EXIT}
              label="Exit"
              icon={icons[TOOLS.PLACE_EXIT]}
              currentTool={selectedTool}
              onSelect={handleSelectTool}
            />
          </div>
        </div>

        {/* Configuration Forms (Dynamically shown) */}
        <ConfigForms />

        {/* Selected Element/Section Properties */}
        <div className="border-t pt-3 pb-2 space-y-3 overflow-y-auto">
          {" "}
          {/* Allow properties section to grow/scroll */}
          {/* --- Section Controls --- */}
          {selectedSectionId && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                Section Properties
              </h4>
              {(() => {
                const section = sections.find(
                  (s) => s.id === selectedSectionId
                );
                if (!section)
                  return (
                    <p className="text-xs text-gray-500">
                      Section data missing.
                    </p>
                  );
                return (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">
                      Rows{" "}
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={section.rows || ""}
                        onChange={(e) =>
                          updateSectionProperties(selectedSectionId, {
                            rows: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        onBlur={saveState}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
                      />
                    </label>
                    <label className="block text-xs font-medium text-gray-700">
                      Cols{" "}
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={section.cols || ""}
                        onChange={(e) =>
                          updateSectionProperties(selectedSectionId, {
                            cols: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        onBlur={saveState}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
                      />
                    </label>
                    <label className="block text-xs font-medium text-gray-700">
                      Row Spacing{" "}
                      <input
                        type="number"
                        min="10"
                        step="5"
                        value={section.rowSpacing || ""}
                        onChange={(e) =>
                          updateSectionProperties(selectedSectionId, {
                            rowSpacing:
                              parseInt(e.target.value, 10) ||
                              DEFAULT_ROW_SPACING,
                          })
                        }
                        onBlur={saveState}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
                      />
                    </label>
                    <label className="block text-xs font-medium text-gray-700">
                      Col Spacing{" "}
                      <input
                        type="number"
                        min="10"
                        step="5"
                        value={section.colSpacing || ""}
                        onChange={(e) =>
                          updateSectionProperties(selectedSectionId, {
                            colSpacing:
                              parseInt(e.target.value, 10) ||
                              DEFAULT_COL_SPACING,
                          })
                        }
                        onBlur={saveState}
                        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
                      />
                    </label>
                    <label className="block text-xs font-medium text-gray-700">
                      Curve ({section.curve || 0}%){" "}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={section.curve || 0}
                        onChange={(e) =>
                          updateSectionProperties(selectedSectionId, {
                            curve: parseInt(e.target.value, 10),
                          })
                        }
                        onMouseUp={saveState}
                        className="mt-1 block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </label>
                    <button
                      onClick={() => deleteSectionById(selectedSectionId)}
                      className="w-full mt-2 p-2 rounded border text-xs bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
                    >
                      Delete Section
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
          {/* --- Element Controls --- */}
          {selectedElementIds.length === 1 && !selectedSectionId && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                Element Properties
              </h4>
              {(() => {
                const selectedId = selectedElementIds[0];
                const element = elements.find((el) => el.id === selectedId);
                if (
                  !element ||
                  element.sectionId ||
                  element.type === ELEMENT_TYPES.SECTION_BOUNDARY
                )
                  return (
                    <p className="text-xs text-gray-500">
                      Select an individual table, stage, floor, etc.
                    </p>
                  );
                const handleNumChange = (prop, val) => {
                  updateElementProperties(selectedId, {
                    [prop]: parseFloat(val) || 0,
                  });
                };
                const handleIntChange = (prop, val) => {
                  updateElementProperties(selectedId, {
                    [prop]: parseInt(val, 10) || 0,
                  });
                };
                const handleColChange = (val) => {
                  updateElementProperties(selectedId, { fill: val });
                  saveState();
                }; // Save color immediately
                return (
                  <div className="space-y-2">
                    {/* --- Color Picker --- */}
                    {element.type !== ELEMENT_TYPES.FLOOR && (
                      <label className="block text-xs font-medium text-gray-700">
                        Fill Color{" "}
                        <input
                          type="color"
                          value={element.fill || "#888888"}
                          onChange={(e) => handleColChange(e.target.value)}
                          className="mt-1 block w-full h-8 px-1 py-1 border rounded"
                        />
                      </label>
                    )}
                    {element.type === ELEMENT_TYPES.FLOOR && (
                      <label className="block text-xs font-medium text-gray-700">
                        Color{" "}
                        <input
                          type="color"
                          value={element.stroke || "#4a5568"}
                          onChange={(e) =>
                            updateElementProperties(selectedId, {
                              stroke: e.target.value,
                              textBgFill: e.target.value,
                            })
                          }
                          onBlur={saveState}
                          className="mt-1 block w-full h-8 px-1 py-1 border rounded"
                        />
                      </label>
                    )}

                    {/* --- Details/Size --- */}
                    <p className="text-xs font-semibold text-gray-600 pt-2 border-t mt-2">
                      Details:
                    </p>
                    {/* Table/Stage Shape */}
                    {(element.type === ELEMENT_TYPES.TABLE ||
                      element.type === ELEMENT_TYPES.STAGE) && (
                      <label className="block text-xs font-medium text-gray-700">
                        Shape{" "}
                        <select
                          value={element.shape || ""}
                          onChange={(e) =>
                            updateElementProperties(selectedId, {
                              shape: e.target.value,
                            })
                          }
                          onBlur={saveState}
                          className="mt-1 w-full px-2 py-1 border rounded text-xs"
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          {Object.values(SHAPES).map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    {/* Rect Size */}
                    {element.shape === SHAPES.RECT && (
                      <>
                        <label className="block text-xs font-medium text-gray-700">
                          Width{" "}
                          <input
                            type="number"
                            min={MIN_SIZE}
                            step="1"
                            value={element.width?.toFixed(0) || ""}
                            onChange={(e) =>
                              handleNumChange("width", e.target.value)
                            }
                            onBlur={saveState}
                            className="mt-1 w-full px-2 py-1 border rounded text-xs"
                          />
                        </label>
                        <label className="block text-xs font-medium text-gray-700">
                          Height{" "}
                          <input
                            type="number"
                            min={MIN_SIZE}
                            step="1"
                            value={element.height?.toFixed(0) || ""}
                            onChange={(e) =>
                              handleNumChange("height", e.target.value)
                            }
                            onBlur={saveState}
                            className="mt-1 w-full px-2 py-1 border rounded text-xs"
                          />
                        </label>
                      </>
                    )}
                    {/* Radius (Outer) */}
                    {[
                      SHAPES.CIRCLE,
                      SHAPES.WEDGE,
                      SHAPES.POLYGON,
                      SHAPES.STAR,
                    ].includes(element.shape) && (
                      <label className="block text-xs font-medium text-gray-700">
                        Radius{element.shape === SHAPES.STAR ? " (Outer)" : ""}{" "}
                        <input
                          type="number"
                          min={MIN_SIZE}
                          step="1"
                          value={element.radius?.toFixed(0) || ""}
                          onChange={(e) =>
                            handleNumChange("radius", e.target.value)
                          }
                          onBlur={saveState}
                          className="mt-1 w-full px-2 py-1 border rounded text-xs"
                        />
                      </label>
                    )}
                    {/* Inner Radius */}
                    {[SHAPES.RING, SHAPES.ARC, SHAPES.STAR].includes(
                      element.shape
                    ) && (
                      <label className="block text-xs font-medium text-gray-700">
                        Inner Radius{" "}
                        <input
                          type="number"
                          min={MIN_SIZE / 2}
                          step="1"
                          value={element.innerRadius?.toFixed(0) || ""}
                          onChange={(e) =>
                            handleNumChange("innerRadius", e.target.value)
                          }
                          onBlur={saveState}
                          className="mt-1 w-full px-2 py-1 border rounded text-xs"
                        />
                      </label>
                    )}
                    {/* Outer Radius (Specific) */}
                    {[SHAPES.RING, SHAPES.ARC].includes(element.shape) && (
                      <label className="block text-xs font-medium text-gray-700">
                        Outer Radius{" "}
                        <input
                          type="number"
                          min={MIN_SIZE}
                          step="1"
                          value={element.outerRadius?.toFixed(0) || ""}
                          onChange={(e) =>
                            handleNumChange("outerRadius", e.target.value)
                          }
                          onBlur={saveState}
                          className="mt-1 w-full px-2 py-1 border rounded text-xs"
                        />
                      </label>
                    )}
                    {/* Angle */}
                    {[SHAPES.WEDGE, SHAPES.ARC].includes(element.shape) && (
                      <label className="block text-xs font-medium text-gray-700">
                        Angle{" "}
                        <input
                          type="number"
                          min="1"
                          max="360"
                          step="1"
                          value={element.angle?.toFixed(0) || ""}
                          onChange={(e) =>
                            handleIntChange("angle", e.target.value)
                          }
                          onBlur={saveState}
                          className="mt-1 w-full px-2 py-1 border rounded text-xs"
                        />
                      </label>
                    )}
                    {/* Sides */}
                    {element.shape === SHAPES.POLYGON && (
                      <label className="block text-xs font-medium text-gray-700">
                        Sides{" "}
                        <input
                          type="number"
                          min="3"
                          step="1"
                          value={element.sides?.toFixed(0) || ""}
                          onChange={(e) =>
                            handleIntChange("sides", e.target.value)
                          }
                          onBlur={saveState}
                          className="mt-1 w-full px-2 py-1 border rounded text-xs"
                        />
                      </label>
                    )}
                    {/* Points */}
                    {element.shape === SHAPES.STAR && (
                      <label className="block text-xs font-medium text-gray-700">
                        Points{" "}
                        <input
                          type="number"
                          min="3"
                          step="1"
                          value={element.numPoints?.toFixed(0) || ""}
                          onChange={(e) =>
                            handleIntChange("numPoints", e.target.value)
                          }
                          onBlur={saveState}
                          className="mt-1 w-full px-2 py-1 border rounded text-xs"
                        />
                      </label>
                    )}
                    {/* Floor Text (Readonly - edit on canvas) */}
                    {element.type === ELEMENT_TYPES.FLOOR && (
                      <label className="block text-xs font-medium text-gray-700">
                        Label{" "}
                        <input
                          type="text"
                          value={element.text || ""}
                          readOnly
                          className="mt-1 w-full px-2 py-1 border rounded text-xs bg-gray-100 italic"
                          title="Double-click label on canvas to edit"
                        />
                      </label>
                    )}
                    {/* Floor Length */}
                    {element.type === ELEMENT_TYPES.FLOOR && (
                      <label className="block text-xs font-medium text-gray-700">
                        Length{" "}
                        <input
                          type="number"
                          min={MIN_SIZE * 2}
                          step="1"
                          value={element.length?.toFixed(0) || ""}
                          onChange={(e) =>
                            updateElementProperties(selectedId, {
                              length: parseInt(e.target.value, 10) || 100,
                            })
                          }
                          onBlur={saveState}
                          className="mt-1 w-full px-2 py-1 border rounded text-xs"
                        />
                      </label>
                    )}

                    <button
                      onClick={deleteSelected}
                      className="w-full mt-2 p-2 rounded border text-xs bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
                    >
                      Delete Element
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
          {/* Placeholder if nothing selected */}
          {!selectedSectionId &&
            selectedElementIds.length === 0 &&
            !selectedTool.startsWith("place-") && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Select element to edit.
              </p>
            )}
        </div>
      </div>
      {/* End Sidebar */}
      {/* Konva Stage */}
      <div className="flex-grow bg-gray-200 overflow-hidden relative">
        <Stage
          width={window.innerWidth - 256} // Adjust width dynamically if needed
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
          <Layer>
            {gridLines}
            {elements.map((el) => (
              <Group
                key={el.id}
                id={el.id.toString()}
                x={el.x}
                y={el.y}
                rotation={el.rotation || 0}
                draggable={
                  selectedTool === TOOLS.SELECT &&
                  selectedElementIds.includes(el.id)
                }
                offsetX={
                  // Offset ensures transforms (scale/rotate) happen around the element's logical center (x,y)
                  el.type === ELEMENT_TYPES.TABLE ||
                  el.type === ELEMENT_TYPES.STAGE
                    ? el.shape === SHAPES.RECT
                      ? (el.width || 0) / 2
                      : 0 // Rect origin top-left, others center
                    : 0 // Floor, Path, Boundary origin is likely x,y
                }
                offsetY={
                  el.type === ELEMENT_TYPES.TABLE ||
                  el.type === ELEMENT_TYPES.STAGE
                    ? el.shape === SHAPES.RECT
                      ? (el.height || 0) / 2
                      : 0
                    : 0
                }
                ref={(node) => (shapeRefs.current[el.id] = node)}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} // Pass original element data via closure if needed
                onClick={(e) => {
                  if (
                    isDraggingRef.current ||
                    transformerRef.current?.isTransforming()
                  )
                    return;
                  if (selectedTool === TOOLS.SELECT) {
                    const isSelected = selectedElementIds.includes(el.id);
                    const isMeta =
                      e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
                    if (el.type === ELEMENT_TYPES.SECTION_BOUNDARY) {
                      setSelectedSectionId(el.sectionId);
                      setSelectedElementIds([el.id]);
                    } else if (el.sectionId) {
                      // Chair click selects section boundary
                      const bId = `boundary-${el.sectionId}`;
                      setSelectedSectionId(el.sectionId);
                      setSelectedElementIds([bId]);
                    } else {
                      // Other elements
                      setSelectedSectionId(null);
                      if (isMeta) {
                        setSelectedElementIds((ids) =>
                          isSelected
                            ? ids.filter((id) => id !== el.id)
                            : [...ids, el.id]
                        );
                      } else {
                        setSelectedElementIds(isSelected ? [] : [el.id]);
                      }
                    }
                  }
                }}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  if (!stage) return;
                  const canDrag =
                    selectedTool === TOOLS.SELECT &&
                    selectedElementIds.includes(el.id);
                  if (canDrag) stage.container().style.cursor = "move";
                  // Show pointer cursor for selectable elements (non-chairs) when using select tool
                  else if (
                    selectedTool === TOOLS.SELECT &&
                    el.type !== ELEMENT_TYPES.CHAIR
                  )
                    stage.container().style.cursor = "pointer";
                  else stage.container().style.cursor = getCursorStyle();
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = getCursorStyle();
                }}
                scaleX={el.scaleX ?? 1} // Apply scale if present (for Path)
                scaleY={el.scaleY ?? 1}
              >
                {renderElement(el)}
              </Group>
            ))}
            {isDrawingSection && currentRect && (
              <Rect
                x={currentRect.x}
                y={currentRect.y}
                width={currentRect.width}
                height={currentRect.height}
                fill="rgba(107, 70, 193, 0.2)"
                stroke="#6b46c1"
                strokeWidth={1}
                dash={[4, 2]}
                listening={false}
              />
            )}
            {isDrawingSection && tempPreviewText && (
              <Text
                x={tempPreviewText.x}
                y={tempPreviewText.y}
                text={tempPreviewText.text}
                fontSize={14}
                fill="#4a5568"
                padding={4}
                fillAfterStrokeEnabled
                stroke="white"
                strokeWidth={0.5}
                listening={false}
              />
            )}
            {/* Transformer */}
            <Transformer
              ref={transformerRef}
              rotateEnabled={true}
              keepRatio={false} // Usually false is better for layout flexibility
              borderStroke="#6b46c1"
              borderStrokeWidth={1.5}
              anchorFill="#fff"
              anchorStroke="#6b46c1"
              anchorStrokeWidth={1}
              anchorSize={8}
              anchorCornerRadius={4}
              onTransformEnd={handleTransformEnd}
              boundBoxFunc={(oldBox, newBox) => {
                // Minimum size constraint during transform
                if (newBox.width < MIN_SIZE || newBox.height < MIN_SIZE) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
        {/* Absolutely positioned Textarea for Editing Floor Labels */}
        {textEdit.visible && (
          <textarea
            ref={textEditRef}
            value={textEdit.text}
            onChange={handleTextEditChange}
            onBlur={handleTextEditBlur}
            onKeyDown={handleTextEditKeyDown}
            style={{
              position: "absolute",
              top: `${textEdit.y}px`,
              left: `${textEdit.x}px`,
              width: `${textEdit.width}px`,
              height: `${textEdit.height}px`,
              fontSize: `${textEdit.fontSize}px`, // Use original font size
              border: "1px solid #6b46c1",
              padding: `${textEdit.padding}px`, // Use original padding
              margin: 0,
              overflow: "hidden",
              background: "white",
              color: "black",
              lineHeight: "1.2", // Or calculate based on font size/height
              fontFamily: textEdit.fontFamily,
              textAlign: textEdit.align,
              resize: "none",
              transformOrigin: "0 0", // Rotate around top-left corner
              zIndex: 1000,
              transform: `rotate(${textEdit.rotation || 0}deg)`, // Apply rotation
            }}
          />
        )}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white rounded-lg border-1 border-black/20  shadow-lg p-4 flex items-center space-x-2">
          {/* Select Button */}
          <button
            onClick={() => handleSelectTool(TOOLS.SELECT)}
            title="Select (V)"
            className={`p-1 rounded transition-colors duration-150 ${
              // Base button styles
              selectedTool === TOOLS.SELECT
                ? "bg-[#8354A3]" // Selected: Purple background
                : "bg-white" // Default: White background, light gray hover
            }`}
          >
            <img
              src={selectIcon} // CRITICAL: This image file must contain a BLACK icon
              alt="select"
              className={`${
                selectedTool === TOOLS.SELECT ? "invert-0" : "invert"
              }`}
            />
          </button>
          {/* Pan Button */}
          <button
            onClick={() => handleSelectTool(TOOLS.HAND)}
            title="Pan (H)"
            className={`p-1 rounded ${
              selectedTool === TOOLS.HAND ? "bg-[#8354A3]" : "bg-white"
            }`}
          >
            <img
              src={handIcon}
              alt="hand"
              className={`${
                selectedTool === TOOLS.HAND ? "invert" : "invert-0"
              }`}
            />
          </button>
          {/* Undo Button */}
          <button
            onClick={undo}
            disabled={history.length <= 1}
            title="Undo (Ctrl+Z)"
            className="p-1 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src={undoIcon} alt="undo" />
          </button>
          {/* Redo Button */}
          <button
            onClick={redo}
            disabled={future.length === 0}
            title="Redo (Ctrl+Y)"
            className="p-1 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src={redoIcon} alt="redo" />
          </button>
          {/* Clear All Button */}
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to clear everything? This cannot be undone."
                )
              ) {
                setElements([]);
                setSections([]);
                setSelectedElementIds([]);
                setSelectedSectionId(null);
                setHistory([{ elements: [], sections: [] }]);
                setFuture([]);
                transformerRef.current?.nodes([]);
                saveState();
              }
            }}
            title="Clear All"
            className="p-2 rounded bg-black/10 "
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatingMapBuilder;
