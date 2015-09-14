/*global giant */
(function () {
    "use strict";

    module("LocaleBound");

    var LocaleBoundClass = giant.Base.extend()
        .addTrait(giant.LocaleBound)
        .addMethods({
            init: function () {
                giant.LocaleBound.init.call(this);
            }
        });

    test("Instantiation", function () {
        var localeBound = LocaleBoundClass.create();

        ok(localeBound.localeBindings.isA(giant.Collection), "should initialize localeBindings property");
        deepEqual(localeBound.localeBindings.items, {
            'giant.Locale.ready.current': []
        }, "should set localeBindings contents");
    });

    test("Binding to 'current locale change'", function () {
        expect(6);

        function onCurrentLocaleReady() {
        }

        var localeBound = LocaleBoundClass.create();

        throws(function () {
            localeBound.bindToCurrentLocaleReady();
        }, "should raise exception on missing arguments");

        throws(function () {
            localeBound.bindToCurrentLocaleReady('foo');
        }, "should raise exception on invalid arguments");

        giant.LocaleEnvironment.addMocks({
            subscribeTo: function (eventName, handler) {
                equal(eventName, giant.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY,
                    "should subscribe to current locale change event");
                strictEqual(handler, onCurrentLocaleReady, "should pass handler to subscription");
            }
        });

        strictEqual(localeBound.bindToCurrentLocaleReady(onCurrentLocaleReady), localeBound, "should be chainable");

        deepEqual(localeBound.localeBindings.items, {
            'giant.Locale.ready.current': [onCurrentLocaleReady]
        }, "should add handler to handler lookup");

        giant.LocaleEnvironment.removeMocks();
    });

    test("Re-binding to 'current locale change'", function () {
        function onCurrentLocaleReady() {
        }

        var localeBound = LocaleBoundClass.create()
            .bindToCurrentLocaleReady(onCurrentLocaleReady);

        deepEqual(localeBound.localeBindings.items, {
            'giant.Locale.ready.current': [onCurrentLocaleReady]
        }, "should not change handler lookup");
    });

    test("Unbinding from 'current locale change'", function () {
        expect(6);

        function onCurrentLocaleReady() {
        }

        var localeBound = LocaleBoundClass.create()
            .bindToCurrentLocaleReady(onCurrentLocaleReady);

        throws(function () {
            localeBound.unbindFromCurrentLocaleReady();
        }, "should raise exception on missing arguments");

        throws(function () {
            localeBound.unbindFromCurrentLocaleReady('foo');
        }, "should raise exception on invalid arguments");

        giant.LocaleEnvironment.addMocks({
            unsubscribeFrom: function (eventName, handler) {
                equal(eventName, giant.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY,
                    "should unsubscribe from current locale change event");
                strictEqual(handler, onCurrentLocaleReady, "should pass handler to unsubscription");
            }
        });

        strictEqual(localeBound.unbindFromCurrentLocaleReady(onCurrentLocaleReady), localeBound, "should be chainable");

        deepEqual(localeBound.localeBindings.items, {
            'giant.Locale.ready.current': []
        }, "should remove handler from handler lookup");

        giant.LocaleEnvironment.removeMocks();
    });

    test("Re-unbinding from 'current locale change'", function () {
        function onCurrentLocaleReady() {
        }

        var localeBound = LocaleBoundClass.create()
            .bindToCurrentLocaleReady(onCurrentLocaleReady)
            .unbindFromCurrentLocaleReady(onCurrentLocaleReady);

        deepEqual(localeBound.localeBindings.items, {
            'giant.Locale.ready.current': []
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

        giant.LocaleEnvironment.addMocks({
            unsubscribeFrom: function (eventName, handler) {
                unsubscribedHandlers.push([eventName, handler]);
            }
        });

        strictEqual(localeBound.unbindAll(), localeBound, "should be chainable");

        giant.LocaleEnvironment.removeMocks();

        deepEqual(unsubscribedHandlers, [
            [giant.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY, onCurrentLocaleReady1],
            [giant.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY, onCurrentLocaleReady2],
            [giant.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY, onCurrentLocaleReady3],
            [giant.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY, onCurrentLocaleReady4]
        ], "should unsubscribe from handlers");

        deepEqual(localeBound.localeBindings.items, {
            'giant.Locale.ready.current': []
        }, "should remove all handlers from lookup");
    });
}());
