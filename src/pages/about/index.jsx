import React, { useState } from 'react';
import { Stage, Layer, Line, Rect, Text } from 'react-konva';

const SeatingChart = () => {
  const [tempLine, setTempLine] = useState([]);
  const [lines, setLines] = useState([]);
  const [chairs, setChairs] = useState([]);

  
  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    console.log(pos)

    if (tempLine.length < 2) {
      setTempLine([...tempLine, pos.x, pos.y]);
    } else {
      const newLine = [...tempLine, pos.x, pos.y];
      const numChairs = parseInt(prompt("Enter number of chairs:"), 10);

      if (!isNaN(numChairs) && numChairs > 0) {
        setLines((prev) => [...prev, newLine]);
        drawChairs(newLine, numChairs);
      }

      setTempLine([]);
    }
  };

  const CHAIR_SIZE = 20;

  const drawChairs = (points, numChairs) => {
    const [x1, y1, x2, y2] = points;
    const chairPositions = [];
  
    const dx = x2 - x1;
    const dy = y2 - y1;
  
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
  
    // If distance too small, reduce chair size to prevent overlap
    const spacing = distance / (numChairs - 1);
    const effectiveSpacing = Math.max(spacing, CHAIR_SIZE);
  
    for (let i = 0; i < numChairs; i++) {
      const ratio = i / (numChairs - 1);
      const cx = x1 + dx * ratio;
      const cy = y1 + dy * ratio;
  
      chairPositions.push({
        x: cx - CHAIR_SIZE / 2,
        y: cy - CHAIR_SIZE / 2,
        rotation: angle * (180 / Math.PI),
      });
    }
  
    setChairs(chairPositions);
  };
  

  const handleDragMove = (e, index) => {
    const { x, y } = e.target.position();
    setChairs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], x, y };
      return updated;
    });
  };

  const handleClear = () => {
    setLines([]);
    setChairs([]);
    setTempLine([]);
  };

  const handleUndo = () => {
    const lastLine = lines[lines.length - 1];
    if (!lastLine) return;

    const [x1, y1, x2, y2] = lastLine;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lastAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

    setLines(lines.slice(0, -1));

    // Remove chairs near the last line direction
    const remainingChairs = chairs.filter(
      (c) => Math.abs(c.rotation - lastAngle) > 1
    );
    setChairs(remainingChairs);
  };

  const handleExport = () => {
    const layout = {
      lines,
      chairs,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(layout, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = 'seating-chart.json';
    link.click();
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Seating Chart Designer</h1>
        <div className="space-x-2">
          <button onClick={handleUndo} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded">Undo</button>
          <button onClick={handleClear} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Clear All</button>
          <button onClick={handleExport} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Export JSON</button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 h-[calc(100vh-64px)]"> {/* adjust based on your header */}
        <Stage width={window.innerWidth} height={window.innerHeight - 64} onMouseDown={handleMouseDown}>
          <Layer>
            {/* Temp line while drawing */}
            {tempLine.length === 2 && (
              <Line
                points={[...tempLine, tempLine[0], tempLine[1]]}
                stroke="gray"
                strokeWidth={2}
                dash={[10, 5]}
              />
            )}

            {/* Finalized lines */}
            {lines.map((pts, i) => (
              <Line key={`line-${i}`} points={pts} stroke="black" strokeWidth={2} />
            ))}

            {/* Chairs */}
            {chairs.map((chair, i) => (
              <React.Fragment key={chair.id}>
                <Rect
                  x={chair.x}
                  y={chair.y}
                  width={20}
                  height={20}
                  fill="blue"
                  stroke="black"
                  draggable
                  onDragMove={(e) => handleDragMove(e, i)}
                  key={i}
                  rotation={chair.rotation || 0}
                  offset={{ x: CHAIR_SIZE / 2, y: CHAIR_SIZE / 2 }}
                />
                <Text
                  x={chair.x - 6}
                  y={chair.y - 6}
                  text={`${chair.number}`}
                  fontSize={10}
                  fill="white"
                  listening={false}
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default SeatingChart;
