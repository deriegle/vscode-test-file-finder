'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, workspace, commands, ExtensionContext, TextEditor, StatusBarItem, TextEditorEdit, ViewColumn, StatusBarAlignment } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    let _statusBarItem: StatusBarItem;
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "run-last-command" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
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

// this method is called when your extension is deactivated
export function deactivate() {
}

interface Globs {
    [K:string]: string;
    javascript: string;
    ruby: string;
}

class SpecFileFinder {
    private fileName: string | null;
    private fileType: string | null;
    private globs: Globs;

    constructor(editor: TextEditor){
        this.fileName = this._parseFileName(editor.document.fileName);
        this.fileType = editor.document.languageId;
        this.globs = this._getGlobs();
    }

    private get specFileName(){
        if (this.fileName && this.fileType && this.globs.hasOwnProperty(this.fileType)) {
            return `${this.fileName}${this.globs[this.fileType]}`;
        }

        return null;
    }

    public showError (message: string) {
        window.showErrorMessage(message);
    }

    public async hasSpec(): Promise<boolean> {
        const files = await workspace.findFiles(`**/${this.specFileName}`);

        if(!files || files.length === 0) {
            return false;
        }

        return true;
    }

    public findFiles() {
        workspace.findFiles(`**/${this.specFileName}`).then(files => {
            if(!files || files.length === 0) {
                this.showError(`No file found <${this.specFileName}>`);
                return;
            }

            workspace.openTextDocument(files[0]).then(doc => {
                window.showTextDocument(doc, ViewColumn.Beside, false);
            });
        });
    }

    private _getGlobs(): Globs {
        const config = workspace.getConfiguration("specFinder");

        return  {
            javascript: config.get('javascriptGlob') as string,
            ruby: config.get('rubyGlob') as string,
        };
    }

    private _parseFileName(fileName: string): string | null {
        const parsed = new RegExp(/^.*\/([\w_-]+)($|\.?.+)$/, 'gi').exec(fileName);

        return parsed && parsed.length >= 1 ? parsed[1] : null;
    }
}
