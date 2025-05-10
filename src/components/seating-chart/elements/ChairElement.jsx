// src/components/SeatingMapBuilder/elements/ChairElement.jsx
import React from 'react';
import { Path, Text } from 'react-konva'; // Aliased to avoid conflict if needed
import { DEFAULT_CHAIR_SIZE } from '../constants'; // Adjust path if needed

const ChairElement = React.memo(({ elementData, isSelected }) => {
  const defaultChairPath = "M24.9997 8.33333V20H14.9997V8.33333H24.9997ZM24.9997 5H14.9997C13.1663 5 11.6663 6.5 11.6663 8.33333V23.3333H28.333V8.33333C28.333 6.5 26.833 5 24.9997 5ZM36.6663 16.6667H31.6663V21.6667H36.6663V16.6667ZM8.33301 16.6667H3.33301V21.6667H8.33301V16.6667ZM33.333 25H6.66634V35H9.99967V28.3333H29.9997V35H33.333V25Z";
  const chairPath = elementData.svgPath || defaultChairPath;

  const visualScale = 0.7; // Visual scale of the SVG path

  // The Path is drawn relative to the Group's origin (which is the chair's center due to offsetX/Y on Group)
  // Offset the path drawing itself so its visual center aligns with (0,0) of the Path component
  const pathDataVisualCenterX = 20; // Approximate visual center X of the path data
  const pathDataVisualCenterY = 20; // Approximate visual center Y of the path data
  const pathOffsetX = pathDataVisualCenterX * visualScale;
  const pathOffsetY = pathDataVisualCenterY * visualScale;

  const fill = isSelected ? "#6b46c1" : (elementData.isReserved ? "#f56565" : elementData.fill || "#4a5568");
  const stroke = isSelected ? "#3182ce" : (elementData.isReserved ? "#c53030" : undefined);
  const strokeWidth = isSelected ? 2 / visualScale : (elementData.isReserved ? 1.5 / visualScale : 0);

  const seatNumber = elementData.seatNumber?.toString() || '';
  // Adjust font size based on chair visual scale
  const fontSize = 16;

  return (
    <>
      <Path
        data={chairPath}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        scaleX={visualScale}
        scaleY={visualScale}
        offsetX={pathOffsetX}
        offsetY={pathOffsetY}
        listening={true} // Chairs are selectable
        hitStrokeWidth={15 / visualScale}
      />
      {seatNumber && (
        <Text
          text={seatNumber}
          fontSize={fontSize}
          fill={isSelected || elementData.isReserved ? "#FFFFFF" : "#2D3748"}
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
          // Position text relative to the Group's center (0,0)
          // The Group's x/y is the chair's center, and Group's offsetX/Y is half chair size.
          // Text is placed at (0,0) within the group, then offset by its own half width/height.
          width={DEFAULT_CHAIR_SIZE.width} // Use actual chair width for text box
          height={DEFAULT_CHAIR_SIZE.height * 0.7} // Slightly smaller height for text box
          offsetX={(DEFAULT_CHAIR_SIZE.width) / 2.7}
          offsetY={(DEFAULT_CHAIR_SIZE.height * -5) / 5}
          listening={false} // Text itself doesn't need to capture clicks
          perfectDrawEnabled={false} // Optimization
        />
      )}
    </>
  );
});

export default ChairElement;
