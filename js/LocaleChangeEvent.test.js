/*global dessert, troop, sntls, evan, bookworm, v18n */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("LocaleChangeEvent");

    test("Instantiation", function () {
        var event = v18n.LocaleChangeEvent.create('foo', evan.eventSpace);

        ok(event.hasOwnProperty('localeBefore'), "should set localeBefore property");
        ok(event.hasOwnProperty('localeAfter'), "should set localeAfter property");
    });

    test("Conversion from Event", function () {
        var event = evan.Event.create('locale.change.foo', evan.eventSpace);
        ok(event.isA(v18n.LocaleChangeEvent), "should return LocaleChangeEvent instance");
    });
}());
