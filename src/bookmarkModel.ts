import { Bookmark } from './types';

export interface AddResult {
    added: boolean;
    reason?: 'max-reached';
}

export function addBookmark(
    bookmarks: Bookmark[],
    bookmark: Bookmark,
    maxPerFile: number
): AddResult {
    if (maxPerFile > 0) {
        const count = bookmarks.filter(
            b => b.uri.toString() === bookmark.uri.toString()
        ).length;
        if (count >= maxPerFile) {
            return { added: false, reason: 'max-reached' };
        }
    }
    bookmarks.push(bookmark);
    return { added: true };
}

export function removeBookmark(
    bookmarks: Bookmark[],
    uriString: string,
    line: number
): boolean {
    const idx = bookmarks.findIndex(
        b => b.uri.toString() === uriString && b.line === line
    );
    if (idx === -1) { return false; }
    bookmarks.splice(idx, 1);
    return true;
}
