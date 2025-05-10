import React from 'react';
import { Rect } from 'react-konva';

const BoundaryElement = React.memo(({ element, isSelected }) => {
  // isSelected here means the *boundary itself* is the selected element ID
  // (used for transform handles). We'll use sectionId for highlight.
  const highlight = isSelected; // Use direct selection for transform highlight

  return (
    <Rect
      width={element.width}
      height={element.height}
      stroke={highlight ? "#6b46c1" : "#cbd5e0"}
      strokeWidth={highlight ? 2 : 1}
      dash={highlight ? [] : [6, 4]}
      listening={true} // Boundary must be clickable to select section
      hitStrokeWidth={10} // Make boundary easier to click
      // Make semi-transparent so grid shows through
      fill="rgba(241, 242, 243, 0.1)" // Very light fill
    />
  );
});

export default BoundaryElement;