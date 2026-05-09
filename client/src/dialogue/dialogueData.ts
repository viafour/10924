export type DialogueScript = {
  npcId: string;
  npcName: string;
  lines: string[];
};

export const dialogueScripts: Record<string, DialogueScript> = {
  naem: {
    npcId: "naem",
    npcName: "Naem",
    lines: [
      "The wind carries old names here.",
      "Most who pass through this place are looking for a path. Fewer ask what the path remembers.",
      "Stay if you must. Druz is patient with strangers, but not kind."
    ]
  }
};

export function getDialogueScript(npcId: string): DialogueScript | null {
  return dialogueScripts[npcId] ?? null;
}
