/*global dessert, troop, sntls, evan, flock, bookworm, v18n */
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

    test("Locale readiness tester", function () {
        expect(5);

        var environment = v18n.LocaleEnvironment.create();

        raises(function () {
            environment.markLocaleAsReady();
        }, "should raise exception on missing argument");

        raises(function () {
            environment.markLocaleAsReady('foo/bar'.toDocumentKey);
        }, "should raise exception on invalid argument");

        v18n.LocaleEnvironmentDocument.addMocks({
            getReadyLocale: function (localeKey) {
                ok('locale/foo'.toDocumentKey().equals(localeKey),
                    "should fetch locale readiness from collection");
                return undefined;
            }
        });

        equal(environment.isLocaleMarkedAsReady('foo'.toLocale()), false,
            "should return false for locale not in collection");

        v18n.LocaleEnvironmentDocument
            .removeMocks()
            .addMocks({
                getReadyLocale: function () {
                    return true;
                }
            });

        equal(environment.isLocaleMarkedAsReady('foo'.toLocale()), true,
            "should return true for locale present in collection");

        v18n.LocaleEnvironmentDocument.removeMocks();
    });

    test("Current locale change handler", function () {
        expect(5);

        function onLocaleChange(event) {
            ok(event.isA(v18n.LocaleChangeEvent), "should trigger LocaleChangeEvent");
            ok(event.localeBefore.isA(v18n.Locale), "should set before locale");
            ok(event.localeBefore.entityKey.equals('locale/foo'.toDocumentKey()),
                "should set before locale");
            ok(event.localeAfter.isA(v18n.Locale), "should set after locale");
            ok(event.localeAfter.entityKey.equals('locale/bar'.toDocumentKey()),
                "should set before locale");
        }

        v18n.LocaleEnvironment.create()
            .setCurrentLocale('foo'.toLocale())
            .subscribeTo('locale.change', onLocaleChange)
            .setCurrentLocale('bar'.toLocale())
            .unsubscribeFrom('locale.change', onLocaleChange);
    });

    test("Locale ready handler", function () {
        expect(1);

        ['localeEnvironment', 'default', 'readyLocales'].toField()
            .unsetKey();

        'foo'.toLocale().setAsCurrentLocale();

        function onCurrentLocaleReady(event) {
            ok(true, "should trigger 'current locale ready' event");
        }

        evan.eventSpace
            .subscribeTo('locale.ready.current', 'locale'.toPath(), onCurrentLocaleReady);

        'bar'.toLocale().markAsReady();

        'foo'.toLocale().markAsReady();

        'baz'.toLocale().markAsReady();

        evan.eventSpace
            .unsubscribeFrom('locale.ready.current', 'locale'.toPath(), onCurrentLocaleReady);
    });

    test("Locale change handler", function () {
        expect(1);

        'localeEnvironment/default'.toDocument()
            .unsetKey();

        'pt-br'.toLocale().markAsReady();

        function onCurrentLocaleReady(event) {
            ok(true, "should trigger 'current locale ready' event");
        }

        evan.eventSpace
            .subscribeTo('locale.ready.current', 'locale'.toPath(), onCurrentLocaleReady);

        'pt-br'.toLocale().setAsCurrentLocale();

        evan.eventSpace
            .unsubscribeFrom('locale.ready.current', 'locale'.toPath(), onCurrentLocaleReady);
    });
}());
