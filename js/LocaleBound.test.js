/*global dessert, troop, sntls, evan, flock, bookworm, v18n */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("LocaleBound");

    var LocaleBoundClass = troop.Base.extend()
        .addTrait(v18n.LocaleBound)
        .addMethods({
            init: function () {
                v18n.LocaleBound.init.call(this);
            }
        });

    test("Instantiation", function () {
        var localeBound = LocaleBoundClass.create();

        ok(localeBound.localeBindings.isA(sntls.Collection), "should initialize localeBindings property");
        deepEqual(localeBound.localeBindings.items, {
            'locale.ready.current': []
        }, "should set localeBindings contents");
    });

    test("Binding to 'current locale change'", function () {
        expect(6);

        function onCurrentLocaleReady() {
        }

        var localeBound = LocaleBoundClass.create();

        raises(function () {
            localeBound.bindToCurrentLocaleReady();
        }, "should raise exception on missing arguments");

        raises(function () {
            localeBound.bindToCurrentLocaleReady('foo');
        }, "should raise exception on invalid arguments");

        v18n.LocaleEnvironment.addMocks({
            subscribeTo: function (eventName, handler) {
                equal(eventName, v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY,
                    "should subscribe to current locale change event");
                strictEqual(handler, onCurrentLocaleReady, "should pass handler to subscription");
            }
        });

        strictEqual(localeBound.bindToCurrentLocaleReady(onCurrentLocaleReady), localeBound, "should be chainable");

        deepEqual(localeBound.localeBindings.items, {
            'locale.ready.current': [onCurrentLocaleReady]
        }, "should add handler to handler lookup");

        v18n.LocaleEnvironment.removeMocks();
    });

    test("Re-binding to 'current locale change'", function () {
        function onCurrentLocaleReady() {
        }

        var localeBound = LocaleBoundClass.create()
            .bindToCurrentLocaleReady(onCurrentLocaleReady);

        deepEqual(localeBound.localeBindings.items, {
            'locale.ready.current': [onCurrentLocaleReady]
        }, "should not change handler lookup");
    });

    test("Unbinding from 'current locale change'", function () {
        expect(6);

        function onCurrentLocaleReady() {
        }

        var localeBound = LocaleBoundClass.create()
            .bindToCurrentLocaleReady(onCurrentLocaleReady);

        raises(function () {
            localeBound.unbindFromCurrentLocaleReady();
        }, "should raise exception on missing arguments");

        raises(function () {
            localeBound.unbindFromCurrentLocaleReady('foo');
        }, "should raise exception on invalid arguments");

        v18n.LocaleEnvironment.addMocks({
            unsubscribeFrom: function (eventName, handler) {
                equal(eventName, v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY,
                    "should unsubscribe from current locale change event");
                strictEqual(handler, onCurrentLocaleReady, "should pass handler to unsubscription");
            }
        });

        strictEqual(localeBound.unbindFromCurrentLocaleReady(onCurrentLocaleReady), localeBound, "should be chainable");

        deepEqual(localeBound.localeBindings.items, {
            'locale.ready.current': []
        }, "should remove handler from handler lookup");

        v18n.LocaleEnvironment.removeMocks();
    });

    test("Re-unbinding from 'current locale change'", function () {
        function onCurrentLocaleReady() {
        }

        var localeBound = LocaleBoundClass.create()
            .bindToCurrentLocaleReady(onCurrentLocaleReady)
            .unbindFromCurrentLocaleReady(onCurrentLocaleReady);

        deepEqual(localeBound.localeBindings.items, {
            'locale.ready.current': []
        }, "should not change handler lookup");
    });

    test("Unbinding from all locale bindings", function () {
        function onCurrentLocaleReady1() {
        }

        function onCurrentLocaleReady2() {
        }

        function onCurrentLocaleReady3() {
        }

        function onCurrentLocaleReady4() {
        }

        var localeBound = LocaleBoundClass.create()
                .bindToCurrentLocaleReady(onCurrentLocaleReady1)
                .bindToCurrentLocaleReady(onCurrentLocaleReady2)
                .bindToCurrentLocaleReady(onCurrentLocaleReady3)
                .bindToCurrentLocaleReady(onCurrentLocaleReady4),
            unsubscribedHandlers = [];

        v18n.LocaleEnvironment.addMocks({
            unsubscribeFrom: function (eventName, handler) {
                unsubscribedHandlers.push([eventName, handler]);
            }
        });

        strictEqual(localeBound.unbindAll(), localeBound, "should be chainable");

        v18n.LocaleEnvironment.removeMocks();

        deepEqual(unsubscribedHandlers, [
            [v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY, onCurrentLocaleReady1],
            [v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY, onCurrentLocaleReady2],
            [v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY, onCurrentLocaleReady3],
            [v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY, onCurrentLocaleReady4]
        ], "should unsubscribe from handlers");

        deepEqual(localeBound.localeBindings.items, {
            'locale.ready.current': []
        }, "should remove all handlers from lookup");
    });
}());
