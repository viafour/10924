export type GridPoint = {
  x: number;
  y: number;
};

export type ScreenPoint = {
  x: number;
  y: number;
};

export const tileWidth = 96;
export const tileHeight = 48;

export function gridToScreen(point: GridPoint): ScreenPoint {
  return {
    x: (point.x - point.y) * (tileWidth / 2),
    y: (point.x + point.y) * (tileHeight / 2)
  };
}

export function screenToGrid(point: ScreenPoint): GridPoint {
  return {
    x: point.y / tileHeight + point.x / tileWidth,
    y: point.y / tileHeight - point.x / tileWidth
  };
}
