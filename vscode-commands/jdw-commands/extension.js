// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');
const os = require('os');
const path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

async function replaceAll(context, regex, replaceWith) {
	const textEditor = vscode.window.activeTextEditor;
	if (!textEditor) {
		vscode.window.showErrorMessage("Editor Does Not Exist");
		return;
	}
	
	let fullText = textEditor.document.getText();
	let textReplace = fullText.replace(regex, replaceWith);
	let invalidRange = new vscode.Range(0, 0, textEditor.document.lineCount, 0);
	let validFullRange = textEditor.document.validateRange(invalidRange);
	
	await textEditor.edit(editBuilder => {
		editBuilder.replace(validFullRange, textReplace);
	});
}

function runWithCurrentFile(context, script_path) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage("No active file open.");
		return;
	}

	const document = editor.document;
	if (document.isUntitled) {
		vscode.window.showWarningMessage("Please save the file before running the script.");
		return;
	}

	const filePath = editor.document.uri.fsPath; // ✅ absolute path

	if (!filePath.includes('.bbd')) {
		vscode.window.showErrorMessage(`Current open file is not in .bbd format and cannote be used for the command`);
		return;
	}


	// Quote the paths to safely handle spaces or special characters
	const command = `bash "${script_path}" "${filePath}"`;

	exec(command, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Script error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`stderr: ${stderr}`);
		}
		vscode.window.showInformationMessage(`JDW: Command executed!`);
	});
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

	const selectCom = vscode.commands.registerCommand('jdw-commands.selectLine', async function () {
		const regex = /\*+@/g; // 'g' flag is for global search 
		await replaceAll(context, regex, "@");
		
		const editor = vscode.window.activeTextEditor;
		const cursor = editor.selection;

		// get the range of the current line, I don't think there is an easier way in the api
		const lineText = editor.document.lineAt(cursor.active.line).text; 
		const currentLineRange = editor.document.lineAt(cursor.active.line).range;

		editor.edit(edit => edit.replace(currentLineRange, "*" + lineText));
	
	});
	context.subscriptions.push(selectCom);
	
	const passOpenFile = vscode.commands.registerCommand('jdw-commands.playFile', function () {
		const homeDir = os.homedir();
		const scriptPath = path.join(homeDir, 'programming/jdw-helper-scripts', 'send-jam.sh');
		runWithCurrentFile(context, scriptPath)
	});
	context.subscriptions.push(passOpenFile);
	
	const updateWithOpenFile = vscode.commands.registerCommand('jdw-commands.update', function () {
		const homeDir = os.homedir();
		const scriptPath = path.join(homeDir, 'programming/jdw-helper-scripts', 'update-config.sh');
		runWithCurrentFile(context, scriptPath)
	});
	context.subscriptions.push(updateWithOpenFile);
	
	const setupWithOpenFile = vscode.commands.registerCommand('jdw-commands.setup', function () {
		const homeDir = os.homedir();
		const scriptPath = path.join(homeDir, 'programming/jdw-helper-scripts', 'setup-jam.sh');
		runWithCurrentFile(context, scriptPath)
	});
	context.subscriptions.push(setupWithOpenFile);


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
