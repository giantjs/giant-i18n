/*global giant */
(function () {
    "use strict";

    module("LocaleChangeEvent");

    test("Instantiation", function () {
        var event = giant.LocaleChangeEvent.create('foo', giant.eventSpace);

        ok(event.hasOwnProperty('localeBefore'), "should set localeBefore property");
        ok(event.hasOwnProperty('localeAfter'), "should set localeAfter property");
    });

    test("Conversion from Event", function () {
        var event = giant.Event.create('locale.change.foo', giant.eventSpace);
        ok(event.isA(giant.LocaleChangeEvent), "should return LocaleChangeEvent instance");
    });
}());
