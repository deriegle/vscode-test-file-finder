import { TextEditor, TextDocument, ViewColumn, window, workspace } from 'vscode';

export interface Globs {
   [K:string]: string;
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

  private get testFileName() {
    if (this.fileName && this.fileType && this.globs.hasOwnProperty(this.fileType)) {
      return `${this.fileName}${this.globs[this.fileType]}`;
    }

    return null;
  }

  public showError(message: string) {
    window.showErrorMessage(message);
  }

  public async hasTest(): Promise<boolean> {
    const files = await workspace.findFiles(`**/${this.testFileName}`);
    if (!files || files.length === 0) { return false; }

    return true;
  }

  public findFiles() {
    workspace.findFiles(`**/${this.testFileName}`).then((files: Array<any>) => {
      if (!files || files.length === 0) {
        this.showError(`No file found <${this.testFileName}>`);
        return;
      }

      workspace.openTextDocument(files[0]).then((doc: TextDocument) => {
        window.showTextDocument(doc, ViewColumn.Beside, false);
      });
    });
  }

  private _getGlobs(): Globs {
    const config = workspace.getConfiguration('testFinder');
    let globConfiguration: Globs = {};

    Object.keys(config)
      .filter(config => config.includes('Glob'))
      .forEach((glob: string) => {
        const parsedGlob = RegExp(/(\w+)(Glob)/, 'g').exec(glob);
        if(!parsedGlob || parsedGlob.length === 0) { return; }

        globConfiguration[parsedGlob[1]] = config.get(glob) as string;
      });

    return globConfiguration;
  }

  private _parseFileName(fileName: string): string | null {
    const parsed = new RegExp(/^.*\/([\w_-]+)($|\.?.+)$/, 'gi').exec(fileName);

    return parsed && parsed.length >= 1 ? parsed[1] : null;
  }
}
