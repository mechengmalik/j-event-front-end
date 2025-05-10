import React from "react";
import { TOOLS } from "./constants";
import selectIcon from "../../assets/icons/select-tool.svg";
import handIcon from "../../assets/icons/hand-free.svg";
import undoIcon from "../../assets/icons/undo.svg";
import redoIcon from "../../assets/icons/redo.svg";
import zoomIn from "../../assets/icons/zoom-in.svg";
import zoomOut from "../../assets/icons/zoom-out.svg";
const Toolbar = ({
  selectedTool,
  canUndo,
  canRedo,
  onSelectTool,
  onUndo,
  onRedo,
  onClearAll,
  onZoomReset,
  onZoomOut,
  onZoomIn,
  onZoomInputChange,
  onZoomInputBlur,
  zoomPercentage,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white rounded-lg border border-black/5 p-1 flex justify-between gap-11 items-center space-x-1 p-4">
      <div className="flex gap-2">
        <button
          onClick={() => onSelectTool(TOOLS.SELECT)}
          title="Select (V)"
          className={`p-2 rounded transition-colors duration-150 ${
            selectedTool === TOOLS.SELECT ? "bg-[#8354A3]" : "hover:bg-gray-100"
          }`}
        >
          <img
            src={selectIcon}
            alt="select"
            className={` ${
              selectedTool === TOOLS.SELECT
                ? "text-purple-700"
                : "text-gray-600"
            }`}
            style={{
              filter: selectedTool === TOOLS.SELECT ? "" : "invert(40%)",
            }}
          />
        </button>
        {/* Pan Button */}
        <button
          onClick={() => onSelectTool(TOOLS.HAND)}
          title="Pan (H)"
          className={`p-2 rounded transition-colors duration-150 ${
            selectedTool === TOOLS.HAND ? "bg-[#8354A3]" : "hover:bg-gray-100"
          }`}
        >
          <img
            src={handIcon}
            alt="hand"
            className={` ${
              selectedTool === TOOLS.HAND ? "text-purple-700" : "text-gray-600"
            }`}
            style={{ filter: selectedTool === TOOLS.HAND ? "" : "invert(40%)" }}
          />
        </button>
        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-2 bg-black/10 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={undoIcon} alt="undo" className=" text-gray-600" />
        </button>
        {/* Redo Button */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={redoIcon} alt="redo" className=" text-gray-600" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {" "}
        {/* Align items vertically in the center */}
        <button
          onClick={onZoomIn}
          title="Redo (Ctrl+Y)"
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={zoomIn} alt="redo" className=" text-gray-600 " />{" "}
          {/* Adjust image size if needed */}
        </button>
        <input
          type="number"
          className="shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center w-16 h-8"
          value={zoomPercentage}
          onChange={onZoomInputChange}
          onBlur={onZoomInputBlur}
          min={20}
          max={300}
        />
        <span className="ml-1 text-sm">%</span>{" "}
        {/* Adjust text size if needed */}
        <button
          onClick={onZoomOut}
          title="Redo (Ctrl+Y)"
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={zoomOut} alt="redo" className=" text-gray-600 " />{" "}
          {/* Adjust image size if needed */}
        </button>
        <button
          onClick={onZoomReset}
          title="Clear All"
          className="px-3 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 ml-2 h-8"
        >
          {" "}
          {/* Reduced padding and added fixed height */}
          Reset
        </button>
      </div>

      {/* Clear All Button */}
      {/* <button onClick={onClearAll} title="Clear All"
            className="px-3 py-2 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 ml-2">
           Reset
       </button> */}
    </div>
  );
};

export default Toolbar;
