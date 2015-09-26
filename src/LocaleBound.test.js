(function () {
    "use strict";

    module("LocaleBound");

    var LocaleBoundClass = $oop.Base.extend()
        .addTrait($i18n.LocaleBound)
        .addMethods({
            init: function () {
                $i18n.LocaleBound.init.call(this);
            },

            onCurrentLocaleReady: function () {
            }
        });

    test("Instantiation", function () {
        var localeBound = LocaleBoundClass.create();

        ok(localeBound.localeBindings.isA($data.Tree),
            "should initialize localeBindings property");
        deepEqual(localeBound.localeBindings.items, {}, "should set localeBindings contents");
    });

    test("Binding to 'current locale change'", function () {
        expect(5);

        var localeBound = LocaleBoundClass.create();

        throws(function () {
            localeBound.bindToCurrentLocaleReady();
        }, "should raise exception on missing arguments");

        throws(function () {
            localeBound.bindToCurrentLocaleReady('foo');
        }, "should raise exception on invalid arguments");

        localeBound.addMocks({
            onCurrentLocaleReady: function (event) {
                strictEqual(event.sender, $i18n.LocaleEnvironment.create(),
                    "should set sender on event");
                equal(event.eventName, 'locale.ready.current', "should set eventName on event");
            }
        });

        strictEqual(localeBound.bindToCurrentLocaleReady('onCurrentLocaleReady'), localeBound,
            "should be chainable");

        // should trigger
        $i18n.LocaleEnvironment.create().triggerSync($i18n.EVENT_CURRENT_LOCALE_READY);

        localeBound.unbindAll();
    });

    test("Re-binding to 'current locale change'", function () {
        expect(0);

        var localeBound = LocaleBoundClass.create()
            .bindToCurrentLocaleReady('onCurrentLocaleReady');

        $i18n.LocaleEnvironment.addMocks({
            subscribeTo: function () {
                ok(false, "should not subscribe again");
            }
        });

        localeBound.bindToCurrentLocaleReady('onCurrentLocaleReady');

        $i18n.LocaleEnvironment.removeMocks();
    });

    test("Unbinding from 'current locale change'", function () {
        var localeBound = LocaleBoundClass.create()
            .bindToCurrentLocaleReady('onCurrentLocaleReady');

        throws(function () {
            localeBound.unbindFromCurrentLocaleReady();
        }, "should raise exception on missing arguments");

        throws(function () {
            localeBound.unbindFromCurrentLocaleReady('foo');
        }, "should raise exception on invalid arguments");

        localeBound.addMocks({
            onCurrentLocaleReady: function () {
                ok(false, "should not trigger");
            }
        });

        strictEqual(localeBound.unbindFromCurrentLocaleReady('onCurrentLocaleReady'), localeBound,
            "should be chainable");

        // should NOT trigger
        $i18n.LocaleEnvironment.create().triggerSync($i18n.EVENT_CURRENT_LOCALE_READY);
    });

    test("Re-unbinding from 'current locale change'", function () {
        expect(0);

        var localeBound = LocaleBoundClass.create()
            .bindToCurrentLocaleReady('onCurrentLocaleReady')
            .unbindFromCurrentLocaleReady('onCurrentLocaleReady');

        $i18n.LocaleEnvironment.addMocks({
            unsubscribeFrom: function () {
                ok(false, "should not subscribe again");
            }
        });

        localeBound.unbindFromCurrentLocaleReady('onCurrentLocaleReady');

        $i18n.LocaleEnvironment.removeMocks();
    });

    test("Unbinding from all locale bindings", function () {
        LocaleBoundClass.addMocks({
            onCurrentLocaleReady1: function () {
                ok(false, "should not trigger any handler");
            },
            onCurrentLocaleReady2: function () {
                ok(false, "should not trigger any handler");
            },
            onCurrentLocaleReady3: function () {
                ok(false, "should not trigger any handler");
            },
            onCurrentLocaleReady4: function () {
                ok(false, "should not trigger any handler");
            }
        });

        var localeBound = LocaleBoundClass.create()
            .bindToCurrentLocaleReady('onCurrentLocaleReady1')
            .bindToCurrentLocaleReady('onCurrentLocaleReady2')
            .bindToCurrentLocaleReady('onCurrentLocaleReady3')
            .bindToCurrentLocaleReady('onCurrentLocaleReady4');

        strictEqual(localeBound.unbindAll(), localeBound, "should be chainable");

        // should NOT trigger
        $i18n.LocaleEnvironment.create().triggerSync($i18n.EVENT_CURRENT_LOCALE_READY);

        LocaleBoundClass.removeMocks();
    });
}());
