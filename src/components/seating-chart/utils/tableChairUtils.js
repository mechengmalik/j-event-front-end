// src/utils/tableChairUtils.js
import { ELEMENT_TYPES, DEFAULT_CHAIR_SIZE, SHAPES } from '../constants'; // Adjust path

/**
 * Calculates positions and rotations for chairs around a table element.
 * Returns an array of complete chair element objects.
 */
export const calculateTableChairPositions = (tableElement) => {
    const chairs = [];
    const {
        id: tableId,
        x: tableX, y: tableY, rotation = 0, shape,
        width, height, radius, outerRadius, sides = 6,
        chairCount = 0, chairSpacing = 20,
    } = tableElement;

    const validShapes = [SHAPES.RECT, SHAPES.CIRCLE, SHAPES.POLYGON, SHAPES.RING];
    if (chairCount <= 0 || !validShapes.includes(shape)) {
        return [];
    }

    const tableAngleRad = (rotation * Math.PI) / 180;
    const chairWidth = DEFAULT_CHAIR_SIZE.width;
    const chairHeight = DEFAULT_CHAIR_SIZE.height;
    const placementRadiusOffset = chairHeight / 2 + chairSpacing;
    const gap = 10;
    let seatCounter = 1;

    // --- RECTANGLE ---
    if (shape === SHAPES.RECT) {
        // ... (Keep the corrected RECT logic from artifact: table_chair_util)
        // Ensure the objects pushed to 'chairs' array have all necessary chair props:
        // id, type, x, y, rotation, offsetX, offsetY, width, height, tableId, seatNumber, isReserved, fill, listening
        const tableWidth = width || 100; const tableHeight = height || 60;
        const halfWidth = tableWidth / 2; const halfHeight = tableHeight / 2;
        const points = [];
        const capacityTopBottom = Math.max(0, Math.floor(tableWidth / (chairWidth + gap)));
        const capacityLeftRight = Math.max(0, Math.floor(tableHeight / (chairHeight + gap)));
        let chairsToPlace = chairCount; let numTop = 0, numBottom = 0, numLeft = 0, numRight = 0;
        if (tableWidth >= tableHeight) { /* ...distribution logic... */ } else { /* ...distribution logic... */ }
        let finalCount = Math.min(chairCount, numTop + numBottom + numLeft + numRight);
        const generateEdgePoints = (num, edgeLength, fixedCoord, varName, fixedName, chairRot) => { /* ... */ };
        let currentPlaced = 0;
        const topPoints = generateEdgePoints(Math.min(numTop, finalCount - currentPlaced), tableWidth, -halfHeight - placementRadiusOffset, 'x', 'y', 180); // Pointing DOWN towards table
        points.push(...topPoints); currentPlaced += topPoints.length;
        const bottomPoints = generateEdgePoints(Math.min(numBottom, finalCount - currentPlaced), tableWidth, halfHeight + placementRadiusOffset, 'x', 'y', 0); // Pointing UP towards table
        points.push(...bottomPoints); currentPlaced += bottomPoints.length;
        const leftPoints = generateEdgePoints(Math.min(numLeft, finalCount - currentPlaced), tableHeight, -halfWidth - placementRadiusOffset, 'y', 'x', 90); // Pointing RIGHT towards table
        points.push(...leftPoints); currentPlaced += leftPoints.length;
        const rightPoints = generateEdgePoints(Math.min(numRight, finalCount - currentPlaced), tableHeight, halfWidth + placementRadiusOffset, 'y', 'x', -90); // Pointing LEFT towards table
        points.push(...rightPoints);

         points.forEach((p, index) => {
            const chairId = `tchair-${tableId}-${index}`;
            const rotatedX = p.x * Math.cos(tableAngleRad) - p.y * Math.sin(tableAngleRad);
            const rotatedY = p.x * Math.sin(tableAngleRad) + p.y * Math.cos(tableAngleRad);
            const finalX = tableX + rotatedX; const finalY = tableY + rotatedY;
            const finalRotation = rotation + p.rot;
            chairs.push({
                id: chairId, type: ELEMENT_TYPES.CHAIR, x: finalX, y: finalY, rotation: finalRotation,
                offsetX: chairWidth / 2, offsetY: chairHeight / 2, width: chairWidth, height: chairHeight,
                tableId: tableId, seatNumber: seatCounter++, isReserved: false, fill: "#4A5568", listening: true,
            });
         });
    }
    // --- CIRCLE or RING ---
    else if (shape === SHAPES.CIRCLE || shape === SHAPES.RING) {
        // ... (Keep the corrected CIRCLE/RING logic from artifact: table_chair_util)
        // Ensure the objects pushed to 'chairs' array have all necessary chair props
        const tableOuterRadius = (shape === SHAPES.RING ? outerRadius : radius) || 50;
        const placementRadius = tableOuterRadius + placementRadiusOffset;
        const angleStep = (chairCount > 0) ? (2 * Math.PI) / chairCount : 0;
        for (let i = 0; i < chairCount; i++) {
            const angle = i * angleStep; const chairId = `tchair-${tableId}-${i}`;
            const relativeX = placementRadius * Math.sin(angle); const relativeY = -placementRadius * Math.cos(angle);
            const rotatedX = relativeX * Math.cos(tableAngleRad) - relativeY * Math.sin(tableAngleRad);
            const rotatedY = relativeX * Math.sin(tableAngleRad) + relativeY * Math.cos(tableAngleRad);
            const finalX = tableX + rotatedX; const finalY = tableY + rotatedY;
            const chairRelativeRotation = (angle * 180 / Math.PI); // Point towards center
            const finalRotation = rotation + chairRelativeRotation;
            chairs.push({
                id: chairId, type: ELEMENT_TYPES.CHAIR, x: finalX, y: finalY, rotation: finalRotation,
                offsetX: chairWidth / 2, offsetY: chairHeight / 2, width: chairWidth, height: chairHeight,
                tableId: tableId, seatNumber: seatCounter++, isReserved: false, fill: "#4A5568", listening: true,
            });
        }
    }
    // --- POLYGON ---
    else if (shape === SHAPES.POLYGON) {
        // ... (Keep the corrected POLYGON logic from artifact: table_chair_util)
        // Ensure the objects pushed to 'chairs' array have all necessary chair props
        const polyRadius = radius || 60; const numSides = sides || 6; if (numSides < 3) return [];
        const anglePerSideVertex = (2 * Math.PI) / numSides; const sideLength = 2 * polyRadius * Math.sin(anglePerSideVertex / 2);
        const apothem = polyRadius * Math.cos(anglePerSideVertex / 2);
        const capacityPerSide = Math.max(0, Math.floor(sideLength / (chairWidth + gap)));
        const totalCapacity = numSides * capacityPerSide; if (totalCapacity === 0) return [];
        let chairsToPlace = Math.min(chairCount, totalCapacity);
        const chairsPerSideBase = Math.floor(chairsToPlace / numSides); let remainingChairs = chairsToPlace % numSides;
        for (let side = 0; side < numSides; side++) {
            const numOnThisSide = chairsPerSideBase + (remainingChairs > 0 ? 1 : 0); if (numOnThisSide === 0) continue; if (remainingChairs > 0) remainingChairs--;
            const sideMidAngleRad = side * anglePerSideVertex; const sideNormalAngleRad = sideMidAngleRad;
            const sideTangentAngleRad = sideNormalAngleRad + Math.PI / 2;
            const midX_relative = apothem * Math.sin(sideMidAngleRad); const midY_relative = -apothem * Math.cos(sideMidAngleRad);
            const placementDist = apothem + placementRadiusOffset;
            const totalChairSpan = numOnThisSide * chairWidth + Math.max(0, numOnThisSide - 1) * gap;
            let startOffsetAlongSide = -totalChairSpan / 2 + chairWidth / 2;
            for (let i = 0; i < numOnThisSide; i++) {
                const chairId = `tchair-${tableId}-${side}-${i}`;
                const offsetAlongSide = startOffsetAlongSide + i * (chairWidth + gap);
                let relativeX = midX_relative + offsetAlongSide * Math.cos(sideTangentAngleRad) + placementDist * Math.sin(sideNormalAngleRad);
                let relativeY = midY_relative + offsetAlongSide * Math.sin(sideTangentAngleRad) - placementDist * Math.cos(sideNormalAngleRad);
                const chairRelativeRotation = (sideNormalAngleRad * 180 / Math.PI) + 180;
                const finalRotation = rotation + chairRelativeRotation;
                const rotatedX = relativeX * Math.cos(tableAngleRad) - relativeY * Math.sin(tableAngleRad);
                const rotatedY = relativeX * Math.sin(tableAngleRad) + relativeY * Math.cos(tableAngleRad);
                const finalX = tableX + rotatedX; const finalY = tableY + rotatedY;
                chairs.push({
                    id: chairId, type: ELEMENT_TYPES.CHAIR, x: finalX, y: finalY, rotation: finalRotation,
                    offsetX: chairWidth / 2, offsetY: chairHeight / 2, width: chairWidth, height: chairHeight,
                    tableId: tableId, seatNumber: seatCounter++, isReserved: false, fill: "#4A5568", listening: true,
                });
            }
        }
    }
    return chairs;
};
