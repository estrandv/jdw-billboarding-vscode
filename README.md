# JDW Billboard VS Code Extension

Syntax highlighting and editor commands for `.bbd` (Billboard) files in VS Code.

## Structure

```
syntax-highlighting/     # VS Code extension (TextMate grammar)
  package.json           # Extension manifest
  syntaxes/
    bbd.tmLanguage.json  # TextMate grammar for .bbd files
  language-configuration.json

vscode-commands/         # Custom VS Code commands (Node + esbuild)
  package.json
  src/
```

## Building

```bash
cd syntax-highlighting
npm install -g @vscode/vsce
vsce package            # produces .vsix
```

Then in VS Code: `Extensions > Install from VSIX...`

## Known Issues

- Directory structure is messy — some redundant files in root
- Script paths in vscode-commands are hardcoded
