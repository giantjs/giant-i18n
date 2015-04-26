/*global dessert, troop, sntls, flock, bookworm, v18n */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Locale");

    test("Instantiation", function () {
        raises(function () {
            v18n.Locale.create();
        }, "should raise exception on missing arguments");

        var locale = v18n.Locale.create('locale/pt-br'.toDocumentKey());

        ok(locale.entityKey.equals('locale/pt-br'.toDocumentKey()), "should set entityKey property");
    });

    test("Conversion from string", function () {
        var locale = 'pt-br'.toLocale();

        ok(locale.isA(v18n.Locale), "should return Locale instance");
        ok(locale.entityKey.equals('locale/pt-br'.toDocumentKey()), "should set entityKey property");
    });

    test("Conversion from document key", function () {
        var localeKey = 'locale/pt-br'.toDocumentKey(),
            locale = localeKey.toLocale();

        ok(locale.isA(v18n.Locale), "should return Locale instance");
        ok(locale.entityKey.equals('locale/pt-br'.toDocumentKey()), "should set entityKey property");
    });

    test("Current locale setter", function () {
        expect(2);

        var ptBrLocale = 'pt-br'.toLocale();

        v18n.LocaleEnvironment.addMocks({
            setCurrentLocale: function (locale) {
                strictEqual(locale, ptBrLocale, "should set as current locale on environment");
            }
        });

        strictEqual(ptBrLocale.setAsCurrentLocale(), ptBrLocale, "should be chainable");

        v18n.LocaleEnvironment.removeMocks();
    });

    test("Marking locale as ready", function () {
        expect(2);

        var ptBrLocale = 'pt-br'.toLocale();

        v18n.LocaleEnvironment.addMocks({
            markLocaleAsReady: function (locale) {
                strictEqual(locale, ptBrLocale, "should mark as locale as ready on environment");
            }
        });

        strictEqual(ptBrLocale.markAsReady(), ptBrLocale, "should be chainable");

        v18n.LocaleEnvironment.removeMocks();
    });

    test("Translation getter", function () {
        'locale/en-uk'.toDocument()
            .setPluralFormula('nplurals=2; plural=(n != 1);')
            .setTranslations({
                'apple': ['apple', 'apples']
            });

        var locale = 'en-uk'.toLocale()
            .setAsCurrentLocale();

        equal(locale.getTranslation('pear'), 'pear',
            "should return original string when there is no match");
        equal(locale.getTranslation('apple'), 'apple',
            "should return singular form when multiplicity is not specified");
        equal(locale.getTranslation('apple', 1), 'apple',
            "should return singular form when multiplicity is 1");
        equal(locale.getTranslation('apple', 2), 'apples',
            "should return singular form when multiplicity is 1");
    });
}());
