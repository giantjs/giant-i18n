/*global giant */
(function () {
    "use strict";

    module("LocaleEnvironment", {
        setup: function () {
            giant.LocaleEnvironment.clearInstanceRegistry();
        },

        teardown: function () {
            giant.LocaleEnvironment.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        var locale = giant.LocaleEnvironment.create();

        ok(locale.entityKey.equals('localeEnvironment/'.toDocumentKey()), "should set entityKey property");

        strictEqual(giant.LocaleEnvironment.create(), locale, "should be singleton");
    });

    test("Current locale getter", function () {
        var environment = giant.LocaleEnvironment.create(),
            currentLocale;

        giant.LocaleEnvironmentDocument.addMocks({
            getCurrentLocaleKey: function () {
                ok(true, "should get current locale key from locale env document");
                return 'locale/bt-br'.toDocumentKey();
            }
        });

        currentLocale = environment.getCurrentLocale();

        giant.LocaleEnvironmentDocument.removeMocks();

        ok(currentLocale.isA(giant.Locale), "should return Locale instance");
        ok(currentLocale.entityKey.equals('locale/bt-br'.toDocumentKey()), "should set locale key in returned Locale");
    });

    test("Current locale setter", function () {
        expect(4);

        var environment = giant.LocaleEnvironment.create();

        throws(function () {
            environment.setCurrentLocale();
        }, "should raise exception on missing argument");

        throws(function () {
            environment.setCurrentLocale('foo/bar'.toDocumentKey);
        }, "should raise exception on invalid argument");

        giant.LocaleEnvironmentDocument.addMocks({
            setCurrentLocaleKey: function (localeKey) {
                ok('locale/foo'.toDocumentKey().equals(localeKey), "should set the specified locale");
            }
        });

        strictEqual(environment.setCurrentLocale('foo'.toLocale()), environment,
            "should be chainable");

        giant.LocaleEnvironmentDocument.removeMocks();
    });

    test("Marking locale as ready", function () {
        expect(4);

        var environment = giant.LocaleEnvironment.create();

        throws(function () {
            environment.markLocaleAsReady();
        }, "should raise exception on missing argument");

        throws(function () {
            environment.markLocaleAsReady('foo/bar'.toDocumentKey);
        }, "should raise exception on invalid argument");

        giant.LocaleEnvironmentDocument.addMocks({
            addReadyLocale: function (localeKey) {
                ok('locale/foo'.toDocumentKey().equals(localeKey),
                    "should add locale to ready locale collection");
            }
        });

        strictEqual(environment.markLocaleAsReady('foo'.toLocale()), environment,
            "should be chainable");

        giant.LocaleEnvironmentDocument.removeMocks();
    });

    test("Locale readiness tester", function () {
        expect(5);

        var environment = giant.LocaleEnvironment.create();

        throws(function () {
            environment.markLocaleAsReady();
        }, "should raise exception on missing argument");

        throws(function () {
            environment.markLocaleAsReady('foo/bar'.toDocumentKey);
        }, "should raise exception on invalid argument");

        giant.LocaleEnvironmentDocument.addMocks({
            getReadyLocale: function (localeKey) {
                ok('locale/foo'.toDocumentKey().equals(localeKey),
                    "should fetch locale readiness from collection");
                return undefined;
            }
        });

        equal(environment.isLocaleMarkedAsReady('foo'.toLocale()), false,
            "should return false for locale not in collection");

        giant.LocaleEnvironmentDocument
            .removeMocks()
            .addMocks({
                getReadyLocale: function () {
                    return true;
                }
            });

        equal(environment.isLocaleMarkedAsReady('foo'.toLocale()), true,
            "should return true for locale present in collection");

        giant.LocaleEnvironmentDocument.removeMocks();
    });

    test("Current locale change handler", function () {
        expect(5);

        function onLocaleChange(event) {
            ok(event.isA(giant.LocaleChangeEvent), "should trigger LocaleChangeEvent");
            ok(event.localeBefore.isA(giant.Locale), "should set before locale");
            ok(event.localeBefore.entityKey.equals('locale/foo'.toDocumentKey()),
                "should set before locale");
            ok(event.localeAfter.isA(giant.Locale), "should set after locale");
            ok(event.localeAfter.entityKey.equals('locale/bar'.toDocumentKey()),
                "should set before locale");
        }

        giant.LocaleEnvironment.create()
            .setCurrentLocale('foo'.toLocale())
            .subscribeTo(giant.EVENT_LOCALE_CHANGE, onLocaleChange)
            .setCurrentLocale('bar'.toLocale())
            .unsubscribeFrom(giant.EVENT_LOCALE_CHANGE, onLocaleChange);
    });

    test("Locale ready handler", function () {
        expect(1);

        ['localeEnvironment', '', 'readyLocales'].toField()
            .unsetNode();

        'foo'.toLocale().setAsCurrentLocale();

        function onCurrentLocaleReady(event) {
            ok(true, "should trigger 'current locale ready' event");
        }

        giant.eventSpace
            .subscribeTo(giant.EVENT_CURRENT_LOCALE_READY, 'locale'.toPath(), onCurrentLocaleReady);

        'bar'.toLocale().markAsReady();

        'foo'.toLocale().markAsReady();

        'baz'.toLocale().markAsReady();

        giant.eventSpace
            .unsubscribeFrom(giant.EVENT_CURRENT_LOCALE_READY, 'locale'.toPath(), onCurrentLocaleReady);
    });

    test("Locale change handler", function () {
        expect(2);

        'localeEnvironment/'.toDocument()
            .unsetNode();

        giant.Field.addMocks({
            touchNode: function () {
                equal(this.entityKey.toString(), 'locale/pt-br/translations',
                    "should touch locale entity when locale is not marked ready");
            }
        });

        'pt-br'.toLocale().setAsCurrentLocale();

        giant.Field.removeMocks();

        'localeEnvironment/'.toDocument()
            .unsetNode();

        'pt-br'.toLocale().markAsReady();

        function onCurrentLocaleReady(event) {
            ok(true, "should trigger 'current locale ready' event when locale is marked ready");
        }

        giant.eventSpace
            .subscribeTo(giant.EVENT_CURRENT_LOCALE_READY, 'locale'.toPath(), onCurrentLocaleReady);

        'pt-br'.toLocale().setAsCurrentLocale();

        giant.eventSpace
            .unsubscribeFrom(giant.EVENT_CURRENT_LOCALE_READY, 'locale'.toPath(), onCurrentLocaleReady);
    });
}());
