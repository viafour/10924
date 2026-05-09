import type { ActiveDialogue } from "../dialogue/dialogueState";

export class DialogueBox {
  private readonly root: HTMLDivElement;
  private readonly name: HTMLHeadingElement;
  private readonly text: HTMLParagraphElement;
  private readonly progress: HTMLSpanElement;
  private onAdvance: (() => void) | null = null;

  constructor(parent: HTMLElement) {
    this.root = document.createElement("div");
    this.root.className = "dialogue-box";
    this.root.hidden = true;

    this.name = document.createElement("h2");
    this.name.className = "dialogue-box__name";

    this.text = document.createElement("p");
    this.text.className = "dialogue-box__text";

    this.progress = document.createElement("span");
    this.progress.className = "dialogue-box__progress";

    this.root.append(this.name, this.text, this.progress);
    this.root.addEventListener("click", () => {
      this.onAdvance?.();
    });

    parent.appendChild(this.root);
  }

  setAdvanceHandler(handler: () => void): void {
    this.onAdvance = handler;
  }

  show(dialogue: ActiveDialogue): void {
    this.name.textContent = dialogue.npcName;
    this.text.textContent = dialogue.line;
    this.progress.textContent = `${dialogue.lineIndex + 1} / ${dialogue.totalLines} - continue`;
    this.root.hidden = false;
  }

  hide(): void {
    this.root.hidden = true;
  }
}
