import { TextEditor, Uri, EndOfLine, TextLine, Range, Position, Selection, } from 'vscode';
import SpecFileFinder from '../test-file-finder';

const createMockTextEditor = (document: any | undefined = undefined, editor: any | undefined = undefined): TextEditor => {
  return {
    selection: new Selection(0, 0, 0, 0),
    selections: [new Selection(0, 0, 0, 0)],
    visibleRanges: [new Range(0, 0, 0, 0)],
    options: {
    } ,
    edit: (): Promise<boolean> => Promise.resolve(true),
    insertSnippet: (): Promise<boolean> => Promise.resolve(true),
    hide: () => {},
    revealRange: () => {},
    setDecorations: () => {},
    show: () => {},
    ...editor,
    document: {
      fileName: '',
      languageId: 'javascript',
      uri: Uri.file(document && document.fileName ? document.fileName : ''),
      isUntitled: false,
      version: 0,
      isDirty: false,
      isClosed: false,
      save: (): Promise<boolean> => Promise.resolve(true),
      eol: EndOfLine.CRLF,
      lineCount: 20,
      lineAt: (): TextLine => ({ lineNumber: 2, text: '', range: new Range(0, 0, 0, 0), rangeIncludingLineBreak: new Range(0, 0, 0, 0), isEmptyOrWhitespace: false, firstNonWhitespaceCharacterIndex: 0  }),
      offsetAt: (_: Position): number => 1,
      getText: () =>  "",
      getWordRangeAtPosition: () => undefined,
      positionAt: () => new Position(0, 0),
      validatePosition: () => new Position(0, 0),
      validateRange: () => new Range(0, 0, 0, 0),
      ...document,
    },
  };
};

describe('SpecFileFinder', () => {
  it('parses the file name correctly', () => {
    const fileNames: Array<{ full: string, file: string}> = [
      {
        full: '/Users/devinriegle/spec-file-finder/file.js',
        file: 'file',
      },
      {
        full: '/Users/devinriegle/spec-file-finder/file.js',
        file: 'file',
      },
      {
        full: '/Users/devinriegle/spec-file-finder/file.js',
        file: 'file'
      },
      {
        full: '/Users/devinriegle/spec-file-finder/file.js',
        file: 'file',
      },
    ];

    fileNames.forEach(({ full, file }) => {
      const editor = createMockTextEditor({ fileName: full, languageId: 'javascript' });
      const specFileFinder: SpecFileFinder = new SpecFileFinder(editor);

      expect(specFileFinder.fileName).toBe(file);
    });
  });
});

