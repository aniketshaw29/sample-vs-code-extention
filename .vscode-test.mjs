import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
    files: 'out/test/**/*.test.js',
    workspaceFolder: '.',
    launchArgs: [
        '--disable-gpu',
        '--disable-updates',
        '--user-data-dir=/tmp/vsc-test-ud',
    ],
    useInstallation: {
        fromPath: '/Applications/Visual Studio Code.app/Contents/MacOS/Code',
    },
});
