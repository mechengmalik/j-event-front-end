// src/utils/chairUtils.js
import { ELEMENT_TYPES, DEFAULT_CHAIR_SIZE, DEFAULT_ROW_SPACING, DEFAULT_COL_SPACING } from '../constants'; // Adjust path

/**
 * Calculates positions and rotations for chairs within a given section.
 * Returns an array of complete chair element objects.
 */
export const calculateChairPositions = (sectionData) => {
  const chairs = [];
  const {
    id: sectionId,
    x: sectionX, y: sectionY, rows, cols,
    rowSpacing = DEFAULT_ROW_SPACING,
    colSpacing = DEFAULT_COL_SPACING,
    curve = 0,
    rotation = 0,
    width: sectionWidth, height: sectionHeight,
    // deletedSeats = [], // No longer using deletedSeats with this approach
  } = sectionData;

  if (rows <= 0 || cols <= 0) return [];

  const contentWidth = Math.max(0, (cols - 1) * colSpacing);
  const contentHeight = Math.max(0, (rows - 1) * rowSpacing);
  const PADDING_HORIZONTAL = Math.max(0, (sectionWidth - contentWidth - DEFAULT_CHAIR_SIZE.width) / 2);
  const PADDING_VERTICAL = Math.max(0, (sectionHeight - contentHeight - DEFAULT_CHAIR_SIZE.height) / 2);
  const baseOffsetX = PADDING_HORIZONTAL;
  const baseOffsetY = PADDING_VERTICAL;
  const sectionAngleRad = (rotation * Math.PI) / 180;

  let seatCounter = 1; // For seat numbering

  for (let r = 0; r < rows; r++) {
    const naturalRowYCenter = r * rowSpacing + DEFAULT_CHAIR_SIZE.height / 2;
    for (let c = 0; c < cols; c++) {
      const chairId = `chair-${sectionId}-${r}-${c}`;
      const defaultCenterX = c * colSpacing + DEFAULT_CHAIR_SIZE.width / 2;
      const defaultCenterY = naturalRowYCenter;

      let chairCenterX = defaultCenterX;
      let chairCenterY = defaultCenterY;
      let chairRotation = 0; // Rotation relative to the section

      if (curve !== 0 && cols > 1) {
        const effectiveCurve = curve / 100;
        if (effectiveCurve > 0) {
          const angle = Math.PI * 0.8 * effectiveCurve;
          const chordLength = contentWidth;
          const radius = angle > 0.001 ? (chordLength / 2) / Math.sin(angle / 2) : Infinity;
          if (isFinite(radius) && radius > 0) {
            const arcCenterX = chordLength / 2;
            const arcCenterY_relative_to_row_center = radius * Math.cos(angle / 2);
            const arcCenterY = naturalRowYCenter + arcCenterY_relative_to_row_center;
            const startAngleRad = -angle / 2;
            const angleStepRad = (cols > 1) ? angle / (cols - 1) : 0;
            const currentAngleRad = startAngleRad + c * angleStepRad;
            const xRelativeToArcCenter = radius * Math.sin(currentAngleRad);
            chairCenterX = arcCenterX + xRelativeToArcCenter + DEFAULT_CHAIR_SIZE.width / 2;
            const yRelativeToArcCenter = -radius * Math.cos(currentAngleRad);
            const initialChairCenterY = arcCenterY + yRelativeToArcCenter;
            const firstChairYOnCurve = arcCenterY - radius * Math.cos(startAngleRad);
            const yCorrection = naturalRowYCenter - firstChairYOnCurve;
            chairCenterY = initialChairCenterY + yCorrection;
            chairRotation = (currentAngleRad * 180) / Math.PI;
          }
        }
      }

      const finalRelativeX = baseOffsetX + chairCenterX;
      const finalRelativeY = baseOffsetY + chairCenterY;
      const rotatedX = finalRelativeX * Math.cos(sectionAngleRad) - finalRelativeY * Math.sin(sectionAngleRad);
      const rotatedY = finalRelativeX * Math.sin(sectionAngleRad) + finalRelativeY * Math.cos(sectionAngleRad);
      const finalX_center = sectionX + rotatedX;
      const finalY_center = sectionY + rotatedY;
      const finalRotation = rotation + chairRotation;

      chairs.push({
        id: chairId,
        type: ELEMENT_TYPES.CHAIR,
        x: finalX_center, // This is the center X for the chair's group
        y: finalY_center, // This is the center Y for the chair's group
        rotation: finalRotation,
        offsetX: DEFAULT_CHAIR_SIZE.width / 2, // For Konva rotation around center
        offsetY: DEFAULT_CHAIR_SIZE.height / 2,
        width: DEFAULT_CHAIR_SIZE.width,
        height: DEFAULT_CHAIR_SIZE.height,
        sectionId: sectionId, // Link to parent section
        r: r, // Original row index within section layout
        c: c, // Original col index within section layout
        seatNumber: seatCounter++,
        isReserved: false, // Default reservation status
        fill: "#4A5568", // Default chair color
        listening: true, // Chairs should be clickable
      });
    }
  }
  return chairs;
};
