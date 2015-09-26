(function () {
    "use strict";

    module("LocaleDocument");

    test("Document surrogate", function () {
        var document = 'locale/foo'.toDocument();
        ok(document.isA($i18n.LocaleDocument), "should return LocaleDocument instance");
    });

    test("Plural formula setter", function () {
        expect(5);

        var localeDocument = 'locale/foo'.toDocument();

        throws(function () {
            localeDocument.setPluralFormula();
        }, "should raise exception on missing arguments");

        throws(function () {
            localeDocument.setPluralFormula("foo bar baz");
        }, "should raise exception on invalid arguments");

        $entity.Field.addMocks({
            setValue: function (value) {
                ok(this.entityKey.equals('locale/foo/pluralFormula'.toFieldKey()),
                    "should set the correct field");
                equal(value, 'nplurals=2; plural=(n != 1);',
                    "should pass formula to field value setter");
            }
        });

        strictEqual(localeDocument.setPluralFormula('nplurals=2; plural=(n != 1);'), localeDocument,
            "should be chainable");

        $entity.Field.removeMocks();
    });

    test("Translation getter", function () {
        var localeDocument = 'locale/foo'.toDocument();

        localeDocument.setNode({
            translations: {
                cat : ['cat', 'cats'],
                meow: 'meow'
            }
        });

        equal(typeof localeDocument.getTranslation('dog'), 'undefined',
            "should return undefined for missing translation");
        equal(localeDocument.getTranslation('meow'), 'meow',
            "should return string literal for no plural(s)");
        equal(localeDocument.getTranslation('cat'), 'cat',
            "should return zero plural-index translation when none is specified");
        equal(localeDocument.getTranslation('cat', 1), 'cats',
            "should return specified plural-index translation");
    });

    test("Translation setter", function () {
        expect(3);

        var localeDocument = 'locale/foo'.toDocument();

        $entity.Item.addMocks({
            setValue: function (value) {
                ok(this.entityKey.equals('locale/foo/translations/hello'.toItemKey()),
                    "should set the correct item");
                deepEqual(value, ['world'], "should pass translation value to item value setter");
            }
        });

        strictEqual(localeDocument.setTranslation('hello', ['world']), localeDocument,
            "should be chainable");

        $entity.Item.removeMocks();
    });

    test("Translations setter", function () {
        expect(3);

        var localeDocument = 'locale/foo'.toDocument();

        $entity.Field.addMocks({
            setValue: function (value) {
                ok(this.entityKey.equals('locale/foo/translations'.toFieldKey()),
                    "should set the correct field");
                deepEqual(value, {
                    'hello': ['world'],
                    'apple': ['apple', 'apples']
                }, "should pass translations node to field value setter");
            }
        });

        strictEqual(localeDocument.setTranslations({
            'hello': ['world'],
            'apple': ['apple', 'apples']
        }), localeDocument, "should be chainable");

        $entity.Field.removeMocks();
    });
}());
