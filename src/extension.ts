'use strict';
import { commands, ExtensionContext, TextEditor } from 'vscode';
import SpecFileFinder from './spec-file-finder';

export function activate(context: ExtensionContext) {
    // workspace.getConfiguration('specFinder').get('autoSearchSpec')
        // window.onDidChangeWindowState(() => {
        //     console.log('onDidChangeWindowState: Called');
        // });
        // window.onDidChangeVisibleTextEditors(() => {
        //     console.log('onDidChangeVisibleTextEditors: Called');
        // });
        // window.onDidChangeActiveTextEditor((editor: TextEditor | undefined) => {
        //     console.log('onDidChangeActiveTextEditor: Called');
        //     if(!editor) { return; }

        //     new SpecFileFinder(editor).hasSpec().then(hasSpec => {
        //         if(!_statusBarItem){
        //             _statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        //         }

        //         _statusBarItem.text = `Spec: <${hasSpec ? 'Found' : 'Not found'}>`;
        //         _statusBarItem.color = hasSpec ? 'lightgreen' : 'red';
        //         _statusBarItem.show();
        //     });


        // });

    let disposable = commands.registerTextEditorCommand('extension.splitSpecFile', (editor: TextEditor) => {
        if(editor.document.isUntitled || editor.document.isClosed) { return; }

        const specFinder = new SpecFileFinder(editor);

        specFinder.findFiles();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
