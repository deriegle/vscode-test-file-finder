# open-spec-file README

This extension `open-spec-file` is useful for quickly finding and opening spec files for Ruby & Javascript files.
Using the keymapping while inside a file, it will search the file tree for a glob based on the current file name.

The default globs for finding spec files are:
Javascript: `-test.js`
Ruby: `_spec.rb`

You can change these defaults by setting: (The glob is appended to the current file name [minus the file extension])
`specFinder.javascriptGlob`
`specFinder.rubyGlob`

## Todo
1. Add configurable feature to show `Has Spec: <Found>` or `Has Spec: <Not Found>` in the status bar when inside of a file.
2. Add tests for functionality
3. Clean up code
4. Add globs for additional languages
