import * as assert from 'assert';
import { addBookmark, removeBookmark } from '../bookmarkModel';
import { Bookmark } from '../types';

// Minimal Uri stub — only .toString() is used by the model functions.
function makeUri(s: string) {
    return { toString: () => s } as any;
}

function makeBookmark(uriStr: string, line: number): Bookmark {
    return { uri: makeUri(uriStr), line };
}

suite('bookmarkModel — addBookmark', () => {
    test('adds a bookmark to an empty array', () => {
        const bookmarks: Bookmark[] = [];
        const result = addBookmark(bookmarks, makeBookmark('file:///a.ts', 0), 0);
        assert.strictEqual(result.added, true);
        assert.strictEqual(bookmarks.length, 1);
        assert.strictEqual(bookmarks[0].line, 0);
    });

    test('adds multiple bookmarks across different files', () => {
        const bookmarks: Bookmark[] = [];
        addBookmark(bookmarks, makeBookmark('file:///a.ts', 0), 0);
        addBookmark(bookmarks, makeBookmark('file:///b.ts', 5), 0);
        assert.strictEqual(bookmarks.length, 2);
    });

    test('respects maxPerFile limit — blocks when limit reached', () => {
        const bookmarks: Bookmark[] = [];
        addBookmark(bookmarks, makeBookmark('file:///a.ts', 0), 1);
        const result = addBookmark(bookmarks, makeBookmark('file:///a.ts', 1), 1);
        assert.strictEqual(result.added, false);
        assert.strictEqual(result.reason, 'max-reached');
        assert.strictEqual(bookmarks.length, 1);
    });

    test('maxPerFile limit is per-file — different files are independent', () => {
        const bookmarks: Bookmark[] = [];
        addBookmark(bookmarks, makeBookmark('file:///a.ts', 0), 1);
        const result = addBookmark(bookmarks, makeBookmark('file:///b.ts', 0), 1);
        assert.strictEqual(result.added, true);
        assert.strictEqual(bookmarks.length, 2);
    });

    test('maxPerFile = 0 means unlimited', () => {
        const bookmarks: Bookmark[] = [];
        for (let i = 0; i < 10; i++) {
            const result = addBookmark(bookmarks, makeBookmark('file:///a.ts', i), 0);
            assert.strictEqual(result.added, true);
        }
        assert.strictEqual(bookmarks.length, 10);
    });
});

suite('bookmarkModel — removeBookmark', () => {
    test('removes an existing bookmark by uri and line', () => {
        const bookmarks: Bookmark[] = [makeBookmark('file:///a.ts', 3)];
        const removed = removeBookmark(bookmarks, 'file:///a.ts', 3);
        assert.strictEqual(removed, true);
        assert.strictEqual(bookmarks.length, 0);
    });

    test('returns false when bookmark does not exist', () => {
        const bookmarks: Bookmark[] = [makeBookmark('file:///a.ts', 3)];
        const removed = removeBookmark(bookmarks, 'file:///a.ts', 99);
        assert.strictEqual(removed, false);
        assert.strictEqual(bookmarks.length, 1);
    });

    test('removes only the matching bookmark, leaving others intact', () => {
        const bookmarks: Bookmark[] = [
            makeBookmark('file:///a.ts', 0),
            makeBookmark('file:///a.ts', 5),
            makeBookmark('file:///b.ts', 2),
        ];
        removeBookmark(bookmarks, 'file:///a.ts', 5);
        assert.strictEqual(bookmarks.length, 2);
        assert.ok(bookmarks.some(b => b.uri.toString() === 'file:///a.ts' && b.line === 0));
        assert.ok(bookmarks.some(b => b.uri.toString() === 'file:///b.ts' && b.line === 2));
    });

    test('returns false when the array is empty', () => {
        const bookmarks: Bookmark[] = [];
        const removed = removeBookmark(bookmarks, 'file:///a.ts', 0);
        assert.strictEqual(removed, false);
    });
});
