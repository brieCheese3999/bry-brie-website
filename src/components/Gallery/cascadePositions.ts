// cascadePositions.ts
export interface Position {
    x: number;
    y: number;
}

interface CascadeOptions {
    columnStarts: Position[]; // starting position for the first photo in each column — length = number of columns
    stepX?: number;           // horizontal drift per item going down a column (0 = straight column, negative = drifts left)
    stepY?: number;           // vertical step per item going down a column
    itemWidth?: number;
    itemHeight?: number;
    margin?: number;
    bounds?: { width: number; height: number };
}

export function generateCascadePositions(
    count: number,
    options: CascadeOptions
): Position[] {
    const {
        columnStarts,
        stepX = 60,
        stepY = 110,
    } = options;

    const columns = columnStarts.length;
    const positions: Position[] = [];

    for (let i = 0; i < count; i++) {
        const col = i % columns;
        const rowInColumn = Math.floor(i / columns);
        const start = columnStarts[col];

        const x = start.x + rowInColumn * stepX;
        const y = start.y + rowInColumn * stepY;

        positions.push({
            x: x,
            y: y,
        });
    }

    return positions;
}