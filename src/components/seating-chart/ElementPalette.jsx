import React from "react";
import { TOOLS } from "./constants";
import chairIcon from "../../assets/icons/chair.svg"
import tableIcon from "../../assets/icons/table.svg"
import enteranceIcon from "../../assets/icons/enterance.svg"
import stageIcon from "../../assets/icons/stage.svg"
import floorIcon from "../../assets/icons/floor.svg"
import exitIcon from "../../assets/icons/exit.svg"
import frameIcon from "../../assets/icons/frame.svg"
import venueIcon from "../../assets/icons/venue.svg"


// Basic SVG Icons (Replace with your actual icons or a library)
const icons = {
  [TOOLS.DRAW_SECTION]: (
    <img src={chairIcon} alt="chair" />
  ),
  [TOOLS.PLACE_TABLE]: (
    <img src={tableIcon} alt="tableIcon" />
  ),
  [TOOLS.PLACE_STAGE]: (
    <img src={stageIcon} alt="stageIcon" />
  ),
  [TOOLS.PLACE_FLOOR]: (
    <img src={floorIcon} alt="floorIcon" />
  ),
  [TOOLS.PLACE_ENTRANCE]: (
    <img src={enteranceIcon} alt="enteranceIcon" />
  ),
  [TOOLS.PLACE_EXIT]: (
    <img src={exitIcon} alt="exitIcon" />
  ),
  [TOOLS.TEXT]: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <path d="M6 3L6 21" />
      <path d="M12 3L12 21" />
      <path d="M18 3L18 21" />
    </svg>
  ),
  [TOOLS.TEXT]: (
   <img src={venueIcon} alt="venueIcon" />
  ),
  [TOOLS.TEXT]: (
    <img src={frameIcon} alt="frameIcon" />
  ),
};

const PaletteItem = ({ tool, label, icon, currentTool, onSelect }) => (
  <div className="border border-black/10">
    <button
      title={label}
      onClick={() => onSelect(tool)}
      className={`flex flex-col w-full items-center justify-center p-6 ${
        currentTool === tool
          ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
          : "bg-white border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className="w-10 h-10 flex items-center justify-center">
        {icon || "?"}
      </div>
    </button>
    <div
      className={"bg-gray-100 text-gray-700 text-center w-full py-1 font-normal text-sm"}
    >
      {label}
    </div>
  </div>
);

const ElementPalette = ({ selectedTool, onSelectTool }) => {
  const paletteItems = [
    { tool: TOOLS.PLACE_STAGE, label: "Stage", icon: icons[TOOLS.PLACE_STAGE] },
    { tool: TOOLS.PLACE_FLOOR, label: "Floor", icon: icons[TOOLS.PLACE_FLOOR] },
    {
      tool: TOOLS.DRAW_SECTION,
      label: "Seat",
      icon: icons[TOOLS.DRAW_SECTION],
    },
    { tool: TOOLS.PLACE_TABLE, label: "Table", icon: icons[TOOLS.PLACE_TABLE] },
    {
      tool: TOOLS.PLACE_ENTRANCE,
      label: "Entrance",
      icon: icons[TOOLS.PLACE_ENTRANCE],
    },
    { tool: TOOLS.PLACE_EXIT, label: "Exit", icon: icons[TOOLS.PLACE_EXIT] },
    { tool: TOOLS.TEXT, label: "Text", icon: icons[TOOLS.TEXT] },
    { tool: TOOLS.PLACE_VENUE, label: "Venue", icon: icons[TOOLS.PLACE_VENUE] },
    { tool: TOOLS.PLACE_FRAME, label: "Frame", icon: icons[TOOLS.PLACE_FRAME] },
  ];

  return (
    <div className="bg-white">
      <div className="grid grid-cols-2 gap-0">
        {paletteItems.map((item) => (
          <PaletteItem
            key={item.tool}
            tool={item.tool}
            label={item.label}
            icon={item.icon}
            currentTool={selectedTool}
            onSelect={onSelectTool}
          />
        ))}
      </div>
    </div>
  );
};

export default ElementPalette;
