import React from 'react';
import { TOOLS, ELEMENT_TYPES } from './constants';

// Basic SVG Icons (Replace with your actual icons or a library)
const icons = {
    [TOOLS.DRAW_SECTION]: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M4 18v3h3v-3h10v3h3v-6H4zm15-8h3v3h-3v-3zM2 10h3v3H2v-3zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z"></path></svg>,
    [TOOLS.PLACE_TABLE]: <svg viewBox="0 0 40 40" fill="currentColor" className="w-6 h-6"><path d="M36.6663 12.9001C36.6663 9.68341 29.1997 7.06674 19.9997 7.06674C10.7997 7.06674 3.33301 9.68341 3.33301 12.9001C3.33301 15.9167 9.91634 18.4167 18.333 18.7001V25.4001H15.583C14.2163 25.4001 12.9997 26.2334 12.483 27.5001L9.99967 33.7334H13.333L15.333 28.7334H24.6663L26.6663 33.7334H29.9997L27.4997 27.5001C26.9997 26.2334 25.7663 25.4001 24.4163 25.4001H21.6663V18.7001C30.083 18.4167 36.6663 15.9167 36.6663 12.9001ZM19.9997 10.4001C26.7497 10.4001 31.233 11.8334 32.8663 12.9001C31.233 13.9667 26.7497 15.4001 19.9997 15.4001C13.2497 15.4001 8.76634 13.9667 7.13301 12.9001C8.76634 11.8334 13.2497 10.4001 19.9997 10.4001Z"></path></svg>,
    [TOOLS.PLACE_STAGE]: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18 4v1h-2V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v1H8V4c0-.55-.45-1-1-1s-1 .45-1 1v16c0 .55.45 1 1 1s1-.45 1-1v-3h8v3c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1s-1 .45-1 1zM8 16H6v-2h2v2zm0-3H6v-2h2v2zm0-3H6V8h2v2zm10 6h-2v-2h2v2zm0-3h-2v-2h2v2zm0-3h-2V8h2v2z"></path></svg>,
    [TOOLS.PLACE_FLOOR]: <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 12l16 0" /><path d="M9 10h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1z" /></svg>,
    [TOOLS.PLACE_ENTRANCE]: <svg viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M22.2337 14.4167C20.6837 14.4167 19.417 13.1333 19.417 11.5833C19.417 10.8363 19.7137 10.1199 20.242 9.59166C20.7702 9.06343 21.4866 8.76668 22.2337 8.76668C23.8003 8.76668 25.067 10.0333 25.067 11.5833C25.067 13.1333 23.8003 14.4167 22.2337 14.4167ZM17.167 34.0167L7.28366 32.05L7.85033 29.2167L14.767 30.6333L17.017 19.2L14.4837 20.2V24.9667H11.667V18.3667L19.0003 15.25L20.117 15.1167C21.117 15.1167 21.9503 15.6833 22.5003 16.5333L23.9337 18.7833C25.067 20.8 27.317 22.1667 30.0003 22.1667V24.9667C26.9003 24.9667 24.067 23.5833 22.2337 21.4667L21.4003 25.7L24.3503 28.5167V39.1333H21.5337V30.6333L18.567 27.8167L17.167 34.0167ZM35.0003 39.1333H31.667V5.80001H10.0003V27.65L6.66699 26.95V2.46667H35.0003V39.1333ZM10.0003 39.1333H6.66699V33.7667L10.0003 34.4667V39.1333Z" fill="currentColor"/></svg>,
    [TOOLS.PLACE_EXIT]: <svg viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M35 35.8H5V19.1333C5 17.1635 5.38799 15.2129 6.14181 13.393C6.89563 11.5732 8.00052 9.91958 9.3934 8.5267C10.7863 7.13382 12.4399 6.02893 14.2597 5.27511C16.0796 4.52129 18.0302 4.1333 20 4.1333C21.9698 4.1333 23.9204 4.52129 25.7403 5.27511C27.5601 6.02893 29.2137 7.13382 30.6066 8.5267C31.9995 9.91958 33.1044 11.5732 33.8582 13.393C34.612 15.2129 35 17.1635 35 19.1333V35.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M34.6167 15.8H20V22.4667M13.3333 29.1334V22.4667H35M5 29.1334H35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

const PaletteItem = ({ tool, label, icon, currentTool, onSelect }) => (
  <button
    title={label}
    onClick={() => onSelect(tool)}
    className={`flex flex-col items-center justify-center p-2 rounded border text-xs w-16 h-16 ${ // Fixed size
      currentTool === tool
        ? "bg-blue-100 border-blue-400 text-blue-800 ring-1 ring-blue-500" // Highlight active tool
        : "bg-gray-50 border-gray-300 hover:bg-gray-200"
    }`}
  >
    <div className="w-8 h-8 mb-1 flex items-center justify-center">
      {icon || '?'}
    </div>
    {label}
  </button>
);


const ElementPalette = ({ selectedTool, onSelectTool }) => {
  const paletteItems = [
    { tool: TOOLS.DRAW_SECTION, label: "Seat", icon: icons[TOOLS.DRAW_SECTION] },
    { tool: TOOLS.PLACE_TABLE, label: "Table", icon: icons[TOOLS.PLACE_TABLE] },
    { tool: TOOLS.PLACE_STAGE, label: "Stage", icon: icons[TOOLS.PLACE_STAGE] },
    { tool: TOOLS.PLACE_FLOOR, label: "Floor", icon: icons[TOOLS.PLACE_FLOOR] },
    { tool: TOOLS.PLACE_ENTRANCE, label: "Entrance", icon: icons[TOOLS.PLACE_ENTRANCE] },
    { tool: TOOLS.PLACE_EXIT, label: "Exit", icon: icons[TOOLS.PLACE_EXIT] },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">
        Elements
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {paletteItems.map(item => (
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