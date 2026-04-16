import * as vscode from "vscode";

type Block = {
  fullStart: number;
  fullEnd: number;
  innerStart: number;
  innerEnd: number;
};

function findBlocks(text: string): Block[] {
  const regex = /^```md[ \t]*\r?\n([\s\S]*?)\r?\n```/gm;
  const blocks: Block[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text))) {
    const fullStart = match.index;
    const fullEnd = fullStart + match[0].length;

    const innerText = match[1];
    const firstNewline = match[0].indexOf("\n");

    const innerStart = fullStart + firstNewline + 1;
    const innerEnd = innerStart + innerText.length;

    blocks.push({ fullStart, fullEnd, innerStart, innerEnd });
  }

  return blocks;
}

function getOffset(doc: vscode.TextDocument, pos: vscode.Position) {
  return doc.offsetAt(pos);
}

function getPosition(doc: vscode.TextDocument, offset: number) {
  return doc.positionAt(offset);
}

function getCurrentBlock(doc: vscode.TextDocument, offset: number) {
  const blocks = findBlocks(doc.getText());
  return blocks.find((b) => offset >= b.fullStart && offset <= b.fullEnd);
}

function getNextBlock(doc: vscode.TextDocument, offset: number) {
  const blocks = findBlocks(doc.getText());
  return blocks.find((b) => b.fullStart > offset);
}

async function copyBlock(editor: vscode.TextEditor, block: Block) {
  const start = getPosition(editor.document, block.innerStart);
  const end = getPosition(editor.document, block.innerEnd);

  editor.selection = new vscode.Selection(start, end);
  editor.revealRange(new vscode.Range(start, end));

  const text = editor.document.getText(new vscode.Range(start, end));
  await vscode.env.clipboard.writeText(text);
}

export function activate(context: vscode.ExtensionContext) {
  const copyCurrent = vscode.commands.registerCommand(
    "md.copyCurrent",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const offset = getOffset(editor.document, editor.selection.active);
      const block = getCurrentBlock(editor.document, offset);

      if (!block) {
        vscode.window.showInformationMessage("Kein md-Block gefunden");
        return;
      }

      await copyBlock(editor, block);
    },
  );

  const copyNext = vscode.commands.registerCommand("md.copyNext", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const offset = getOffset(editor.document, editor.selection.active);

    const current = getCurrentBlock(editor.document, offset);
    const startOffset = current ? current.fullEnd : offset;

    const next = getNextBlock(editor.document, startOffset);

    if (!next) {
      vscode.window.showInformationMessage("Kein weiterer md-Block");
      return;
    }

    await copyBlock(editor, next);
  });

  context.subscriptions.push(copyCurrent, copyNext);
}
