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

    test("Locale registration", function () {
        expect(4);

        var environment = v18n.LocaleEnvironment.create();

        raises(function () {
            environment.registerLocale();
        }, "should raise exception on missing argument");

        raises(function () {
            environment.registerLocale('foo/bar'.toDocumentKey);
        }, "should raise exception on invalid argument");

        v18n.LocaleEnvironmentDocument.addMocks({
            addLocale: function (localeKey) {
                ok('locale/foo'.toDocumentKey().equals(localeKey), "should register the specified locale");
            }
        });

        strictEqual(environment.registerLocale('foo'.toLocale()), environment,
            "should be chainable");

        v18n.LocaleEnvironmentDocument.removeMocks();
    });
}());
