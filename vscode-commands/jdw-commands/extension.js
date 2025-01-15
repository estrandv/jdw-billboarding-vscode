// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

function replaceAll(context, regex, replaceWith) {
	const textEditor = vscode.window.activeTextEditor;
	if (!textEditor) {
	  vscode.window.showErrorMessage("Editor Does Not Exist");
	  return;
	}
	var m;
	let fullText = textEditor.document.getText();
	
	let textReplace = fullText.replace(regex, replaceWith);
	
	//Creating a new range with startLine, startCharacter & endLine, endCharacter.
	let invalidRange = new vscode.Range(0, 0, textEditor.document.lineCount, 0);
	
	// To ensure that above range is completely contained in this document.
	let validFullRange = textEditor.document.validateRange(invalidRange);
	
	while ((m = regex.exec(fullText)) !== null) {
	  // This is necessary to avoid infinite loops with zero-width matches
	  if (m.index === regex.lastIndex) {
		regex.lastIndex++;
	  }
	
	  textEditor.edit(editBuilder => {
		editBuilder.replace(validFullRange, textReplace);
	  });
	}
}


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jdw-commands" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('jdw-commands.deselectAll', function () {
		const regex = /\*/g; // 'g' flag is for global search 
		replaceAll(context, regex, "");
	});

	context.subscriptions.push(disposable);

	const selectCom = vscode.commands.registerCommand('jdw-commands.selectLine', function () {
		const regex = /\*/g; // 'g' flag is for global search 
		replaceAll(context, regex, "");
		
		const editor = vscode.window.activeTextEditor;
		const cursor = editor.selection;

		// get the range of the current line, I don't think there is an easier way in the api
		const lineText = editor.document.lineAt(cursor.active.line).text; 
		const currentLineRange = editor.document.lineAt(cursor.active.line).range;

		editor.edit(edit => edit.replace(currentLineRange, "*" + lineText));
	
	});
	context.subscriptions.push(selectCom);

	const commentFilters = vscode.commands.registerCommand('jdw-commands.commentFilters', function () {
		const regex = /^>>>/gm; 
		replaceAll(context, regex, "#>>>");
	});
	context.subscriptions.push(commentFilters);



}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
