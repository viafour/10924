import type { DialogueScript } from "./dialogueData";

export type ActiveDialogue = {
  npcId: string;
  npcName: string;
  line: string;
  lineIndex: number;
  totalLines: number;
};

export class DialogueState {
  private script: DialogueScript | null = null;
  private lineIndex = 0;

  open(script: DialogueScript): ActiveDialogue {
    this.script = script;
    this.lineIndex = 0;

    return this.getActiveDialogue();
  }

  advance(): ActiveDialogue | null {
    if (!this.script) {
      return null;
    }

    if (this.lineIndex >= this.script.lines.length - 1) {
      this.close();
      return null;
    }

    this.lineIndex += 1;
    return this.getActiveDialogue();
  }

  close(): void {
    this.script = null;
    this.lineIndex = 0;
  }

  getActiveDialogue(): ActiveDialogue {
    if (!this.script) {
      throw new Error("No active dialogue is open.");
    }

    return {
      npcId: this.script.npcId,
      npcName: this.script.npcName,
      line: this.script.lines[this.lineIndex] ?? "",
      lineIndex: this.lineIndex,
      totalLines: this.script.lines.length
    };
  }

  isOpen(): boolean {
    return this.script !== null;
  }
}
