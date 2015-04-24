/*global dessert, troop, sntls, flock, bookworm, v18n */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Translatable");

    test("Instantiation", function () {
        var translatable = v18n.Translatable.create('foo');
        equal(translatable.originalString, 'foo', "should set originalSting property");
        equal(translatable.multiplicity, 1, "should set multiplicity property");
    });

    test("Conversion from string", function () {
        var translatable = 'foo'.toTranslatable();
        ok(translatable.isA(v18n.Translatable), "should return Translatable instance");
        equal(translatable.originalString, 'foo', "should set originalSting property");
    });

    test("Multiplicity setter", function () {
        var translatable = 'foo'.toTranslatable();
        strictEqual(translatable.setMultiplicity(5), translatable, "should be chainable");
        equal(translatable.multiplicity, 5, "should set multiplicity property");
    });

    test("Serializing literal-based translatable", function () {
        var translatable = 'foo'.toTranslatable();

        'locale/current'.toDocument().unsetKey();

        equal(translatable.toString(), 'foo',
            "should return original string when no current locale is set");

        'locale/current'.toDocument().setNode({
            translations: {
                foo: ['bar']
            }
        });

        equal(translatable.toString(), 'bar',
            "should return translated string when current locale is set");
    });

    test("Serializing stringifiable-based translatable", function () {
        var template = 'hello {{ foo }} world'.toLiveTemplate()
                .addReplacements({
                    '{{ foo }}': "all the"
                }),
            translatable = v18n.Translatable.create(template);

        'locale/current'.toDocument().setNode({
            translations: {
                'hello all the world': ["HELLO ALL THE WORLD"]
            }
        });

        equal(translatable.toString(), "HELLO ALL THE WORLD",
            "should return translated string according to resolved stringifiable");
    });
}());
