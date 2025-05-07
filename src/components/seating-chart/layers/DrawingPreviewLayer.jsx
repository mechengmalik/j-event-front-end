import React from 'react';
import { Layer, Rect, Text } from 'react-konva';

const DrawingPreviewLayer = ({ isDrawing, currentRect, previewText }) => {
  if (!isDrawing) return null;

  return (
    <Layer listening={false}>
      {currentRect && (
        <Rect
          x={currentRect.x} y={currentRect.y}
          width={currentRect.width} height={currentRect.height}
          fill="rgba(107, 70, 193, 0.2)" stroke="#6b46c1"
          strokeWidth={1} dash={[4, 2]}
        />
      )}
      {previewText && (
        <Text
          x={previewText.x} y={previewText.y}
          text={previewText.text} fontSize={14} fill="#4a5568"
          padding={4} fillAfterStrokeEnabled stroke="white" strokeWidth={0.5}
        />
      )}
    </Layer>
  );
};

export default DrawingPreviewLayer;