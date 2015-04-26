/*global dessert, troop, sntls, evan, bookworm, v18n */
/*global module, test, asyncTest, start, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("LocaleEnvironmentDocument");

    test("Document surrogate", function () {
        var document = 'localeEnvironment/foo'.toDocument();
        ok(document.isA(v18n.LocaleEnvironmentDocument), "should return LocaleEnvironmentDocument instance");
    });

    test("Current locale key getter", function () {
        var environmentDocument = 'localeEnvironment/foo'.toDocument();

        environmentDocument
            .setNode({
                currentLocale: 'locale/foo'
            });

        var localeKey = environmentDocument.getCurrentLocaleKey();

        ok('locale/foo'.toDocumentKey().equals(localeKey), "should fetch current locale key from environment");

        environmentDocument.unsetKey();

        equal(typeof environmentDocument.getCurrentLocaleKey(), 'undefined',
            "should return undefined when current locale is not set");
    });

    test("Current locale key setter", function () {
        var environmentDocument = 'localeEnvironment/foo'.toDocument().unsetKey();

        raises(function () {
            environmentDocument.setCurrentLocaleKey();
        }, "should raise exception on missing argument");

        raises(function () {
            environmentDocument.setCurrentLocaleKey('foo');
        }, "should raise exception on invalid argument");

        strictEqual(environmentDocument.setCurrentLocaleKey('locale/foo'.toDocumentKey()), environmentDocument,
            "should be chainable");

        deepEqual(environmentDocument.getNode(), {
            currentLocale: 'locale/foo'
        }, "should set specified locale key as current");
    });

    test("Adding locale", function () {
        var environmentDocument = 'localeEnvironment/foo'.toDocument().unsetKey();

        raises(function () {
            environmentDocument.addReadyLocale();
        }, "should raise exception on missing argument");

        raises(function () {
            environmentDocument.addReadyLocale('foo');
        }, "should raise exception on invalid argument");

        strictEqual(environmentDocument.addReadyLocale('locale/foo'.toDocumentKey()), environmentDocument,
            "should be chainable");

        deepEqual(environmentDocument.getNode(), {
            readyLocales: {
                'locale/foo': true
            }
        }, "should set specified locale key as current");
    });
}());
