export type GridPoint = {
  x: number;
  y: number;
};

export type ScreenPoint = {
  x: number;
  y: number;
};

const tileWidth = 96;
const tileHeight = 48;

export function gridToScreen(point: GridPoint): ScreenPoint {
  return {
    x: (point.x - point.y) * (tileWidth / 2),
    y: (point.x + point.y) * (tileHeight / 2)
  };
}
