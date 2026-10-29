# CodeMark — Learning Roadmap & Task Tracker

## Progress Legend
- `[ ]` Pending
- `[~]` In Progress
- `[x]` Complete

---

## Phase 0 — Fundamentals
| ID | Topic | Objective | Status | Key Concepts |
|----|-------|-----------|--------|--------------|
| T01 | Extension fundamentals | Understand extension host, lifecycle, manifest, command contract | [x] | Extension host, activation events, package.json, activate(), subscriptions |

---

## Phase 1 — Project Setup
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T02 | Scaffold project | Create all project files, install deps | `npm run compile` succeeds | [~] |
| T03 | Launch Dev Host | Run extension in Extension Development Host | "CodeMark is now active!" in Debug Console | [ ] |

---

## Phase 2 — First Command
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T04 | Declare command | Add `codemark.addBookmark` to `package.json` | Command visible in Command Palette | [ ] |
| T05 | Register command | Implement handler, show notification | Notification appears when command runs | [ ] |
| T06 | Understand subscriptions | Explain context.subscriptions and disposal | Can explain what happens if you forget to push | [ ] |

---

## Phase 3 — Editor Interaction
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T07 | Read cursor position | Get active editor, file URI, line number | Console logs correct file + line | [ ] |
| T08 | In-memory store | Store bookmarks in an array | Multiple bookmarks accumulate correctly | [ ] |

---

## Phase 4 — Decorations
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T09 | Gutter icon | Show icon in gutter at bookmarked lines | Icon visible in editor margin | [ ] |
| T10 | Line highlight | Apply background color to bookmarked lines | Highlight visible in editor | [ ] |

---

## Phase 5 — Tree View
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T11 | TreeDataProvider | Implement provider returning bookmark nodes | Panel shows in Activity Bar | [ ] |
| T12 | Refresh on change | Update tree when bookmarks change | New bookmarks appear in tree immediately | [ ] |

---

## Phase 6 — Navigation and Notes
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T13 | Jump to bookmark | Click tree item to navigate to bookmarked line | Cursor moves to correct file + line | [ ] |
| T14 | Add notes | InputBox to attach a note to a bookmark | Note displayed in tree item | [ ] |

---

## Phase 7 — Persistence
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T15 | Save bookmarks | Serialize to workspaceState on change | Bookmarks present after `Developer: Reload Window` | [ ] |
| T16 | Restore bookmarks | Deserialize on activate() | Bookmarks load on startup | [ ] |

---

## Phase 8 — Status Bar
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T17 | StatusBarItem | Show bookmark count in status bar | Count visible at bottom of editor | [ ] |
| T18 | Click to reveal | Clicking status bar focuses CodeMark panel | Panel receives focus | [ ] |

---

## Phase 9 — Webview
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T19 | WebviewPanel | Show HTML dashboard | Panel opens with bookmark table | [ ] |
| T20 | Message passing | Delete bookmark from webview | Extension state updates, tree refreshes | [ ] |

---

## Phase 10 — Configuration and Menus
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T21 | User settings | Add highlight color and max bookmarks settings | Settings appear in VS Code Settings UI | [ ] |
| T22 | Context menu | Right-click editor line to add bookmark | Menu item visible on right-click | [ ] |
| T23 | Keybinding | Assign keyboard shortcut to addBookmark | Shortcut triggers command | [ ] |

---

## Phase 11 — Testing
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T24 | Unit tests | Test bookmark model logic | `npm test` passes | [ ] |
| T25 | Integration test | Activate extension and run command in test | Test executes in real VS Code host | [ ] |

---

## Phase 12 — Packaging
| ID | Topic | Objective | Validation | Status |
|----|-------|-----------|------------|--------|
| T26 | Build vsix | `vsce package` produces a .vsix file | `.vsix` file created | [ ] |
| T27 | Local install | Install from .vsix | Extension loads from installed package | [ ] |
