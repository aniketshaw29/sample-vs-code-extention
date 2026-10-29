import * as vscode from 'vscode';
import * as path from 'path';
import * as crypto from 'crypto';
import { Bookmark } from './types';

// Shape sent across the message boundary — must be JSON-serializable
interface WebviewBookmark {
    uriString: string;
    fileName: string;
    line: number; // 1-based for display
}

type WebviewMessage =
    | { type: 'deleteBookmark'; uriString: string; line: number }
    | { type: 'revealBookmark'; uriString: string; line: number };

export class BookmarkDashboard {
    private panel: vscode.WebviewPanel | undefined;

    constructor(
        private readonly extensionUri: vscode.Uri,
        private readonly onDelete: (uriString: string, line: number) => void,
        private readonly onReveal: (uriString: string, line: number) => void
    ) {}

    open(bookmarks: Bookmark[]): void {
        if (this.panel) {
            this.panel.reveal();
            this.update(bookmarks);
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'codemark.dashboard',
            'CodeMark Dashboard',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                localResourceRoots: [this.extensionUri],
            }
        );

        this.panel.webview.html = this.buildHtml(this.panel.webview, bookmarks);

        this.panel.webview.onDidReceiveMessage((message: WebviewMessage) => {
            if (message.type === 'deleteBookmark') {
                this.onDelete(message.uriString, message.line);
            } else if (message.type === 'revealBookmark') {
                this.onReveal(message.uriString, message.line);
            }
        });

        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
    }

    // Sends fresh data to an already-open panel; no-op if panel is closed.
    update(bookmarks: Bookmark[]): void {
        if (!this.panel) { return; }
        const data = toWebviewBookmarks(bookmarks);
        this.panel.webview.postMessage({ type: 'update', bookmarks: data });
    }

    private buildHtml(webview: vscode.Webview, bookmarks: Bookmark[]): string {
        const nonce = crypto.randomBytes(16).toString('hex');
        const data = toWebviewBookmarks(bookmarks);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy"
          content="default-src 'none';
                   style-src 'nonce-${nonce}';
                   script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeMark Dashboard</title>
    <style nonce="${nonce}">
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
            padding: 16px;
            margin: 0;
        }
        h1 {
            font-size: 1.1em;
            font-weight: 600;
            margin: 0 0 16px;
        }
        table { width: 100%; border-collapse: collapse; }
        th {
            text-align: left;
            padding: 5px 10px;
            border-bottom: 1px solid var(--vscode-panel-border, #444);
            opacity: 0.6;
            font-size: 0.8em;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }
        td {
            padding: 5px 10px;
            border-bottom: 1px solid var(--vscode-panel-border, #333);
        }
        tr:hover td { background: var(--vscode-list-hoverBackground); }
        .line { font-family: var(--vscode-editor-font-family); opacity: 0.7; }
        button {
            background: none;
            border: none;
            color: var(--vscode-foreground);
            cursor: pointer;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 0.85em;
        }
        button:hover { background: var(--vscode-toolbar-hoverBackground); }
        .del { color: var(--vscode-errorForeground, #f48771); }
        .empty { text-align: center; padding: 40px; opacity: 0.5; }
    </style>
</head>
<body>
    <h1>CodeMark Bookmarks</h1>
    <div id="root"></div>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        let bookmarks = ${JSON.stringify(data)};

        function esc(s) {
            return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        }

        function render() {
            const root = document.getElementById('root');
            if (bookmarks.length === 0) {
                root.innerHTML = '<p class="empty">No bookmarks yet.</p>';
                return;
            }
            root.innerHTML =
                '<table>' +
                '<thead><tr><th>File</th><th>Line</th><th></th><th></th></tr></thead>' +
                '<tbody>' +
                bookmarks.map((b, i) =>
                    '<tr>' +
                    '<td>' + esc(b.fileName) + '</td>' +
                    '<td class="line">' + b.line + '</td>' +
                    '<td><button onclick="go(' + i + ')">Go to line</button></td>' +
                    '<td><button class="del" onclick="del(' + i + ')">Delete</button></td>' +
                    '</tr>'
                ).join('') +
                '</tbody></table>';
        }

        function go(i) {
            const b = bookmarks[i];
            vscode.postMessage({ type: 'revealBookmark', uriString: b.uriString, line: b.line - 1 });
        }

        function del(i) {
            const b = bookmarks[i];
            vscode.postMessage({ type: 'deleteBookmark', uriString: b.uriString, line: b.line - 1 });
        }

        // Extension host → webview: fresh bookmark array after any mutation
        window.addEventListener('message', event => {
            if (event.data.type === 'update') {
                bookmarks = event.data.bookmarks;
                render();
            }
        });

        render();
    </script>
</body>
</html>`;
    }
}

function toWebviewBookmarks(bookmarks: Bookmark[]): WebviewBookmark[] {
    return bookmarks.map(b => ({
        uriString: b.uri.toString(),
        fileName: path.basename(b.uri.fsPath),
        line: b.line + 1,
    }));
}
