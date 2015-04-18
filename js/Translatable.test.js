/*global dessert, troop, sntls, flock, bookworm, v18n */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Translatable");

    test("Instantiation", function () {
        var translatable = v18n.Translatable.create('foo');
        equal(translatable.originalString, 'foo', "should set originalSting property");
    });

    test("Conversion from string", function () {
        var translatable = 'foo'.toTranslatable();
        ok(translatable.isA(v18n.Translatable), "should return Translatable instance");
        equal(translatable.originalString, 'foo', "should set originalSting property");
    });

    test("Conversion to string", function () {
        var translatable = 'foo'.toTranslatable();

        'locale/current'.toDocument().unsetKey();

        equal(translatable.toString(), 'foo',
            "should return original string when no current locale is set");

        'locale/current'.toDocument().setNode({
            translations: {
                foo: 'bar'
            }
        });

        equal(translatable.toString(), 'bar',
            "should return translated string when current locale is set");
    });
}());
