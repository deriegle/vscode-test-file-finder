import { commands, ExtensionContext, TextEditor, window, workspace, StatusBarItem, StatusBarAlignment } from 'vscode';
import TestFileFinder from './test-file-finder';

export function activate(context: ExtensionContext) {
    let _statusBarItem: StatusBarItem;

    if(workspace.getConfiguration('testFinder').get('showInStatusBar')) {
        window.onDidChangeActiveTextEditor((editor: TextEditor | undefined) => {
            if(!editor) {
                if(_statusBarItem) { _statusBarItem.hide(); }
                return;
            }

            new TestFileFinder(editor).hasTest().then(hasTest => {
                if(!_statusBarItem) {
                    _statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
                }

                _statusBarItem.text = `Test file: <${hasTest ? 'Found' : 'Not found'}>`;
                _statusBarItem.color = hasTest ? 'lightgreen' : 'red';
                _statusBarItem.show();
            });
        });
    }

    let disposable = commands.registerTextEditorCommand('extension.splitTestFile', (editor: TextEditor) => {
        if(editor.document.isUntitled || editor.document.isClosed) { return; }

        const specFinder = new TestFileFinder(editor);

        specFinder.findFiles();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
