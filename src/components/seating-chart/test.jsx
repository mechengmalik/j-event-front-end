import React, { useState, useEffect, useRef } from "react";

// Generate unique IDs for sections and seats
const generateId = () => `id-${Math.random().toString(36).substr(2, 9)}`;

// Chair drawing function - returns path commands for SVG
const getChairPath = () =>
  "M24.9997 8.33333V20H14.9997V8.33333H24.9997ZM24.9997 5H14.9997C13.1663 5 11.6663 6.5 11.6663 8.33333V23.3333H28.333V8.33333C28.333 6.5 26.833 5 24.9997 5ZM36.6663 16.6667H31.6663V21.6667H36.6663V16.6667ZM8.33301 16.6667H3.33301V21.6667H8.33301V16.6667ZM33.333 25H6.66634V35H9.99967V28.3333H29.9997V35H33.333V25Z";

// Chair SVG component
const ChairImage = ({ x, y, selected, onClick, id }) => {
  return (
    <g
      transform={`translate(${x - 10}, ${y - 10}) scale(0.5)`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
      style={{ cursor: "pointer" }}
      data-seat-id={id}
    >
      <path d={getChairPath()} fill={selected ? "#ff0000" : "#000000"} />
      {selected && (
        <circle
          cx="20"
          cy="20"
          r="30"
          stroke="#ff0000"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4,4"
        />
      )}
    </g>
  );
};

const SeatSectionDrawer = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [newSection, setNewSection] = useState(null);
  const [sections, setSections] = useState([]);
  const [seats, setSeats] = useState([]);
  console.log("🚀 ~ SeatSectionDrawer ~ seats:", seats);

  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [draggedSeat, setDraggedSeat] = useState(null);

  const svgRef = useRef(null);

  const seatRadius = 10;
  const defaultSpacing = 40;
  const defaultCurve = 0;

  // Get mouse position relative to SVG
  const getMousePosition = (evt) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  };

  const handleMouseDown = (e) => {
    // Check if we're clicking on a seat
    const target = e.target;
    const seatElement = target.closest("[data-seat-id]");

    if (seatElement) {
      // Handle seat click - this is now done in the ChairImage onClick
      return;
    }

    // Check if we're clicking on a section
    const sectionElement = target.closest("[data-section-id]");
    if (sectionElement) {
      const sectionId = sectionElement.getAttribute("data-section-id");
      const sectionIndex = sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex !== -1) {
        setSelectedSectionIndex(sectionIndex);
        setSelectedSeatId(null);
        return;
      }
    }

    // If we get here, we're clicking on the canvas background
    const { x, y } = getMousePosition(e);

    // Check if clicked inside existing section (for when section rect is missed)
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      if (
        x >= sec.x &&
        x <= sec.x + sec.cols * sec.colSpacing &&
        y >= sec.y &&
        y <= sec.y + sec.rows * sec.rowSpacing
      ) {
        setSelectedSectionIndex(i);
        setSelectedSeatId(null);
        return;
      }
    }

    // Start drawing a new section
    setIsDrawing(true);
    setNewSection({
      id: generateId(),
      x,
      y,
      width: 0,
      height: 0,
      rows: 0,
      cols: 0,
      rotation: 0,
    });
    setSelectedSectionIndex(null);
    setSelectedSeatId(null);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !newSection) return;

    const { x, y } = getMousePosition(e);
    const width = x - newSection.x;
    const height = y - newSection.y;

    const cols = Math.max(1, Math.floor(Math.abs(width) / defaultSpacing));
    const rows = Math.max(1, Math.floor(Math.abs(height) / defaultSpacing));
    setNewSection({ ...newSection, width, height, rows, cols });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !newSection) return;

    setIsDrawing(false);

    if (Math.abs(newSection.width) < 20 || Math.abs(newSection.height) < 20) {
      setNewSection(null);
      return; // don't add tiny sections
    }

    const width = Math.abs(newSection.width);
    const height = Math.abs(newSection.height);

    const sectionId = newSection.id;

    const normalized = {
      id: sectionId,
      x: Math.min(newSection.x, newSection.x + newSection.width),
      y: Math.min(newSection.y, newSection.y + newSection.height),
      width,
      height,
      rows: newSection.rows,
      cols: newSection.cols,
      rowSpacing: defaultSpacing,
      colSpacing: defaultSpacing,
      curveAngle: defaultCurve,
      curveRadius: Math.max(width / 2, 200),
      rotation: 0,
    };

    const updatedSections = [...sections, normalized];
    setSections(updatedSections);

    // Generate seats for the new section
    const newSeats = generateSeatsForSection(normalized);
    setSeats([...seats, ...newSeats]);

    setNewSection(null);
  };

  const generateSeatsForSection = (section) => {
    const seatPositions = calculateCurvedSeatPositions(section);
    return seatPositions.map((pos) => ({
      id: generateId(),
      sectionId: section.id,
      rowIdx: pos.rowIdx,
      colIdx: pos.colIdx,
      x: pos.x,
      y: pos.y,
      originalX: pos.x, // Save original position for resets
      originalY: pos.y,
      isDragged: false, // Flag to track if seat was manually repositioned
    }));
  };

  // Update seat positions when section properties change
  useEffect(() => {
    if (selectedSectionIndex === null) return;

    const section = sections[selectedSectionIndex];

    // Calculate new positions based on section properties
    const newPositions = calculateCurvedSeatPositions(section);

    // Update seat positions that haven't been manually dragged
    const updatedSeats = seats.map((seat) => {
      if (seat.sectionId === section.id && !seat.isDragged) {
        // Find the corresponding position in new calculations
        const newPos = newPositions.find(
          (pos) => pos.rowIdx === seat.rowIdx && pos.colIdx === seat.colIdx
        );

        if (newPos) {
          return {
            ...seat,
            x: newPos.x,
            y: newPos.y,
            originalX: newPos.x,
            originalY: newPos.y,
          };
        }
      }
      return seat;
    });

    setSeats(updatedSeats);
  }, [sections]);

  const handleSpacingChange = (type, value) => {
    if (selectedSectionIndex === null) return;

    const updatedSections = [...sections];
    const section = updatedSections[selectedSectionIndex];

    if (type === "row") section.rowSpacing = Number(value);
    else if (type === "col") section.colSpacing = Number(value);
    else if (type === "curve") section.curveAngle = Number(value);
    else if (type === "radius") section.curveRadius = Number(value);

    setSections(updatedSections);
  };

  const updateSectionDimensions = (type, delta) => {
    if (selectedSectionIndex === null) return;

    const updated = [...sections];
    const sec = updated[selectedSectionIndex];

    if (type === "rows") {
      sec.rows = Math.max(1, sec.rows + delta);
      sec.height = sec.rows * sec.rowSpacing;
    } else if (type === "cols") {
      sec.cols = Math.max(1, sec.cols + delta);
      sec.width = sec.cols * sec.colSpacing;
    }

    setSections(updated);

    // When adding rows/columns, create new seats
    if (delta > 0) {
      const existingSeats = seats.filter((seat) => seat.sectionId === sec.id);
      const newSeatPositions = calculateCurvedSeatPositions(sec);

      // Filter out positions that don't already have seats
      const newPositions = newSeatPositions.filter(
        (newPos) =>
          !existingSeats.some(
            (seat) =>
              seat.rowIdx === newPos.rowIdx && seat.colIdx === newPos.colIdx
          )
      );

      // Create new seats for these positions
      const newSeats = newPositions.map((pos) => ({
        id: generateId(),
        sectionId: sec.id,
        rowIdx: pos.rowIdx,
        colIdx: pos.colIdx,
        x: pos.x,
        y: pos.y,
        originalX: pos.x,
        originalY: pos.y,
        isDragged: false,
      }));

      setSeats([...seats, ...newSeats]);
    } else if (delta < 0) {
      // When removing rows/columns, remove corresponding seats
      const updatedSeats = seats.filter((seat) => {
        if (seat.sectionId === sec.id) {
          if (type === "rows" && seat.rowIdx >= sec.rows) return false;
          if (type === "cols" && seat.colIdx >= sec.cols) return false;
        }
        return true;
      });

      setSeats(updatedSeats);
    }
  };

  const calculateCurvedSeatPositions = (section) => {
    const positions = [];
    const {
      x,
      y,
      rows,
      cols,
      rowSpacing,
      colSpacing,
      curveAngle,
      curveRadius,
    } = section;

    const curveRadians = (curveAngle * Math.PI) / 180;

    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
      const rowYBase = y + rowIdx * rowSpacing + rowSpacing / 2;
      const radius = curveRadius + rowIdx * rowSpacing * 0.5;

      for (let colIdx = 0; colIdx < cols; colIdx++) {
        // X stays fixed by colSpacing
        const seatX = x + colIdx * colSpacing + colSpacing / 2;

        if (curveAngle === 0) {
          // No curve
          positions.push({
            rowIdx,
            colIdx,
            x: seatX,
            y: rowYBase,
          });
        } else {
          // Curve only affects Y
          const relativeColPos = cols === 1 ? 0.5 : colIdx / (cols - 1); // 0 to 1
          const angleOffset = (relativeColPos - 0.5) * curveRadians; // -θ/2 to +θ/2

          const curvedY = rowYBase + (1 - Math.cos(angleOffset)) * radius;

          positions.push({
            rowIdx,
            colIdx,
            x: seatX, // stay aligned horizontally
            y: curvedY, // curved vertically
          });
        }
      }
    }

    return positions;
  };

  // Handle seat selection
  const handleSeatClick = (seatId) => {
    setSelectedSeatId(seatId);
    setSelectedSectionIndex(null); // Deselect section when selecting a seat
  };

  // Start seat drag
  const startSeatDrag = (seatId) => {
    setDraggedSeat(seatId);
  };

  // Handle seat drag
  const handleSeatDragEnd = (seatId, newX, newY) => {
    // Update seat position and mark it as manually dragged
    const updatedSeats = seats.map((seat) =>
      seat.id === seatId ? { ...seat, x: newX, y: newY, isDragged: true } : seat
    );

    setSeats(updatedSeats);
    setDraggedSeat(null);
  };

  // Handle seat deletion
  const deleteSeat = (seatId) => {
    setSeats(seats.filter((seat) => seat.id !== seatId));
    setSelectedSeatId(null);
  };

  // Reset seat to original position
  const resetSeatPosition = (seatId) => {
    const updatedSeats = seats.map((seat) =>
      seat.id === seatId
        ? { ...seat, x: seat.originalX, y: seat.originalY, isDragged: false }
        : seat
    );

    setSeats(updatedSeats);
  };

  const deleteSection = (sectionIndex) => {
    if (sectionIndex === null) return;

    const sectionId = sections[sectionIndex].id;

    // Remove the section
    const updatedSections = sections.filter((_, i) => i !== sectionIndex);
    setSections(updatedSections);

    // Remove all seats associated with this section
    const updatedSeats = seats.filter((seat) => seat.sectionId !== sectionId);
    setSeats(updatedSeats);

    setSelectedSectionIndex(null);
  };

  // Calculate SVG view dimensions
  const viewWidth = window.innerWidth - 20;
  const viewHeight = window.innerHeight - 100;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={viewWidth}
        height={viewHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border border-gray-300"
      >
        {/* Render all sections */}
        {sections.map((section, idx) => {
          const isSelected = selectedSectionIndex === idx;

          // Calculate section boundaries
          const minX = section.x - 10;
          const minY = section.y - 10;
          const maxX = section.x + section.cols * section.colSpacing + 10;
          const maxY = section.y + section.rows * section.rowSpacing + 10;
          const width = maxX - minX;
          const height = maxY - minY;

          return (
            <g key={`section-${section.id}`} data-section-id={section.id}>
              {/* Section outline */}
              <rect
                x={minX}
                y={minY}
                width={width}
                height={height}
                stroke={isSelected ? "#ff0000" : "#000000"}
                strokeWidth={1}
                strokeDasharray={isSelected ? "8,4" : "2,2"}
                fill="rgba(200, 200, 200, 0.05)"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSectionIndex(idx);
                  setSelectedSeatId(null);
                }}
              />

              {/* Section label */}
              <text
                x={minX + width / 2}
                y={minY - 10}
                textAnchor="middle"
                fontSize={14}
                fill="#000000"
              >
                Section {idx + 1}
              </text>
            </g>
          );
        })}

        {/* Render all seats */}
        {seats.map((seat) => (
          <ChairImage
            key={`seat-${seat.id}`}
            id={seat.id}
            x={seat.x}
            y={seat.y}
            selected={selectedSeatId === seat.id}
            onClick={handleSeatClick}
          />
        ))}

        {/* Preview of new section being drawn */}
        {newSection && (
          <g>
            <rect
              x={Math.min(newSection.x, newSection.x + newSection.width)}
              y={Math.min(newSection.y, newSection.y + newSection.height)}
              width={Math.abs(newSection.width)}
              height={Math.abs(newSection.height)}
              stroke="#0000ff"
              strokeWidth={2}
              strokeDasharray="4,4"
              fill="rgba(0, 0, 255, 0.05)"
            />
            <text
              x={Math.min(newSection.x, newSection.x + newSection.width) + 10}
              y={Math.min(newSection.y, newSection.y + newSection.height) + 20}
              fontSize={16}
              fill="#000000"
            >
              {`${newSection.cols} x ${newSection.rows}`}
            </text>
          </g>
        )}
      </svg>

      {/* Section Settings Panel */}
      {selectedSectionIndex !== null && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-md shadow-lg w-64 z-10">
          <h3 className="mb-3 font-bold">
            Section {selectedSectionIndex + 1} Settings
          </h3>

          <button
            className="mb-3 bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => deleteSection(selectedSectionIndex)}
          >
            Delete Section
          </button>

          <div className="mb-2">
            <label>Row Spacing: </label>
            <input
              type="range"
              min="20"
              max="150"
              value={sections[selectedSectionIndex].rowSpacing}
              onChange={(e) => handleSpacingChange("row", e.target.value)}
              className="w-full"
            />
            <span> {sections[selectedSectionIndex].rowSpacing}px</span>
          </div>

          <div className="mb-2">
            <label>Column Spacing: </label>
            <input
              type="range"
              min="20"
              max="150"
              value={sections[selectedSectionIndex].colSpacing}
              onChange={(e) => handleSpacingChange("col", e.target.value)}
              className="w-full"
            />
            <span> {sections[selectedSectionIndex].colSpacing}px</span>
          </div>

          <div className="mb-2">
            <label>Curve Angle: </label>
            <input
              type="range"
              min="0"
              max="90"
              value={sections[selectedSectionIndex].curveAngle}
              onChange={(e) => handleSpacingChange("curve", e.target.value)}
              className="w-full"
            />
            <span> {sections[selectedSectionIndex].curveAngle}°</span>
          </div>

          <div className="mb-2">
            <label>Curve Radius: </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="10"
              value={sections[selectedSectionIndex].curveRadius || 200}
              onChange={(e) => handleSpacingChange("radius", e.target.value)}
              className="w-full"
            />
            <span> {sections[selectedSectionIndex].curveRadius || 200}px</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => updateSectionDimensions("rows", 1)}
            >
              + Row
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => updateSectionDimensions("rows", -1)}
            >
              - Row
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => updateSectionDimensions("cols", 1)}
            >
              + Col
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => updateSectionDimensions("cols", -1)}
            >
              - Col
            </button>
          </div>

          <button
            className="mt-3 bg-gray-300 px-3 py-1 rounded"
            onClick={() => setSelectedSectionIndex(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* Seat Settings Panel */}
      {selectedSeatId !== null && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-lg w-64 z-10">
          <h3 className="mb-3 font-bold">Seat Settings</h3>

          <div className="mb-3">
            {seats.find((s) => s.id === selectedSeatId)?.isDragged && (
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                onClick={() => resetSeatPosition(selectedSeatId)}
              >
                Reset Position
              </button>
            )}

            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => deleteSeat(selectedSeatId)}
            >
              Delete Seat
            </button>
          </div>

          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => setSelectedSeatId(null)}
          >
            Close
          </button>
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-lg">
        <p className="text-sm">
          Click and drag to create a new section. Click on a section or seat to
          select it.
        </p>
      </div>
    </div>
  );
};

export default SeatSectionDrawer;
