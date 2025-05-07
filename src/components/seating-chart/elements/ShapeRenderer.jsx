// src/components/SeatingMapBuilder/elements/ShapeRenderer.jsx
import React from 'react';
import { Rect, Circle, RegularPolygon, Ring, Wedge, Arc, Text } from 'react-konva';
import {
    SHAPES,
    DEFAULT_RECT_SIZE, DEFAULT_CIRCLE_RADIUS, DEFAULT_POLYGON_RADIUS,
    DEFAULT_STAR_RADIUS, DEFAULT_RING_INNER_RADIUS, DEFAULT_RING_OUTER_RADIUS,
    DEFAULT_WEDGE_RADIUS, DEFAULT_WEDGE_ANGLE, DEFAULT_ARC_INNER_RADIUS,
    DEFAULT_ARC_OUTER_RADIUS, DEFAULT_ARC_ANGLE,DEFAULT_STAR_INNER_RADIUS_RATIO,DEFAULT_POLYGON_SIDES,DEFAULT_STAR_POINTS
} from '../constants'; // Adjust path if needed

const ShapeRenderer = React.memo(({ element, isSelected }) => {
    // Log the element props when rendering Polygon or Star for debugging
    if (element.shape === SHAPES.POLYGON || element.shape === SHAPES.STAR) {
        console.log(`Rendering ${element.shape}:`, element);
    }

    // Common visual properties
    const commonProps = {
        fill: element.fill || (element.type === "table" ? "#a0aec0" : "#e2e8f0"),
        stroke: isSelected ? "#4299e1" : element.stroke || "transparent",
        strokeWidth: isSelected ? 2 : element.strokeWidth ?? 1,
        shadowEnabled: isSelected,
        shadowColor: 'rgba(66, 153, 225, 0.5)',
        shadowBlur: 5,
        shadowOffset: { x: 0, y: 0 },
    };


    switch (element.shape) {
        case SHAPES.CIRCLE: {
            const radiusC = element.radius || DEFAULT_CIRCLE_RADIUS;
            return <Circle radius={radiusC} {...commonProps} />;
        }
        case SHAPES.ARC: {
             const outerRadiusA = element.outerRadius || DEFAULT_ARC_OUTER_RADIUS;
             const innerRadiusA = element.innerRadius || DEFAULT_ARC_INNER_RADIUS;
            return <Arc innerRadius={innerRadiusA} outerRadius={outerRadiusA} angle={element.angle || DEFAULT_ARC_ANGLE} {...commonProps} />;
        }
        case SHAPES.POLYGON:
        case SHAPES.STAR: {
            const isStar = element.shape === SHAPES.STAR;
            const defaultOuterRadius = isStar ? DEFAULT_STAR_RADIUS : DEFAULT_POLYGON_RADIUS;
            const defaultSides = isStar ? DEFAULT_STAR_POINTS : DEFAULT_POLYGON_SIDES;
            const defaultInnerRadiusRatio = DEFAULT_STAR_INNER_RADIUS_RATIO;

            const outerRad = (element.radius !== undefined && element.radius > 0) ? element.radius : defaultOuterRadius;
            const sidesVal = isStar
                ? (element.numPoints !== undefined && element.numPoints >= 3 ? element.numPoints : defaultSides)
                : (element.sides !== undefined && element.sides >= 3 ? element.sides : defaultSides);
            const innerRad = isStar
                ? (element.innerRadius !== undefined && element.innerRadius > 0 && element.innerRadius < outerRad ? element.innerRadius : outerRad * defaultInnerRadiusRatio)
                : undefined;

            if (outerRad <= 0 || sidesVal < 3 || (isStar && innerRad >= outerRad)) {
                console.error(`Invalid dimensions for ${element.shape} ${element.id}:`, { outerRad, sidesVal, innerRad });
                return null;
            }
            return (
                <RegularPolygon
                    outerRadius={outerRad}
                    innerRadius={innerRad}
                    sides={sidesVal}
                    {...commonProps}
                />
            );
         }
         case SHAPES.RING: {
            const outerRadiusR = element.outerRadius || DEFAULT_RING_OUTER_RADIUS;
            const innerRadiusR = element.innerRadius || DEFAULT_RING_INNER_RADIUS;
             return <Ring innerRadius={innerRadiusR} outerRadius={outerRadiusR} {...commonProps} />;
         }
         case SHAPES.WEDGE: {
             const radiusW = element.radius || DEFAULT_WEDGE_RADIUS;
             return <Wedge radius={radiusW} angle={element.angle || DEFAULT_WEDGE_ANGLE} {...commonProps} />;
         }
         case SHAPES.RECT:
         default:
             { const width = element.width || DEFAULT_RECT_SIZE.width;
             const height = element.height || DEFAULT_RECT_SIZE.height;
             return <Rect width={width} height={height} cornerRadius={element.cornerRadius || 0} {...commonProps} />; }
     }
 });

export default ShapeRenderer;
