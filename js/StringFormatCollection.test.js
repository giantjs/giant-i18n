/*global dessert, troop, sntls, evan, bookworm, v18n */
/*global module, test, asyncTest, start, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("StringFormatCollection");

    test("Conversion from array", function () {
        var formatCollection = [
            'foo'.toStringFormat(),
            'bar'.toStringFormat(),
            'baz'.toStringFormat()
        ].toStringFormatCollection();

        ok(formatCollection.isA(v18n.StringFormatCollection), "should return StringFormatCollection instance");
        equal(formatCollection.getKeyCount(), 3, "should preserve item count");
    });

    test("Conversion from Hash", function () {
        var hash = [
                'foo'.toStringFormat(),
                'bar'.toStringFormat(),
                'baz'.toStringFormat()
            ].toHash(),
            formatCollection = hash.toStringFormatCollection();

        ok(formatCollection.isA(v18n.StringFormatCollection), "should return StringFormatCollection instance");
        equal(formatCollection.getKeyCount(), 3, "should preserve item count");
    });

    test("Token extraction from format collection", function () {
        var formatCollection = [
                'hello {{ foo }} world {{ bar }} !'.toStringFormat(),
                'brave {{ bar }}'.toStringFormat(),
                'new'.toStringFormat()
            ].toStringFormatCollection(),
            tokens;

        tokens = formatCollection.extractTokens();

        ok(tokens.isA(sntls.Collection), "should return Collection instance");
        deepEqual(tokens.items, {
            'hello '   : 'hello ',
            '{{ foo }}': '{{ foo }}',
            ' world '  : ' world ',
            '{{ bar }}': '{{ bar }}',
            ' !'       : ' !',
            'brave '   : 'brave ',
            ''         : '',
            'new'      : 'new'
        }, "should return unique tokens in all formats in the collection");
    });

    test("Substitution tree generation", function () {
        var formatCollection = v18n.StringFormatCollection.create({
            '{{ main }}': 'hello {{ foo }} world {{ bar }} !'.toStringFormat(),
            '{{ foo }}' : 'brave {{ bar }}'.toStringFormat(),
            '{{ bar }}' : 'new'.toStringFormat()
        });

        var substitutionTree = formatCollection.resolveParameters();

        equal(typeof substitutionTree, 'object', "should return object");
        deepEqual(substitutionTree, {
            "{{ main }}": [
                "hello ",
                [
                    "brave ",
                    "new",
                    ""
                ],
                " world ",
                "new",
                " !"
            ],
            "{{ foo }}" : [
                "brave ",
                "new",
                ""
            ],
            "{{ bar }}" : "new",
            "hello "    : "hello ",
            " world "   : " world ",
            " !"        : " !",
            "brave "    : "brave ",
            ""          : "",
            "new"       : "new"
        }, "should return final substitutions");
    });
}());
