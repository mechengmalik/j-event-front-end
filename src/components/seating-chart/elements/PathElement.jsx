import React from 'react';
import { Path } from 'react-konva';

const PathElement = React.memo(({ element, isSelected }) => {
  return (
    <Path
      data={element.pathData}
      fill={element.fill || "black"}
      stroke={isSelected ? "#4299e1" : undefined} // Highlight stroke on selection
      strokeWidth={isSelected ? 1.5 / (element.scaleX || 1) : 0} // Adjust stroke width based on scale
      scaleX={element.scaleX ?? 1}
      scaleY={element.scaleY ?? 1}
      shadowEnabled={isSelected}
      shadowColor={'rgba(66, 153, 225, 0.5)'}
      shadowBlur={5 / (element.scaleX || 1)} // Adjust shadow blur too
      shadowOffset={{ x: 0, y: 0 }}
      hitStrokeWidth={10 / (element.scaleX || 1)} // Make easier to hit
    />
  );
});

export default PathElement;