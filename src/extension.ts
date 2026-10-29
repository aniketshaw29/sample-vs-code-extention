import * as vscode from 'vscode';
import * as path from 'path';
import { Bookmark } from './types';
import { BookmarkTreeProvider } from './treeProvider';
import { BookmarkDashboard } from './webviewPanel';

const STORAGE_KEY = 'codemark.bookmarks';

interface StoredBookmark {
    uriString: string;
    line: number;
}

const bookmarks: Bookmark[] = [];

function saveBookmarks(context: vscode.ExtensionContext): void {
    const stored: StoredBookmark[] = bookmarks.map(b => ({
        uriString: b.uri.toString(),
        line: b.line,
    }));
    context.workspaceState.update(STORAGE_KEY, stored);
}

function loadBookmarks(context: vscode.ExtensionContext): void {
    const stored = context.workspaceState.get<StoredBookmark[]>(STORAGE_KEY, []);
    for (const s of stored) {
        bookmarks.push({
            uri: vscode.Uri.parse(s.uriString),
            line: s.line,
        });
    }
}

function updateStatusBar(item: vscode.StatusBarItem): void {
    const count = bookmarks.length;
    item.text = `$(bookmark) ${count} bookmark${count !== 1 ? 's' : ''}`;
    item.tooltip = 'CodeMark — click to open Bookmarks panel';
}

function applyDecorations(
    editor: vscode.TextEditor,
    decorationType: vscode.TextEditorDecorationType
): void {
    const ranges = bookmarks
        .filter(b =>
            b.uri.toString() === editor.document.uri.toString() &&
            b.line < editor.document.lineCount
        )
        .map(b => editor.document.lineAt(b.line).range);

    editor.setDecorations(decorationType, ranges);
}

export function activate(context: vscode.ExtensionContext): void {
    console.log('CodeMark is now active!');

    // ── Decorations ────────────────────────────────────────────────────────
    const decorationType = vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        backgroundColor: 'rgba(255, 200, 0, 0.15)',
        overviewRulerColor: 'rgba(255, 200, 0, 0.8)',
        overviewRulerLane: vscode.OverviewRulerLane.Left,
        gutterIconPath: context.asAbsolutePath(path.join('resources', 'bookmark.svg')),
        gutterIconSize: 'contain',
    });
    context.subscriptions.push(decorationType);

    // ── Status Bar ─────────────────────────────────────────────────────────
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
    );
    statusBarItem.command = 'codemark.bookmarks.focus';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // ── Restore persisted bookmarks ────────────────────────────────────────
    loadBookmarks(context);
    updateStatusBar(statusBarItem);

    const currentEditor = vscode.window.activeTextEditor;
    if (currentEditor) {
        applyDecorations(currentEditor, decorationType);
    }

    // ── Tree View ──────────────────────────────────────────────────────────
    const treeProvider = new BookmarkTreeProvider(bookmarks);
    const treeView = vscode.window.registerTreeDataProvider(
        'codemark.bookmarks',
        treeProvider
    );
    context.subscriptions.push(treeView);

    // ── Webview Dashboard ──────────────────────────────────────────────────
    const dashboard = new BookmarkDashboard(
        context.extensionUri,
        (uriString, line) => {
            const idx = bookmarks.findIndex(
                b => b.uri.toString() === uriString && b.line === line
            );
            if (idx === -1) { return; }
            bookmarks.splice(idx, 1);

            const editor = vscode.window.activeTextEditor;
            if (editor) { applyDecorations(editor, decorationType); }
            treeProvider.refresh();
            saveBookmarks(context);
            updateStatusBar(statusBarItem);
            dashboard.update(bookmarks);
        },
        (uriString, line) => {
            vscode.commands.executeCommand(
                'codemark.revealBookmark',
                vscode.Uri.parse(uriString),
                line
            );
        }
    );

    // ── Commands ───────────────────────────────────────────────────────────
    const addBookmark = vscode.commands.registerCommand(
        'codemark.addBookmark',
        () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showWarningMessage('CodeMark: Open a file first.');
                return;
            }

            const uri = editor.document.uri;
            const line = editor.selection.active.line;
            const fileName = path.basename(uri.fsPath);

            bookmarks.push({ uri, line });
            applyDecorations(editor, decorationType);
            treeProvider.refresh();
            saveBookmarks(context);
            updateStatusBar(statusBarItem);
            dashboard.update(bookmarks);

            vscode.window.showInformationMessage(
                `CodeMark: Bookmarked line ${line + 1} in ${fileName}  (${bookmarks.length} total)`
            );
        }
    );

    const openDashboard = vscode.commands.registerCommand(
        'codemark.openDashboard',
        () => dashboard.open(bookmarks)
    );

    const revealBookmark = vscode.commands.registerCommand(
        'codemark.revealBookmark',
        async (uri: vscode.Uri, line: number) => {
            const document = await vscode.workspace.openTextDocument(uri);
            const editor = await vscode.window.showTextDocument(document);
            const position = new vscode.Position(line, 0);
            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(
                new vscode.Range(position, position),
                vscode.TextEditorRevealType.InCenter
            );
        }
    );

    // ── Events ─────────────────────────────────────────────────────────────
    const onEditorChange = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            applyDecorations(editor, decorationType);
        }
    });

    context.subscriptions.push(addBookmark, openDashboard, revealBookmark, onEditorChange);
}

export function deactivate(): void {}
