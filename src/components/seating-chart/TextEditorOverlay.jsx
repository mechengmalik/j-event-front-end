import React, { useRef, useEffect } from 'react';

const TextEditorOverlay = ({ textEditState, onChange, onBlur, onKeyDown }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textEditState.visible && textareaRef.current) {
      textareaRef.current.style.transform = `rotate(${textEditState.rotation || 0}deg)`;
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [textEditState.visible, textEditState.rotation]); // Depend on visibility and rotation

  if (!textEditState.visible) {
    return null;
  }

  return (
    <textarea
      ref={textareaRef}
      value={textEditState.text}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      style={{
        position: "absolute",
        top: `${textEditState.y}px`,
        left: `${textEditState.x}px`,
        width: `${textEditState.width}px`,
        height: `${textEditState.height}px`,
        fontSize: `${textEditState.fontSize}px`,
        border: "1px solid #6b46c1",
        padding: `${textEditState.padding}px`,
        margin: 0,
        overflow: "hidden",
        background: "white",
        color: "black",
        lineHeight: "1.2", // Adjust as needed
        fontFamily: textEditState.fontFamily || "sans-serif",
        textAlign: textEditState.align || "center",
        resize: "none",
        transformOrigin: "0 0",
        zIndex: 1000,
        // Rotation applied in useEffect
      }}
    />
  );
};

export default TextEditorOverlay;