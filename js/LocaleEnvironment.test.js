/*global dessert, troop, sntls, flock, bookworm, v18n */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("LocaleEnvironment", {
        setup: function () {
            v18n.LocaleEnvironment.clearInstanceRegistry();
        },

        teardown: function () {
            v18n.LocaleEnvironment.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        var locale = v18n.LocaleEnvironment.create();

        ok(locale.entityKey.equals('localeEnvironment/default'.toDocumentKey()), "should set entityKey property");

        strictEqual(v18n.LocaleEnvironment.create(), locale, "should be singleton");
    });

    test("Current locale getter", function () {
        var environment = v18n.LocaleEnvironment.create(),
            currentLocale;

        v18n.LocaleEnvironmentDocument.addMocks({
            getCurrentLocaleKey: function () {
                ok(true, "should get current locale key from locale env document");
                return 'locale/bt-br'.toDocumentKey();
            }
        });

        currentLocale = environment.getCurrentLocale();

        v18n.LocaleEnvironmentDocument.removeMocks();

        ok(currentLocale.isA(v18n.Locale), "should return Locale instance");
        ok(currentLocale.entityKey.equals('locale/bt-br'.toDocumentKey()), "should set locale key in returned Locale");
    });

    test("Current locale setter", function () {
        expect(4);

        var environment = v18n.LocaleEnvironment.create();

        raises(function () {
            environment.setCurrentLocale();
        }, "should raise exception on missing argument");

        raises(function () {
            environment.setCurrentLocale('foo/bar'.toDocumentKey);
        }, "should raise exception on invalid argument");

        v18n.LocaleEnvironmentDocument.addMocks({
            setCurrentLocaleKey: function (localeKey) {
                ok('locale/foo'.toDocumentKey().equals(localeKey), "should set the specified locale");
            }
        });

        strictEqual(environment.setCurrentLocale('foo'.toLocale()), environment,
            "should be chainable");

        v18n.LocaleEnvironmentDocument.removeMocks();
    });

    test("Marking locale as ready", function () {
        expect(4);

        var environment = v18n.LocaleEnvironment.create();

        raises(function () {
            environment.markLocaleAsReady();
        }, "should raise exception on missing argument");

        raises(function () {
            environment.markLocaleAsReady('foo/bar'.toDocumentKey);
        }, "should raise exception on invalid argument");

        v18n.LocaleEnvironmentDocument.addMocks({
            addReadyLocale: function (localeKey) {
                ok('locale/foo'.toDocumentKey().equals(localeKey),
                    "should add locale to ready locale collection");
            }
        });

        strictEqual(environment.markLocaleAsReady('foo'.toLocale()), environment,
            "should be chainable");

        v18n.LocaleEnvironmentDocument.removeMocks();
    });

    test("Locale change handler", function () {
        expect(5);

        v18n.LocaleEnvironment.create()
            .setCurrentLocale('foo'.toLocale())
            .subscribeTo('locale.change', function (event) {
                ok(event.isA(v18n.LocaleChangeEvent), "should trigger LocaleChangeEvent");
                ok(event.localeBefore.isA(v18n.Locale), "should set before locale");
                ok(event.localeBefore.entityKey.equals('locale/foo'.toDocumentKey()),
                    "should set before locale");
                ok(event.localeAfter.isA(v18n.Locale), "should set after locale");
                ok(event.localeAfter.entityKey.equals('locale/bar'.toDocumentKey()),
                    "should set before locale");
            })
            .setCurrentLocale('bar'.toLocale());
    });
}());
