import { DEFAULT_ROW_SPACING, DEFAULT_COL_SPACING, DEFAULT_CHAIR_SIZE } from '../constants';

export const calculateSectionDimensions = (sectionData) => {
  const {
    rows = 1,
    cols = 1,
    rowSpacing = DEFAULT_ROW_SPACING,
    colSpacing = DEFAULT_COL_SPACING,
  } = sectionData;

  const PADDING = 10; // Padding around the chairs inside the boundary
  const MIN_DIMENSION = 30; // Minimum boundary size

  // Calculate width needed for chairs + spacing
  const contentWidth =
    cols <= 0 ? 0 :
    cols === 1 ? DEFAULT_CHAIR_SIZE.width :
    (cols - 1) * colSpacing + DEFAULT_CHAIR_SIZE.width;

  // Calculate height needed for chairs + spacing
  const contentHeight =
    rows <= 0 ? 0 :
    rows === 1 ? DEFAULT_CHAIR_SIZE.height :
    (rows - 1) * rowSpacing + DEFAULT_CHAIR_SIZE.height;

  // Add padding and enforce minimum size
  const calculatedWidth = Math.max(MIN_DIMENSION, contentWidth + PADDING * 2);
  const calculatedHeight = Math.max(MIN_DIMENSION, contentHeight + PADDING * 2);

  return {
    width: calculatedWidth,
    height: calculatedHeight,
  };
};