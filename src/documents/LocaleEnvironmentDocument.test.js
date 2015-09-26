(function () {
    "use strict";

    module("LocaleEnvironmentDocument");

    test("Document surrogate", function () {
        var document = 'localeEnvironment/foo'.toDocument();
        ok(document.isA($i18n.LocaleEnvironmentDocument), "should return LocaleEnvironmentDocument instance");
    });

    test("Current locale key getter", function () {
        var environmentDocument = 'localeEnvironment/foo'.toDocument();

        environmentDocument
            .setNode({
                currentLocale: 'locale/foo'
            });

        var localeKey = environmentDocument.getCurrentLocaleKey();

        ok('locale/foo'.toDocumentKey().equals(localeKey), "should fetch current locale key from environment");

        environmentDocument.unsetNode();

        equal(typeof environmentDocument.getCurrentLocaleKey(), 'undefined',
            "should return undefined when current locale is not set");
    });

    test("Current locale key setter", function () {
        var environmentDocument = 'localeEnvironment/foo'.toDocument().unsetNode();

        throws(function () {
            environmentDocument.setCurrentLocaleKey();
        }, "should raise exception on missing argument");

        throws(function () {
            environmentDocument.setCurrentLocaleKey('foo');
        }, "should raise exception on invalid argument");

        strictEqual(environmentDocument.setCurrentLocaleKey('locale/foo'.toDocumentKey()), environmentDocument,
            "should be chainable");

        deepEqual(environmentDocument.getNode(), {
            currentLocale: 'locale/foo'
        }, "should set specified locale key as current");
    });

    test("Adding ready locale", function () {
        var environmentDocument = 'localeEnvironment/foo'.toDocument().unsetNode();

        throws(function () {
            environmentDocument.addReadyLocale();
        }, "should raise exception on missing argument");

        throws(function () {
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

    test("Ready locale getter", function () {
        var environmentDocument = 'localeEnvironment/foo'.toDocument()
            .unsetNode()
            .addReadyLocale('locale/pt-br'.toDocumentKey());

        throws(function () {
            environmentDocument.getReadyLocale();
        }, "should raise exception on missing argument");

        throws(function () {
            environmentDocument.getReadyLocale('foo');
        }, "should raise exception on invalid argument");

        ok(!environmentDocument.getReadyLocale('locale/en-uk'.toDocumentKey()),
            "should return false for locale that is not marked ready");

        ok(environmentDocument.getReadyLocale('locale/pt-br'.toDocumentKey()),
            "should return true for locale that is marked ready");
    });
}());
