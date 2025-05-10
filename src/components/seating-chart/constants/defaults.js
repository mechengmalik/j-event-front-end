// src/constants/defaults.js
import { ELEMENT_TYPES } from './elementTypes';
import { SHAPES } from './shapes';
import { PATH_DATA } from './pathData'; // Assuming pathData is also here

// Default settings
export const DEFAULT_ROW_SPACING = 60;
export const DEFAULT_COL_SPACING = 60;
export const DEFAULT_CHAIR_SIZE = { width: 30, height: 25 };

// Default Shape Sizes
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

export const DEFAULT_COLOR = "#4287f5"; 
// Default Configs for Placement (Used by PlacementConfigForms)
export const DEFAULT_CONFIGS = {
    [ELEMENT_TYPES.SEAT]: { },
    [ELEMENT_TYPES.TABLE]: {
        shape: SHAPES.RECT, width: 120, height: 70, fill: "#000000",
        cornerRadius: 8, stroke: "#4A5568", strokeWidth: 1,color:"#4A5568",
        // Add defaults for other shapes used by tables
        radius: DEFAULT_CIRCLE_RADIUS, // For Circle/Polygon/Star initial state
        sides: DEFAULT_POLYGON_SIDES, // For Polygon
        numPoints: DEFAULT_STAR_POINTS, // For Star
        innerRadius: DEFAULT_STAR_RADIUS * DEFAULT_STAR_INNER_RADIUS_RATIO, // For Star/Ring/Arc
        outerRadius: DEFAULT_RING_OUTER_RADIUS, // For Ring/Arc
        angle: DEFAULT_WEDGE_ANGLE, // For Wedge/Arc
        chairCount: 0, chairSpacing: 20,
     },
    [ELEMENT_TYPES.STAGE]: {
        shape: SHAPES.RECT, width: 250, height: 120, fill: "#e2e8f0",
        cornerRadius: 4, stroke: "#4A5568", strokeWidth: 1,color:"#4A5568",
        // Add defaults for other shapes used by stages
        radius: DEFAULT_CIRCLE_RADIUS, sides: DEFAULT_POLYGON_SIDES, numPoints: DEFAULT_STAR_POINTS,
        innerRadius: DEFAULT_STAR_RADIUS * DEFAULT_STAR_INNER_RADIUS_RATIO,
        outerRadius: DEFAULT_RING_OUTER_RADIUS, angle: DEFAULT_WEDGE_ANGLE,
    },
    [ELEMENT_TYPES.FLOOR]: { stroke: "#4A5568", strokeWidth: 1,color:"#4A5568" },
    [ELEMENT_TYPES.ENTRANCE]: { stroke: "#4A5568", strokeWidth: 1,color:"#4A5568" },
    [ELEMENT_TYPES.EXIT]: { stroke: "#4A5568", strokeWidth: 1,color:"#4A5568" },
};

// Helper to get default props for *creating* an element
export const getDefaultElementProps = (elementType) => {
    const config = DEFAULT_CONFIGS[elementType] || {};
    let baseProps = { type: elementType, rotation: 0, ...config }; // Start with type, rotation, and placement config

    switch(elementType) {
        case ELEMENT_TYPES.TABLE:
        case ELEMENT_TYPES.STAGE: {
            const shape = config.shape || SHAPES.RECT; // Determine shape from config or default
            baseProps.shape = shape; // Ensure shape is set

            // Add specific size props based on the determined shape
            switch (shape) {
                case SHAPES.RECT:
                    baseProps.width = config.width || DEFAULT_RECT_SIZE.width;
                    baseProps.height = config.height || DEFAULT_RECT_SIZE.height;
                    break;
                case SHAPES.CIRCLE:
                case SHAPES.WEDGE: // Wedge uses radius
                    baseProps.radius = config.radius || (shape === SHAPES.WEDGE ? DEFAULT_WEDGE_RADIUS : DEFAULT_CIRCLE_RADIUS);
                    if (shape === SHAPES.WEDGE) baseProps.angle = config.angle || DEFAULT_WEDGE_ANGLE;
                    break;
                case SHAPES.POLYGON:
                    baseProps.radius = config.radius || DEFAULT_POLYGON_RADIUS;
                    baseProps.sides = config.sides || DEFAULT_POLYGON_SIDES;
                    break;
                case SHAPES.STAR:
                    baseProps.radius = config.radius || DEFAULT_STAR_RADIUS; // This is outer radius for star
                    baseProps.numPoints = config.numPoints || DEFAULT_STAR_POINTS;
                    // Calculate default inner based on outer if not provided
                    baseProps.innerRadius = config.innerRadius || baseProps.radius * DEFAULT_STAR_INNER_RADIUS_RATIO;
                    break;
                case SHAPES.RING:
                case SHAPES.ARC:
                    baseProps.outerRadius = config.outerRadius || (shape === SHAPES.RING ? DEFAULT_RING_OUTER_RADIUS : DEFAULT_ARC_OUTER_RADIUS);
                    baseProps.innerRadius = config.innerRadius || (shape === SHAPES.RING ? DEFAULT_RING_INNER_RADIUS : DEFAULT_ARC_INNER_RADIUS);
                    if (shape === SHAPES.ARC) baseProps.angle = config.angle || DEFAULT_ARC_ANGLE;
                    break;
                default: // Fallback to Rect if shape unknown
                    baseProps.shape = SHAPES.RECT;
                    baseProps.width = config.width || DEFAULT_RECT_SIZE.width;
                    baseProps.height = config.height || DEFAULT_RECT_SIZE.height;
            }
            // Ensure basic styling defaults
            baseProps.fill = config.fill || (elementType === ELEMENT_TYPES.TABLE ? "#a0aec0" : "#e2e8f0");
            baseProps.stroke = config.stroke; // Can be undefined
            baseProps.strokeWidth = config.strokeWidth; // Can be undefined

            // Add table-specific defaults if it's a table
            if (elementType === ELEMENT_TYPES.TABLE) {
                 baseProps.chairCount = config.chairCount || 0;
                 baseProps.chairSpacing = config.chairSpacing || 20;
                 baseProps.chairs = []; // Initialize chairs array
            }
            return baseProps;
        }
        case ELEMENT_TYPES.FLOOR: {
             const length = config.length || 200;
             const color = config.color || "#4a5568";
             return {
                type: ELEMENT_TYPES.FLOOR, rotation: 0, length, text: config.text || "Floor", stroke: color, strokeWidth: config.strokeWidth || 2,
                startX: -length / 2, startY: 0, endX: length / 2, endY: 0,
                fontSize: 14, textFill: "#ffffff", textBgFill: color, textPadding: 5, textHeight: 24,
             };
        }
        case ELEMENT_TYPES.ENTRANCE:
        case ELEMENT_TYPES.EXIT: {
            return {
                type: elementType, rotation: 0, pathData: PATH_DATA[elementType], fill: "black", scaleX: 1, scaleY: 1,
             };
        }
        default: return { type: elementType }; // Minimal default for unknown types
    }
};
