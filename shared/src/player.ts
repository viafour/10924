export type WorldPosition = {
  x: number;
  y: number;
};

export type PlayerState = WorldPosition & {
  id: string;
  displayName: string;
};

export type NpcState = WorldPosition & {
  id: string;
  displayName: string;
};

export type WorldSnapshot = {
  localPlayer: PlayerState;
  players: PlayerState[];
  npcs: NpcState[];
};

export type PlayerJoinedPayload = {
  player: PlayerState;
};

export type PlayerMovedPayload = {
  player: PlayerState;
};

export type PlayerLeftPayload = {
  id: string;
};

export type ClientToServerEvents = {
  "player:move": (position: WorldPosition) => void;
};

export type ServerToClientEvents = {
  "world:snapshot": (snapshot: WorldSnapshot) => void;
  "player:joined": (payload: PlayerJoinedPayload) => void;
  "player:moved": (payload: PlayerMovedPayload) => void;
  "player:left": (payload: PlayerLeftPayload) => void;
};
