import type { WorldPosition } from "@10924/shared";

export type MovementResult = {
  position: WorldPosition;
  arrived: boolean;
};

export function moveToward(
  current: WorldPosition,
  target: WorldPosition,
  speedTilesPerSecond: number,
  deltaSeconds: number
): MovementResult {
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const distance = Math.hypot(dx, dy);
  const step = speedTilesPerSecond * deltaSeconds;

  if (distance <= step || distance === 0) {
    return { position: target, arrived: true };
  }

  const scale = step / distance;

  return {
    position: {
      x: current.x + dx * scale,
      y: current.y + dy * scale
    },
    arrived: false
  };
}
