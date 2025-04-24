import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Text, Group, Transformer } from "react-konva";

const ELEMENT_SIZE = 40;
const STAGE_WIDTH = 1000;
const STAGE_HEIGHT = 600;
const CHAIR_ROW_COUNT = 10;
const CHAIR_SPACING = 10;

const SeatingMapBuilder = () => {
  const [elements, setElements] = useState([]);
  const [selectedTool, setSelectedTool] = useState("chair");
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);

  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const shapeRefs = useRef({});

  useEffect(() => {
    const node = shapeRefs.current[selectedId];
    const transformer = transformerRef.current;
    if (node && transformer) {
      transformer.nodes([node]);
      transformer.getLayer().batchDraw();
    }
  }, [selectedId, elements]);

  const addElement = (x, y) => {
    const newElement = {
      id: Date.now(),
      type: selectedTool,
      x,
      y,
      width: selectedTool === "stage" ? ELEMENT_SIZE * 2 : ELEMENT_SIZE,
      height: ELEMENT_SIZE,
      rotation: 0,
      label: "",
    };
    const newElements = [...elements, newElement];
    setHistory([...history, elements]);
    setElements(newElements);
    setFuture([]);
  };

  const addMultipleChairs = (x, y) => {
    const newChairs = [];
    const spacing = 10;
    let idCounter = Date.now();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        newChairs.push({
          id: idCounter++,
          type: "chair",
          x: x + col * (ELEMENT_SIZE + spacing),
          y: y + row * (ELEMENT_SIZE + spacing),
          width: ELEMENT_SIZE,
          height: ELEMENT_SIZE,
          rotation: 0,
          label: "",
        });
      }
    }

    setHistory([...history, elements]);
    setElements([...elements, ...newChairs]);
    setFuture([]);
  };

  const addChairRow = (x, y) => {
    const newChairs = [];
    let idCounter = Date.now();
    for (let i = 0; i < CHAIR_ROW_COUNT; i++) {
      newChairs.push({
        id: idCounter++,
        type: "chair",
        x: x + i * (ELEMENT_SIZE + CHAIR_SPACING),
        y,
        width: ELEMENT_SIZE,
        height: ELEMENT_SIZE,
        rotation: 0,
        label: "",
      });
    }
    setHistory([...history, elements]);
    setElements([...elements, ...newChairs]);
    setFuture([]);
  };

  const handleClick = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      const adjustedX = (pointerPosition.x - stagePosition.x) / stageScale;
      const adjustedY = (pointerPosition.y - stagePosition.y) / stageScale;
      if (selectedTool === "multi-chair") {
        addMultipleChairs(adjustedX, adjustedY);
      } else if (selectedTool === "chair-row") {
        addChairRow(adjustedX, adjustedY);
      } else {
        addElement(adjustedX, adjustedY);
      }
      setSelectedId(null);
    } else {
      const clickedId = e.target.parent.attrs.id;
      setSelectedId(clickedId);
    }
  };

  const clearElements = () => {
    setHistory([...history, elements]);
    setElements([]);
    setFuture([]);
    setSelectedId(null);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture([elements, ...future]);
    setElements(previous);
    setHistory(history.slice(0, history.length - 1));
    setSelectedId(null);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory([...history, elements]);
    setElements(next);
    setFuture(future.slice(1));
    setSelectedId(null);
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stageScale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,
      y: (pointer.y - stagePosition.y) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePosition(newPos);
  };

  const handleTransform = (id, newAttrs) => {
    const updated = elements.map((el) => {
      if (el.id === id) {
        return { ...el, ...newAttrs };
      }
      return el;
    });
    setElements(updated);
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 pb-4 items-center">
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
        onClick={handleClick}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        onWheel={handleWheel}
        draggable
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
                handleTransform(el.id, {
                  x: node.x(),
                  y: node.y(),
                  rotation: node.rotation(),
                  width: Math.max(10, el.width * scaleX),
                  height: Math.max(10, el.height * scaleY),
                });
              }}
              onClick={() => setSelectedId(el.id)}
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
