import { ELEMENT_TYPES } from './elementTypes';

export const TOOLS = {
  SELECT: "select",
  HAND: "hand",
  DRAW_SECTION: "place-draw-section",
  PLACE_TABLE: `place-${ELEMENT_TYPES.TABLE}`,
  PLACE_STAGE: `place-${ELEMENT_TYPES.STAGE}`,
  PLACE_FLOOR: `place-${ELEMENT_TYPES.FLOOR}`,
  PLACE_ENTRANCE: `place-${ELEMENT_TYPES.ENTRANCE}`,
  PLACE_EXIT: `place-${ELEMENT_TYPES.EXIT}`,
  TEXT: `place-${ELEMENT_TYPES.TEXT}`, // Add TEXT tool

};

// Helper function (optional but useful)
export const isPlacementTool = (tool) => tool?.startsWith("place-");
export const getElementTypeFromTool = (tool) => tool?.replace("place-", "");