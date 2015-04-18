/*global dessert, troop, sntls, flock, bookworm, v18n */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Locale");

    test("Instantiation", function () {
        raises(function () {
            v18n.Locale.create();
        }, "should raise exception on missing arguments");

        var locale = v18n.Locale.create('locale/pt-br'.toDocumentKey());

        ok(locale.entityKey.equals('locale/pt-br'.toDocumentKey()), "should set entityKey property");
    });

    test("Conversion from string", function () {
        var locale = 'pt-br'.toLocale();

        ok(locale.isA(v18n.Locale), "should return Locale instance");
        ok(locale.entityKey.equals('locale/pt-br'.toDocumentKey()), "should set entityKey property");
    });

    test("Current locale setter", function () {
        expect(4);

        var locale = 'pt-br'.toLocale(),
            localeNode = {};


        bookworm.entities.addMocks({
            getNode: function (path) {
                ok(path.equals('document>locale>pt-br'.toPath()), "should get document node");
                return localeNode;
            },

            setNode: function (path, node) {
                ok(path.equals('document>locale>current'.toPath()), "should set current locale node");
                strictEqual(node, localeNode, "should pass node fetched from specified locale");
            }
        });

        strictEqual(locale.setAsCurrentLocale(), locale, "should be chainable");

        bookworm.entities.removeMocks();
    });
}());
