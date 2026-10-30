import * as assert from 'assert';
import * as vscode from 'vscode';

suite('CodeMark Extension — integration', () => {
    // The extension is activated automatically when VS Code loads it in the
    // test host. We just need to wait for the activation promise to settle.
    suiteSetup(async () => {
        // Activating the codemark extension explicitly ensures it is ready
        // before any test runs, even if activationEvents haven't fired yet.
        await vscode.extensions.getExtension('your-publisher-id.codemark')?.activate();
    });

    test('extension activates without throwing', () => {
        const ext = vscode.extensions.getExtension('your-publisher-id.codemark');
        assert.ok(ext, 'Extension should be registered in the test host');
        assert.strictEqual(ext.isActive, true, 'Extension should be active after activate()');
    });

    test('codemark.addBookmark command is registered', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(
            commands.includes('codemark.addBookmark'),
            'codemark.addBookmark should be registered'
        );
    });

    test('codemark.removeBookmark command is registered', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(
            commands.includes('codemark.removeBookmark'),
            'codemark.removeBookmark should be registered'
        );
    });

    test('codemark.openDashboard command is registered', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(
            commands.includes('codemark.openDashboard'),
            'codemark.openDashboard should be registered'
        );
    });

    test('addBookmark with no active editor shows warning and does not throw', async () => {
        // In the headless test host there is no active text editor.
        // The command should handle this gracefully (show a warning, not throw).
        await assert.doesNotReject(
            Promise.resolve(vscode.commands.executeCommand('codemark.addBookmark')),
            'addBookmark should not throw when there is no active editor'
        );
    });
});
