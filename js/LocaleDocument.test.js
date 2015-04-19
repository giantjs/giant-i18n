/*global dessert, troop, sntls, evan, bookworm, v18n */
/*global module, test, asyncTest, start, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("LocaleDocument");

    test("Document surrogate", function () {
        var document = 'locale/foo'.toDocument();
        ok(document.isA(v18n.LocaleDocument), "should return LocaleDocument instance");
    });

    test("Translation getter", function () {
        var localeDocument = 'locale/foo'.toDocument();

        localeDocument.setNode({
            translations: {
                cat: ['cat', 'cats']
            }
        });

        equal(typeof localeDocument.getTranslation('dog'), 'undefined',
            "should return undefined for missing translation");
        equal(localeDocument.getTranslation('cat'), 'cat',
            "should return zero plural-index translation when none is specified");
        equal(localeDocument.getTranslation('cat', 1), 'cats',
            "should return specified plural-index translation");
    });
}());
