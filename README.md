# CodeMark

A developer bookmark manager for VS Code. Bookmark lines across files, visualize them in a sidebar panel, and jump to them instantly.

## Features

- **Add bookmarks** with `Cmd+Alt+B` (Mac) / `Ctrl+Alt+B` (Windows/Linux) or via the right-click editor menu
- **Sidebar panel** — bookmarks grouped by file, with inline remove button on hover
- **Dashboard** — tabular view of all bookmarks with Go to line / Delete actions
- **Highlight color** and **per-file bookmark limit** are configurable in Settings

## Extension Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `codemark.highlightColor` | `rgba(255, 200, 0, 0.15)` | Background color applied to bookmarked lines |
| `codemark.maxBookmarksPerFile` | `0` (unlimited) | Maximum bookmarks per file; 0 = unlimited |

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| CodeMark: Add Bookmark | `Cmd+Alt+B` | Bookmark the current cursor line |
| CodeMark: Open Dashboard | — | Open the webview dashboard |
| CodeMark: Remove Bookmark | — | Remove a bookmark (tree view context menu) |
