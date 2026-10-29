import * as vscode from 'vscode';

export interface Bookmark {
    uri: vscode.Uri;
    line: number;
}
