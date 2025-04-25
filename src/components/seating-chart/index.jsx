import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Text, Group, Transformer } from "react-konva";
import Konva from "konva";

const ELEMENT_SIZE = 40;
const STAGE_WIDTH = 1000;
const STAGE_HEIGHT = 600;
const CHAIR_SPACING = 10;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;

const SeatingMapBuilder = () => {
  const [elements, setElements] = useState([]);
  const [selectedTool, setSelectedTool] = useState("chair");
  const [selectedIds, setSelectedIds] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);

  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const shapeRefs = useRef({});
  const [selection, setSelection] = useState(null);
  const selectionRef = useRef(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const selectionStart = useRef(null);

  useEffect(() => {
    const nodes = selectedIds.map(id => shapeRefs.current[id]).filter(Boolean);
    transformerRef.current.nodes(nodes);
    transformerRef.current.getLayer().batchDraw();
  }, [selectedIds, elements]);

  const addElement = (x, y) => {
    const newElement = {
      id: Date.now(),
      type: selectedTool,
      x,
      y,
      width: selectedTool === "stage" ? ELEMENT_SIZE * 2 : ELEMENT_SIZE,
      height: ELEMENT_SIZE,
      rotation: 0,
    };
    setHistory([...history, elements]);
    setElements([...elements, newElement]);
    setFuture([]);
  };

  const addMultipleChairs = (x, y) => {
    const newChairs = [];
    let idCounter = Date.now();
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        newChairs.push({
          id: idCounter++,
          type: "chair",
          x: x + col * (ELEMENT_SIZE + CHAIR_SPACING),
          y: y + row * (ELEMENT_SIZE + CHAIR_SPACING),
          width: ELEMENT_SIZE,
          height: ELEMENT_SIZE,
          rotation: 0,
        });
      }
    }
    setHistory([...history, elements]);
    setElements([...elements, ...newChairs]);
    setFuture([]);
  };

  const handleMouseDown = (e) => {
    const stage = stageRef.current;
    if (selectedTool === "hand") return;
  
    if (selectedTool === "select") {
      if (e.target !== e.target.getStage()) return;
      const { x, y } = stage.getRelativePointerPosition();
      setIsSelecting(true);
      selectionStart.current = { x, y };
      setSelection({ x, y, width: 0, height: 0 });
      return;
    }
  
    if (e.target === e.target.getStage()) {
      const { x, y } = stage.getRelativePointerPosition();
      if (selectedTool === "multi-chair") {
        addMultipleChairs(x, y);
      } else if (selectedTool === "chair-row") {
        for (let row = 0; row < rows; row++) {
          const offsetY = row * (ELEMENT_SIZE + CHAIR_SPACING);
          for (let col = 0; col < columns; col++) {
            addElement(x + col * (ELEMENT_SIZE + CHAIR_SPACING), y + offsetY);
          }
        }
      } else {
        addElement(x, y);
      }
    }
  };
  
  const handleMouseMove = () => {
    if (!isSelecting || !selectionStart.current) return;
    const stage = stageRef.current;
    const { x, y } = stage.getRelativePointerPosition();
    const sx = selectionStart.current.x;
    const sy = selectionStart.current.y;
    setSelection({
      x: Math.min(sx, x),
      y: Math.min(sy, y),
      width: Math.abs(sx - x),
      height: Math.abs(sy - y),
    });
  };
  

  const handleMouseUp = () => {
    if (!isSelecting) return;
    const box = selection;
    const selected = elements.filter((el) => {
      const shape = shapeRefs.current[el.id];
      if (!shape) return false;
      const shapeBox = shape.getClientRect({ relativeTo: stageRef.current }); // <-- important
      return Konva.Util.haveIntersection(shapeBox, box);
    });
    setSelectedIds(selected.map((s) => s.id.toString()));
    setIsSelecting(false);
    setSelection(null);
  };
  

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
  };

  const clearElements = () => {
    setHistory([...history, elements]);
    setElements([]);
    setFuture([]);
    setSelectedIds([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture([elements, ...future]);
    setElements(previous);
    setHistory(history.slice(0, history.length - 1));
    setSelectedIds([]);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory([...history, elements]);
    setElements(next);
    setFuture(future.slice(1));
    setSelectedIds([]);
  };

  const handleTransform = (ids, newAttrs) => {
    const updated = elements.map((el) => {
      if (ids.includes(el.id.toString())) {
        return { ...el, ...newAttrs };
      }
      return el;
    });
    setElements(updated);
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 pb-4 items-center">
        <button onClick={() => setSelectedTool("select")}>Select</button>
        <button onClick={() => setSelectedTool("hand")}>Hand</button>
        <button onClick={() => setSelectedTool("chair")}>Chair</button>
        <button onClick={() => setSelectedTool("table")}>Table</button>
        <button onClick={() => setSelectedTool("stage")}>Stage</button>
        <button onClick={() => setSelectedTool("multi-chair")}>Multi Chair</button>
        <button onClick={() => setSelectedTool("chair-row")}>Chair Row</button>
        <label>
          Columns: <input type="number" min="1" value={columns} onChange={(e) => setColumns(Number(e.target.value))} className="border w-16 px-1" />
        </label>
        <label>
          Rows: <input type="number" min="1" value={rows} onChange={(e) => setRows(Number(e.target.value))} className="border w-16 px-1" />
        </label>
        <button onClick={clearElements}>Clear All</button>
        <button onClick={undo} disabled={history.length === 0}>Undo</button>
        <button onClick={redo} disabled={future.length === 0}>Redo</button>
      </div>
      <Stage
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        draggable={selectedTool === "hand"}
        ref={stageRef}
        className="border rounded-md shadow"
      >
        <Layer>
          {elements.map((el) => (
            <Group
              key={el.id}
              id={el.id.toString()}
              x={el.x}
              y={el.y}
              rotation={el.rotation}
              draggable
              ref={(node) => (shapeRefs.current[el.id] = node)}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                node.scaleX(1);
                node.scaleY(1);
                handleTransform([el.id.toString()], {
                  x: node.x(),
                  y: node.y(),
                  rotation: node.rotation(),
                  width: Math.max(10, el.width * scaleX),
                  height: Math.max(10, el.height * scaleY),
                });
              }}
              onClick={() => setSelectedIds([el.id.toString()])}
            >
              {el.type === "chair" && (
                <>
                  <Circle radius={el.width / 2} fill="#8354A3" />
                  <Text
                    text={el.label || ""}
                    fontSize={10}
                    fill="#fff"
                    align="center"
                    verticalAlign="middle"
                    offsetX={el.width / 4}
                    offsetY={-el.height / 4}
                  />
                </>
              )}
              {(el.type === "table" || el.type === "stage") && (
                <Rect
                  width={el.width}
                  height={el.height}
                  fill={el.type === "table" ? "#00C2D1" : "#444"}
                  cornerRadius={8}
                />
              )}
              <Text
                text={el.type.charAt(0).toUpperCase() + el.type.slice(1)}
                fontSize={12}
                fill="#fff"
                offsetY={-el.height / 2 + 5}
                align="center"
                width={el.width}
              />
            </Group>
          ))}

          {selection && (
            <Rect
              ref={selectionRef}
              x={selection.x}
              y={selection.y}
              width={selection.width}
              height={selection.height}
              fill="rgba(214, 43, 191, 0.3)"
              stroke="#00A1FF"
              strokeWidth={1}
              dash={[0, 0]}
            />
          )}

          <Transformer
            ref={transformerRef}
            rotateEnabled
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
              "top-center",
              "bottom-center",
            ]}
            anchorSize={8}
            borderDash={[6, 2]}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default SeatingMapBuilder;
