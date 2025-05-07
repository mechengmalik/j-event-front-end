import React from 'react';
import ShapeRenderer from './ShapeRenderer';
import { SHAPES } from '../constants';

// This component simply uses the ShapeRenderer
// It sets up the correct offset based on the shape type
const ShapeBasedElement = React.memo(({ element, isSelected }) => {
  // Calculate offset for centering based on shape

  return (
    <ShapeRenderer
      element={element}
      isSelected={isSelected}
    />
  );
});

export default ShapeBasedElement;