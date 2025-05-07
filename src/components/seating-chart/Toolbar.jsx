import React from 'react';
import { TOOLS } from './constants';
import selectIcon from '../../assets/icons/select-tool.svg';
import handIcon from '../../assets/icons/hand-free.svg';
import undoIcon from '../../assets/icons/undo.svg';
import redoIcon from '../../assets/icons/redo.svg';

const Toolbar = ({
    selectedTool,
    canUndo,
    canRedo,
    onSelectTool,
    onUndo,
    onRedo,
    onClearAll,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white rounded-lg border border-black/20 shadow-lg p-1 flex items-center space-x-1">
        {/* Select Button */}
       <button onClick={() => onSelectTool(TOOLS.SELECT)} title="Select (V)"
           className={`p-2 rounded transition-colors duration-150 ${selectedTool === TOOLS.SELECT ? "bg-purple-200" : "hover:bg-gray-100"}`}>
           <img src={selectIcon} alt="select" className={`w-5 h-5 ${selectedTool === TOOLS.SELECT ? "text-purple-700" : "text-gray-600"}`} style={{ filter: selectedTool === TOOLS.SELECT ? '' : 'invert(40%)'}}/>
       </button>
        {/* Pan Button */}
        <button onClick={() => onSelectTool(TOOLS.HAND)} title="Pan (H)"
           className={`p-2 rounded transition-colors duration-150 ${selectedTool === TOOLS.HAND ? "bg-purple-200" : "hover:bg-gray-100"}`}>
            <img src={handIcon} alt="hand" className={`w-5 h-5 ${selectedTool === TOOLS.HAND ? "text-purple-700" : "text-gray-600"}`} style={{ filter: selectedTool === TOOLS.HAND ? '' : 'invert(40%)'}}/>
       </button>
       {/* Undo Button */}
        <button onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)"
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
           <img src={undoIcon} alt="undo" className="w-5 h-5 text-gray-600"/>
       </button>
       {/* Redo Button */}
       <button onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)"
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
           <img src={redoIcon} alt="redo" className="w-5 h-5 text-gray-600"/>
       </button>
        {/* Clear All Button */}
       <button onClick={onClearAll} title="Clear All"
            className="px-3 py-2 rounded text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 ml-2">
           Reset
       </button>
   </div>
  );
};

export default Toolbar;