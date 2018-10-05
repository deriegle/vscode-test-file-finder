import { TextEditor, ViewColumn, window, workspace } from 'vscode';

export interface Globs {
   [K:string]: string;
   javascript: string;
   ruby: string;
}

export default class SpecFileFinder {
  public fileName: string | null;
  private fileType: string | null;
  private globs: Globs;

  constructor(editor: TextEditor) {
    this.fileName = this._parseFileName(editor.document.fileName);
    this.fileType = editor.document.languageId;
    this.globs = this._getGlobs();
  }

  private get specFileName() {
    if (this.fileName && this.fileType && this.globs.hasOwnProperty(this.fileType)) {
      return `${this.fileName}${this.globs[this.fileType]}`;
    }

    return null;
  }

  public showError(message: string) {
    window.showErrorMessage(message);
  }

  public async hasSpec(): Promise<boolean> {
    const files = await workspace.findFiles(`**/${this.specFileName}`);
    if (!files || files.length === 0) { return false; }

    return true;
  }

  public findFiles() {
    workspace.findFiles(`**/${this.specFileName}`).then(files => {
      if (!files || files.length === 0) {
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

    return {
      javascript: config.get('javascriptGlob') as string,
      ruby: config.get('rubyGlob') as string,
    };
  }

  private _parseFileName(fileName: string): string | null {
    const parsed = new RegExp(/^.*\/([\w_-]+)($|\.?.+)$/, 'gi').exec(fileName);

    return parsed && parsed.length >= 1 ? parsed[1] : null;
  }
}
