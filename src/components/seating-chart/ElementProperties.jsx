// src/components/SeatingMapBuilder/ElementProperties.jsx
import React from 'react';
import { SHAPES, ELEMENT_TYPES, MIN_SIZE } from './constants'; // Adjust path if needed

const ElementProperties = ({ element, onUpdate, onDelete, onSave, onCopy}) => {
  // Show placeholder if no element or an unsuitable element is selected
  if (!element || element.sectionId || element.type === ELEMENT_TYPES.SECTION_BOUNDARY || element.type === ELEMENT_TYPES.CHAIR) {
       return <p className="text-xs text-gray-500 text-center mt-4">Select an independent table, stage, floor, etc.</p>;
  }

  // Handler for numeric/integer input changes
  const handleChange = (prop, value, isNumeric = false, isInt = false) => {
      let parsedValue = value;
      if (isNumeric) parsedValue = parseFloat(value) || 0;
      if (isInt) parsedValue = parseInt(value, 10) || 0;
      // Pass element.id and the update object { [prop]: parsedValue }
      onUpdate(element.id, { [prop]: parsedValue }, false); // Don't save on every change
  };

  const handleTextChange = (prop, value) => {
    onUpdate(element.id, { [prop]: value }, false); // For text inputs
};

  // Handler for saving state on blur
   const handleBlur = () => {
      onSave(); // Trigger save state
  }

  // Handler for color changes (saves immediately)
  const handleColorChange = (value) => {
      const updates = element.type === ELEMENT_TYPES.FLOOR
          ? { stroke: value, textBgFill: value } // Update both for floor
          : { fill: value };
      onUpdate(element.id, updates, true); // Save color immediately
  }

  const shapesWithChairs = [SHAPES.CIRCLE, SHAPES.RING];
  const canHaveChairs = element.type === ELEMENT_TYPES.TABLE && shapesWithChairs.includes(element.shape);


  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">Element Properties</h4>
      {element.type === ELEMENT_TYPES.TABLE && (
        <label className="block text-xs font-medium text-gray-700"> Table Name
            <input
                type="text"
                value={element.name || ""}
                onChange={(e) => handleTextChange('name', e.target.value)}
                onBlur={handleBlur}
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
            />
        </label>
      )}
      {/* Color Picker */}
      {element.type  && (
           <label className="block text-xs font-medium text-gray-700"> Fill Color
               <input type="color" value={element.fill || "#888888"} onChange={(e) => handleColorChange(e.target.value)}
                   className="mt-1 block w-full h-8 px-1 py-1 border rounded" />
           </label>
       )}
      {/* Details Separator */}
      <p className="text-xs font-semibold text-gray-600 pt-2 border-t mt-2">Details:</p>

       {/* Shape Selector (Table/Stage) */}
       {(element.type === ELEMENT_TYPES.TABLE || element.type === ELEMENT_TYPES.STAGE) && (
          <label className="block text-xs font-medium text-gray-700"> Shape
              <select value={element.shape || ""} onChange={(e) => handleChange('shape', e.target.value)} onBlur={handleBlur}
                  className="mt-1 w-full px-2 py-1 border rounded text-xs" >
                  <option value="" disabled>Select</option>
                  {Object.values(SHAPES).map((s) => ( <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option> ))}
              </select>
          </label>
       )}


        {/* Rect */}
        {element.shape === SHAPES.RECT && (
            <>
            <label className="block text-xs font-medium text-gray-700"> Width
                <input type="number" min={MIN_SIZE} step="1" value={element.width?.toFixed(0) || ""}
                    onChange={(e) => handleChange('width', e.target.value, true)} onBlur={handleBlur}
                    className="mt-1 w-full px-2 py-1 border rounded text-xs" />
            </label>
             <label className="block text-xs font-medium text-gray-700"> Height
                <input type="number" min={MIN_SIZE} step="1" value={element.height?.toFixed(0) || ""}
                    onChange={(e) => handleChange('height', e.target.value, true)} onBlur={handleBlur}
                    className="mt-1 w-full px-2 py-1 border rounded text-xs" />
            </label>
            </>
        )}

         {/* Radius (Outer) for Circle, Wedge, Polygon, Star */}
         {[SHAPES.CIRCLE, SHAPES.WEDGE, SHAPES.POLYGON, SHAPES.STAR].includes(element.shape) && (
             <label className="block text-xs font-medium text-gray-700"> Radius{element.shape === SHAPES.STAR ? " (Outer)" : ""}
                <input type="number" min={MIN_SIZE} step="1" value={element.radius?.toFixed(0) || ""}
                     onChange={(e) => handleChange('radius', e.target.value, true)} onBlur={handleBlur}
                     className="mt-1 w-full px-2 py-1 border rounded text-xs" />
             </label>
         )}

         {/* Inner Radius for Ring, Arc, Star */}
         {[SHAPES.RING, SHAPES.ARC, SHAPES.STAR].includes(element.shape) && (
              <label className="block text-xs font-medium text-gray-700"> Inner Radius
                 <input type="number" min={MIN_SIZE / 2} step="1" value={element.innerRadius?.toFixed(0) || ""}
                     onChange={(e) => handleChange('innerRadius', e.target.value, true)} onBlur={handleBlur}
                     className="mt-1 w-full px-2 py-1 border rounded text-xs" />
              </label>
          )}

          {/* Outer Radius for Ring, Arc */}
          {[SHAPES.RING, SHAPES.ARC].includes(element.shape) && (
               <label className="block text-xs font-medium text-gray-700"> Outer Radius
                  <input type="number" min={MIN_SIZE} step="1" value={element.outerRadius?.toFixed(0) || ""}
                      onChange={(e) => handleChange('outerRadius', e.target.value, true)} onBlur={handleBlur}
                      className="mt-1 w-full px-2 py-1 border rounded text-xs" />
               </label>
           )}

           {/* Angle for Wedge, Arc */}
           {[SHAPES.WEDGE, SHAPES.ARC].includes(element.shape) && (
                <label className="block text-xs font-medium text-gray-700"> Angle
                   <input type="number" min="1" max="360" step="1" value={element.angle?.toFixed(0) || ""}
                       onChange={(e) => handleChange('angle', e.target.value, false, true)} onBlur={handleBlur}
                       className="mt-1 w-full px-2 py-1 border rounded text-xs" />
                </label>
            )}

            {/* Sides for Polygon */}
            {element.shape === SHAPES.POLYGON && (
                 <label className="block text-xs font-medium text-gray-700"> Sides
                    <input type="number" min="3" step="1" value={element.sides?.toFixed(0) || ""}
                       onChange={(e) => handleChange('sides', e.target.value, false, true)} onBlur={handleBlur}
                        className="mt-1 w-full px-2 py-1 border rounded text-xs" />
                 </label>
             )}

             {/* Points for Star */}
             {element.shape === SHAPES.STAR && (
                  <label className="block text-xs font-medium text-gray-700"> Points
                     <input type="number" min="3" step="1" value={element.numPoints?.toFixed(0) || ""}
                        onChange={(e) => handleChange('numPoints', e.target.value, false, true)} onBlur={handleBlur}
                         className="mt-1 w-full px-2 py-1 border rounded text-xs" />
                  </label>
              )}

        {/* Floor Text (Readonly) */}
        {(element.type === ELEMENT_TYPES.FLOOR || element.type=== ELEMENT_TYPES.TEXT) && (
            <>
                <label className="block text-xs font-medium text-gray-700"> Label
                    <input
                        type="text"
                        value={element.text || ""}
                        // *** Use handleTextChange and handleBlur ***
                        onChange={(e) => handleTextChange('text', e.target.value)}
                        onBlur={handleBlur}
                        className="mt-1 w-full px-2 py-1 border rounded text-xs bg-white" // Not read-only
                        title="Edit floor label"
                    />
                </label>
               
            </>
        )}

        {/* *** Table Chair Inputs *** */}
        {/* *** Conditional Table Chair Inputs *** */}
        {canHaveChairs && (
            <>
                <label className="block text-xs font-medium text-gray-700 pt-2 border-t mt-2">
                    Number of Seats
                    <input
                        type="number" min="0" step="1"
                        value={element.chairCount ?? 0}
                        onChange={(e) => handleChange('chairCount', e.target.value, false, true)}
                        onBlur={handleBlur}
                        className="mt-1 w-full px-2 py-1 border rounded text-xs"
                    />
                </label>
                {(element.chairCount ?? 0) > 0 && (
                    <label className="block text-xs font-medium text-gray-700">
                        Seat Spacing (from edge/radius)
                        <input
                            type="number" min="5" step="1"
                            value={element.chairSpacing ?? 20}
                            onChange={(e) => handleChange('chairSpacing', e.target.value, true)}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-2 py-1 border rounded text-xs"
                        />
                    </label>
                )}
            </>
        )}

      <button
        onClick={() => onDelete()} 
        className="w-full mt-2 p-2 rounded border text-xs bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
      >
        Delete Element
      </button>
      <div className="sidebar">
        <button onClick={onCopy}>Copy</button>
    </div>
    </div>
  );
};

export default ElementProperties;
