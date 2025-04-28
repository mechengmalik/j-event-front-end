import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Text,
  Group,
  Transformer,
  Line,
  Path,
} from "react-konva";
import Konva from "konva";
import "./seating-chart.css";
import pointerIcon from "../../assets/icons/select.svg";
import handFree from "../../assets/icons/hand-free.svg";
import undoIcon from "../../assets/icons/undo.svg";
import redoIcon from "../../assets/icons/redo.svg";

const ELEMENT_SIZE = 40;
const STAGE_WIDTH = 1800;
const STAGE_HEIGHT = 1800;
const CHAIR_SPACING = 90;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;

const SeatingMapBuilder = () => {
  const [elements, setElements] = useState([]);
  const [selectedTool, setSelectedTool] = useState("hand");
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
    const nodes = selectedIds
      .map((id) => shapeRefs.current[id])
      .filter(Boolean);
    transformerRef.current.nodes(nodes);
    transformerRef.current.getLayer().batchDraw();

    const handleKeyDown = (e) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds.length > 0
      ) {
        const updated = elements.filter(
          (el) => !selectedIds.includes(el.id.toString())
        );
        setHistory([...history, elements]);
        setElements(updated);
        setFuture([]);
        setSelectedIds([]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, elements, history]);

  const addElement = (x, y) => {
    const newElement = {
      id: Date.now(),
      type: selectedTool,
      x,
      y,
      width: ["stage"].includes(selectedTool)
        ? ELEMENT_SIZE * 10
        : ELEMENT_SIZE * 2,
      height: ["stage"].includes(selectedTool)
        ? ELEMENT_SIZE * 4
        : ELEMENT_SIZE * 2,

      rotation: 0,
    };
    setHistory([...history, elements]);
    setElements([...elements, newElement]);
    setFuture([]);
    setSelectedTool("hand");
  };

  const ChairImage = ({ xs, ys }) => {
    const chairPath =
      "M24.9997 8.33333V20H14.9997V8.33333H24.9997ZM24.9997 5H14.9997C13.1663 5 11.6663 6.5 11.6663 8.33333V23.3333H28.333V8.33333C28.333 6.5 26.833 5 24.9997 5ZM36.6663 16.6667H31.6663V21.6667H36.6663V16.6667ZM8.33301 16.6667H3.33301V21.6667H8.33301V16.6667ZM33.333 25H6.66634V35H9.99967V28.3333H29.9997V35H33.333V25Z";

    return (
      <Group
        x={xs}
        y={ys}
        onMouseOver={() => (document.body.style.cursor = "pointer")}
        onMouseOut={() => (document.body.style.cursor = "default")}
      >
        {/* Rect background */}
        <Rect fill="transparent" stroke="transparent" />

        {/* Chair SVG Path */}
        <Path
          data={chairPath}
          fill="black"
          scale={{ x: 2, y: 2 }}
          offsetX={0} // Centering the path inside rect
          offsetY={0}
          width={25}
          height={18}
        />
      </Group>
    );
  };

  const addMultipleChairs = (x, y) => {
    const newChairs = [];
    let idCounter = Date.now();
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        newChairs.push({
          id: idCounter++,
          type: "chair",
          x: x + col * +CHAIR_SPACING,
          y: y + row * +CHAIR_SPACING,
          rotation: 0,
        });
      }
    }
    setHistory([...history, elements]);
    setElements([...elements, ...newChairs]);
    setFuture([]);
    setSelectedTool("hand");
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
    e.evt.preventDefault(); // Prevent default scroll behavior (e.g., page scroll)

    const scaleBy = 1.05; // Zoom sensitivity
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    // If horizontal scroll (left or right), move the stage (no zoom)
    if (e.evt.deltaX !== 0) {
      const moveBy = 10; // Horizontal movement speed
      const newPos = {
        x: stage.x() - e.evt.deltaX * moveBy, // Move stage left or right
        y: stage.y(), // Keep the vertical position unchanged
      };

      stage.position(newPos); // Apply new position
      stage.batchDraw(); // Redraw the stage
    }

    // If vertical scroll (up or down), apply zooming
    if (e.evt.deltaY !== 0) {
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      // Zooming behavior (zoom in when scrolling up, zoom out when scrolling down)
      let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale)); // Clamp zoom scale

      // Recalculate position to keep zoom centered around mouse pointer
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.scale({ x: newScale, y: newScale }); // Apply new zoom scale
      stage.position(newPos); // Apply new position after zoom
      stage.batchDraw(); // Redraw the stage
    }
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
    setFuture((f) => [...f, JSON.parse(JSON.stringify(elements))]);
    setElements(previous);
    setHistory((h) => h.slice(0, h.length - 1));
  };

  const redo = () => {
    if (future.length === 0) return;

    const next = future[future.length - 1];
    setHistory((h) => [...h, JSON.parse(JSON.stringify(elements))]);
    setElements(next);
    setFuture((f) => f.slice(0, f.length - 1));

    setSelectedIds([]);
  };

  const GRID_SIZE = 50;
  const gridLines = [];

  for (let i = 0; i < STAGE_WIDTH / 49; i++) {
    gridLines.push(
      <Line
        key={`v-${i}`}
        points={[i * GRID_SIZE, 0, i * GRID_SIZE, STAGE_HEIGHT * 2]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }

  for (let j = 0; j < STAGE_HEIGHT; j++) {
    gridLines.push(
      <Line
        key={`h-${j}`}
        points={[0, j * GRID_SIZE, STAGE_WIDTH, j * GRID_SIZE]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="p-4">
        <div className="flex gap-4 pb-4 items-center">
          <button onClick={() => setSelectedTool("chair")}>Chair</button>
          <button onClick={() => setSelectedTool("table")}>Table</button>
          <button onClick={() => setSelectedTool("stage")}>Stage</button>
          <button onClick={() => setSelectedTool("multi-chair")}>
            Multi Chair
          </button>
          <button onClick={() => setSelectedTool("chair-row")}>
            Chair Row
          </button>
          <label>
            Columns:{" "}
            <input
              type="number"
              min="1"
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
              className="border w-16 px-1"
            />
          </label>
          <label>
            Rows:{" "}
            <input
              type="number"
              min="1"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="border w-16 px-1"
            />
          </label>
          <button onClick={clearElements}>Clear All</button>
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
          className="border rounded-md shadow overflow-hidden"
        >
          <Layer>
            {gridLines}
            {elements.map((el) => (
              <Group
                key={el.id}
                id={el.id.toString()}
                x={el.x}
                y={el.y}
                rotation={el.rotation}
                draggable
                ref={(node) => (shapeRefs.current[el.id] = node)}
                onDragEnd={(e) => {
                  const node = e.target;
                  const id = el.id.toString();

                  const newX = node.x();
                  const newY = node.y();

                  node.position({ x: newX, y: newY });

                  setHistory([...history, elements]);
                  setElements((prev) =>
                    prev.map((item) =>
                      item.id.toString() === id
                        ? { ...item, x: newX, y: newY }
                        : item
                    )
                  );
                  setFuture([]);
                }}
                onClick={() => setSelectedIds([el.id.toString()])}
              >
                {el.type === "chair" && <ChairImage x={el.x} y={el.y} />}
                {(el.type === "table" || el.type === "stage") && (
                  <Rect
                    width={el.width}
                    height={el.height}
                    fill={el.type === "table" ? "#000000" : "#E6DDED"}
                    cornerRadius={el.type === "table" ? 8 : 0}
                    onMouseOver={() => {
                      document.body.style.cursor = "pointer";
                    }}
                    onMouseOut={() => {
                      document.body.style.cursor = "default";
                    }}
                  />
                )}
                {(el.type === "table" || el.type === "stage") && (
                  <Text
                    text={el.type.charAt(0).toUpperCase() + el.type.slice(1)}
                    fontSize={el.type === "stage" ? 24 : 14}
                    fill={el.type === "stage" ? "#4F3262" : "white"}
                    fontStyle={el.type === "stage" ? 900 : 500}
                    offsetY={-el.height / 2 + 5}
                    align="center"
                    width={el.width}
                    onMouseOver={() => {
                      document.body.style.cursor = "pointer";
                    }}
                  />
                )}
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
              borderStroke="#000"
              borderStrokeWidth={3}
              anchorFill="#fff"
              anchorStroke="#000"
              anchorStrokeWidth={1}
              anchorSize={10}
              anchorCornerRadius={50}
              onTransformEnd={() => {
                if (!transformerRef.current) return;

                const nodes = transformerRef.current.nodes();
                if (nodes.length === 0) return;

                setHistory((prev) => [
                  ...prev,
                  JSON.parse(JSON.stringify(elements)),
                ]);
                setFuture([]);

                const updatedElements = elements.map((el) => {
                  const node = nodes.find((n) => n.id() === el.id.toString());
                  if (!node) return el;

                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();

                  node.scaleX(1);
                  node.scaleY(1);

                  return {
                    ...el,
                    x: node.x(),
                    y: node.y(),
                    rotation: node.rotation(),
                    width: Math.max(10, el.width * scaleX),
                    height: Math.max(10, el.height * scaleY),
                  };
                });

                setElements(updatedElements);
              }}
            />
          </Layer>
        </Stage>
        <div className="toolbar bg-white shadow-md border p-1 flex flex-wrap gap-4 items-center justify-center rounded-lg">
          <button
            onClick={() => setSelectedTool("select")}
            className={`btn p-1 ${selectedTool === "select" ? "bg-purple-200" : ""}`}
          >
            <img src={pointerIcon} width={35} height={5} alt="pointer" />
          </button>

          <button
            onClick={() => setSelectedTool("hand")}
            className={`btn p-1 ${selectedTool === "hand" ? "bg-purple-200" : ""}`}
          >
            <img src={handFree} width={35} height={5} alt="hand" />
          </button>

          <button
            onClick={undo}
            disabled={history.length === 0}
            className="btn"
          >
            <img src={undoIcon} width={35} height={5} alt="undo" />
          </button>

          <button onClick={redo} disabled={future.length === 0} className="btn">
            <img src={redoIcon} width={35} height={5} alt="redo" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatingMapBuilder;
