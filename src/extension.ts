import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
    console.log('CodeMark is now active!');

    const addBookmark = vscode.commands.registerCommand(
        'codemark.addBookmark',
        () => {
            vscode.window.showInformationMessage('CodeMark: Bookmark added!');
        }
    );

    context.subscriptions.push(addBookmark);
}

export function deactivate(): void {}
