import * as expect from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together

describe('Extension Tests', () => {

});

suite("Extension Tests", function () {

    // Defines a Mocha unit test
    test("Something 1", function() {
        expect.equal(-1, [1, 2, 3].indexOf(5));
        expect.equal(-1, [1, 2, 3].indexOf(0));
    });
});
