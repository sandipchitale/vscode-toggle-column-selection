const vscode = require('vscode');

function convertToColumnSelection(editor, selection) {
  let startPosition = selection.start;
  let endPosition = selection.end;
  let newSelections = [];
  let linesInSelection = endPosition.line - startPosition.line + 1;
  if (linesInSelection < 2) {
    return;
  }
  // Create a new selection for each line that the currentSelection spans
  for (let i = 0; i < linesInSelection; i++) {
    const thisLine = startPosition.line + i;
    newSelections.push(
      new vscode.Selection(
        thisLine,
        startPosition.character,
        thisLine,
        endPosition.character
      )
    );
  }
  editor.selections = newSelections;
}

function convertToContiguousSelection(editor, selections) {
  // get the `start` of the first selection
  const startPosition = selections[0].start;
  // get the `end` of the last selection
  const endPosition = selections[selections.length - 1].end;
  editor.selection = new vscode.Selection(startPosition, endPosition);
}

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'toggleColumnSelection.toggle',
    function() {
      const editor = vscode.window.activeTextEditor;
      const selections = editor.selections;
      if (!!!selections.length) {
        return;
      } else if (selections.length > 1) {
        convertToContiguousSelection(editor, selections);
      } else {
        convertToColumnSelection(editor, selections[0]);
      }
    }
  );
  context.subscriptions.push(disposable);
}

function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
