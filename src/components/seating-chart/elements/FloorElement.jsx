import React from 'react';
import { Line, Group, Rect, Text } from 'react-konva';

const FloorElement = React.memo(({ element, isSelected, onTextDblClick }) => {
    const text = element.text || "";
    const fontSize = element.fontSize || 14;
    const textPadding = element.textPadding || 5;
    const textHeight = element.textHeight || 24;
    const backgroundWidth = Math.max(50, (text.length * fontSize * 0.7) + (textPadding * 2)); // Estimate width

    const strokeColor = isSelected ? "#4299e1" : element.stroke || "#4a5568";
    const strokeWidth = isSelected ? 3 : element.strokeWidth || 2;

    // Calculate center point for the text group
    const centerX = ((element.startX ?? 0) + (element.endX ?? 0)) / 2;
    const centerY = ((element.startY ?? 0) + (element.endY ?? 0)) / 2;

    return (
        <>
        <Line
            points={[element.startX ?? 0, element.startY ?? 0, element.endX ?? 0, element.endY ?? 0]}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            lineCap="round"
            hitStrokeWidth={10} // Make line easier to click
        />
        {/* Group for text + background, centered on the line */}
        <Group
            x={centerX}
            y={centerY}
            offsetX={backgroundWidth / 2}
            offsetY={textHeight / 2}
            listening={true} // Group listens for text interaction proxy
            onDblClick={(e) => {
                // Find the Text node within the event path if possible, or just pass element data
                 onTextDblClick(e, element);
            }}
        >
            <Rect
                width={backgroundWidth}
                height={textHeight}
                fill={element.textBgFill || element.stroke || "#4a5568"}
                cornerRadius={4}
                shadowEnabled={isSelected}
                shadowColor={'rgba(66, 153, 225, 0.5)'}
                shadowBlur={5}
            />
            <Text
                text={text}
                fontSize={fontSize}
                fill={element.textFill || "#ffffff"}
                x={0} y={0} // Position relative to group
                width={backgroundWidth} height={textHeight}
                padding={textPadding}
                align="center" verticalAlign="middle"
                listening={true} // Text itself doesn't need listeners if Group handles dblclick
            />
        </Group>
        </>
    );
});

export default FloorElement;