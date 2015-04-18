/*global dessert, troop, sntls, evan, bookworm, v18n */
/*global module, test, asyncTest, start, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("StringFormat");

    test("Instantiation with literal only", function () {
        var format = v18n.StringFormat.create('foo');

        equal(format.format, 'foo', "should set format property");
        equal(format.tokens, format.format, "should set tokens property");
    });

    test("Instantiation with placholders", function () {
        var format = v18n.StringFormat.create('foo {{ bar }} baz');

        equal(format.format, 'foo {{ bar }} baz', "should set format property");
        deepEqual(format.tokens, [
            'foo ',
            '{{ bar }}',
            ' baz'
        ], "should set tokens property");
    });

    test("Instantiation with placeholder only", function () {
        var format = v18n.StringFormat.create('{{ bar }}');

        equal(format.format, '{{ bar }}', "should set format property");
        equal(format.tokens, '{{ bar }}', "should set tokens property");
    });

    test("Conversion from string", function () {
        var format = 'foo'.toStringFormat();

        ok(format.isA(v18n.StringFormat), "should return StringFormat instance");
        equal(format.format, 'foo', "should set format property");
    });

    test("Setting content", function () {
        var format = 'foo {{ bar }} baz'.toStringFormat();

        equal(
            format.setContent({
                '{{ bar }}'  : "Hello {{ world }}",
                '{{ world }}': "World!"
            }),
            "foo Hello World! baz",
            "should return string with all substitutions");
    });

    test("Setting empty content", function () {
        var format = 'foo {{ bar }} baz'.toStringFormat();

        equal(
            format.setContent({
                '{{ bar }}': undefined
            }),
            "foo {{ bar }} baz",
            "should return string with undefined placeholders left intact");
    });

    test("Setting stringifiable content", function () {
        var format = 'foo {{ bar }} baz'.toStringFormat();

        equal(
            format.setContent({
                '{{ bar }}': {}
            }),
            "foo [object Object] baz",
            "should return string with stringified substitutions");
    });
}());
