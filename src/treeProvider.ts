import * as vscode from 'vscode';
import * as path from 'path';
import { Bookmark } from './types';

// ─── Tree node classes ────────────────────────────────────────────────────────

export class FileItem extends vscode.TreeItem {
    constructor(
        public readonly uri: vscode.Uri,
        bookmarkCount: number
    ) {
        super(path.basename(uri.fsPath), vscode.TreeItemCollapsibleState.Expanded);
        this.description = `${bookmarkCount} bookmark${bookmarkCount !== 1 ? 's' : ''}`;
        this.resourceUri = uri;
        this.iconPath = vscode.ThemeIcon.File;
        this.contextValue = 'fileItem';
    }
}

export class BookmarkItem extends vscode.TreeItem {
    constructor(
        public readonly uri: vscode.Uri,
        public readonly line: number
    ) {
        super(`Line ${line + 1}`, vscode.TreeItemCollapsibleState.None);
        this.iconPath = new vscode.ThemeIcon('bookmark');
        this.tooltip = `${path.basename(uri.fsPath)}:${line + 1}`;
        this.command = {
            command: 'codemark.revealBookmark',
            title: 'Go to Bookmark',
            arguments: [uri, line],
        };
        this.contextValue = 'bookmarkItem';
    }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export class BookmarkTreeProvider
    implements vscode.TreeDataProvider<FileItem | BookmarkItem>
{
    private readonly _onDidChangeTreeData =
        new vscode.EventEmitter<FileItem | BookmarkItem | undefined>();

    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private readonly bookmarks: Bookmark[]) {}

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: FileItem | BookmarkItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: FileItem | BookmarkItem): (FileItem | BookmarkItem)[] {
        if (!element) {
            return this.buildFileItems();
        }
        if (element instanceof FileItem) {
            return this.buildBookmarkItems(element.uri);
        }
        return [];
    }

    private buildFileItems(): FileItem[] {
        const grouped = new Map<string, Bookmark[]>();
        for (const b of this.bookmarks) {
            const key = b.uri.toString();
            const group = grouped.get(key) ?? [];
            group.push(b);
            grouped.set(key, group);
        }
        return [...grouped.values()].map(
            group => new FileItem(group[0].uri, group.length)
        );
    }

    private buildBookmarkItems(uri: vscode.Uri): BookmarkItem[] {
        return this.bookmarks
            .filter(b => b.uri.toString() === uri.toString())
            .sort((a, b) => a.line - b.line)
            .map(b => new BookmarkItem(b.uri, b.line));
    }
}
