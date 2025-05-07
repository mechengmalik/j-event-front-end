import React, { useMemo } from 'react';
import { Layer, Line } from 'react-konva';
import { STAGE_WIDTH, STAGE_HEIGHT, GRID_SIZE } from '../constants';

const GridLayer = () => {
  const gridLines = useMemo(() => {
    const lines = [];
    const extents = Math.max(STAGE_WIDTH, STAGE_HEIGHT) * 1.5; // Extend grid
    const gridColor = "#e2e8f0";
    const gridStrokeWidth = 0.5;

    for (let i = -Math.ceil(extents / GRID_SIZE); i <= Math.ceil(extents / GRID_SIZE); i++) {
      lines.push(
        <Line key={`v-${i}`} points={[i * GRID_SIZE, -extents, i * GRID_SIZE, extents]}
          stroke={gridColor} strokeWidth={gridStrokeWidth} listening={false} />
      );
    }
    for (let j = -Math.ceil(extents / GRID_SIZE); j <= Math.ceil(extents / GRID_SIZE); j++) {
      lines.push(
        <Line key={`h-${j}`} points={[-extents, j * GRID_SIZE, extents, j * GRID_SIZE]}
          stroke={gridColor} strokeWidth={gridStrokeWidth} listening={false} />
      );
    }
    return lines;
  }, []); // Recalculates only if constants change (they don't)

  return <Layer>{gridLines}</Layer>;
};

export default GridLayer;