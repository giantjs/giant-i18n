(function () {
    "use strict";

    module("Locale");

    test("Instantiation", function () {
        throws(function () {
            $i18n.Locale.create();
        }, "should raise exception on missing arguments");

        var locale = $i18n.Locale.create('locale/pt-br'.toDocumentKey());

        ok(locale.entityKey.equals('locale/pt-br'.toDocumentKey()), "should set entityKey property");
        ok(locale.eventPath.equals('locale>pt-br'.toPath()), "should set eventPath property");
    });

    test("Conversion from string", function () {
        var locale = 'pt-br'.toLocale();

        ok(locale.isA($i18n.Locale), "should return Locale instance");
        ok(locale.entityKey.equals('locale/pt-br'.toDocumentKey()), "should set entityKey property");
    });

    test("Conversion from document key", function () {
        var localeKey = 'locale/pt-br'.toDocumentKey(),
            locale = localeKey.toLocale();

        ok(locale.isA($i18n.Locale), "should return Locale instance");
        ok(locale.entityKey.equals('locale/pt-br'.toDocumentKey()), "should set entityKey property");
    });

    test("Current locale setter", function () {
        expect(2);

        var ptBrLocale = 'pt-br'.toLocale();

        $i18n.LocaleEnvironment.addMocks({
            setCurrentLocale: function (locale) {
                strictEqual(locale, ptBrLocale, "should set as current locale on environment");
            }
        });

        strictEqual(ptBrLocale.setAsCurrentLocale(), ptBrLocale, "should be chainable");

        $i18n.LocaleEnvironment.removeMocks();
    });

    test("Marking locale as ready", function () {
        expect(2);

        var ptBrLocale = 'pt-br'.toLocale();

        $i18n.LocaleEnvironment.addMocks({
            markLocaleAsReady: function (locale) {
                strictEqual(locale, ptBrLocale, "should mark as locale as ready on environment");
            }
        });

        strictEqual(ptBrLocale.markAsReady(), ptBrLocale, "should be chainable");

        $i18n.LocaleEnvironment.removeMocks();
    });

    test("Testing for locale readiness", function () {
        expect(2);

        var ptBrLocale = 'pt-br'.toLocale(),
            result = {};

        $i18n.LocaleEnvironment.addMocks({
            isLocaleMarkedAsReady: function (locale) {
                strictEqual(locale, ptBrLocale, "should test locale readiness on environment");
                return result;
            }
        });

        strictEqual(ptBrLocale.isMarkedAsReady(), result,
            "should return value returned by environment");

        $i18n.LocaleEnvironment.removeMocks();
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
        equal(locale.getTranslation('apple', 0), 'apples',
            "should return plural form when multiplicity is 0");
        equal(locale.getTranslation('apple', 1), 'apple',
            "should return singular form when multiplicity is 1");
        equal(locale.getTranslation('apple', 2), 'apples',
            "should return plural form when multiplicity is 1");
    });

    test("Serialization", function () {
        var locale = 'pt-br'.toLocale();
        equal(locale.toString(), 'pt-br', "should return locale document ID");
    });

    test("Locale ready handler", function () {
        expect(1);

        ['localeEnvironment', '', 'readyLocales'].toField()
            .unsetNode();

        function onLocaleReady(event) {
            ok(event.sender.entityKey.equals('locale/pt-br'.toDocumentKey()),
                "should trigger ready event");
        }

        $event.eventSpace
            .subscribeTo($i18n.EVENT_LOCALE_READY, 'locale'.toPath(), onLocaleReady);

        ['localeEnvironment', '', 'readyLocales', 'locale/pt-br'].toItem()
            .setValue(true);

        $event.eventSpace
            .unsubscribeFrom($i18n.EVENT_LOCALE_READY, 'locale'.toPath(), onLocaleReady);
    });
}());
