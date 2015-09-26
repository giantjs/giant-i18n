(function () {
    "use strict";

    module("Translatable");

    test("Instantiation", function () {
        var translatable = $i18n.Translatable.create('foo');
        equal(translatable.originalString, 'foo', "should set originalSting property");
        equal(translatable.multiplicity, 1, "should set multiplicity property");
    });

    test("Conversion from string", function () {
        var translatable = 'foo'.toTranslatable();
        ok(translatable.isA($i18n.Translatable), "should return Translatable instance");
        equal(translatable.originalString, 'foo', "should set originalSting property");
    });

    test("Multiplicity setter", function () {
        var translatable = 'foo'.toTranslatable();
        strictEqual(translatable.setMultiplicity(5), translatable, "should be chainable");
        equal(translatable.multiplicity, 5, "should set multiplicity property");
    });

    test("Serializing literal-based translatable", function () {
        var translatable = 'foo'.toTranslatable();

        'locale/pt-br'.toDocument()
            .setTranslations({
                foo: ['bar']
            });

        $i18n.LocaleEnvironment.addMocks({
            getCurrentLocale: function () {
                return undefined;
            }
        });

        equal(translatable.toString(), 'foo',
            "should return original string when no current locale is not set");

        $i18n.LocaleEnvironment
            .removeMocks()
            .addMocks({
                getCurrentLocale: function () {
                    return 'pt-br'.toLocale();
                }
            });

        equal(translatable.toString(), 'bar',
            "should return translated string when current locale is set");

        $i18n.LocaleEnvironment.removeMocks();
    });

    test("Wrapping translatable in LiveTemplate", function () {
            var translatable = 'hello {{foo}} world'.toTranslatable(),
                template;

        template = translatable.toLiveTemplate();

        'locale/foo'.toDocument().setTranslations({
            'hello {{foo}} world': "HELLO {{foo}} WORLD",
            'all the': "ALL THE"
        });

        ok(template.isA($templating.LiveTemplate), "should return LiveTemplate instance");

        template
            .setParameterValues({
                '{{foo}}': "all the".toTranslatable()
            });

        $i18n.LocaleEnvironment.addMocks({
            getCurrentLocale: function () {
                return 'foo'.toLocale();
            }
        });

        equal(template.toString(), "HELLO ALL THE WORLD",
            "should return resolved template with resolved translatables when serialized");

        $i18n.LocaleEnvironment.removeMocks();
    });

    test("Serializing stringifiable-based translatable", function () {
        var template = 'hello {{foo}} world'.toLiveTemplate()
                .setParameterValues({
                    '{{foo}}': "all the"
                }),
            translatable = $i18n.Translatable.create(template);

        'locale/foo'.toDocument().setTranslations({
            'hello all the world': ["HELLO ALL THE WORLD"]
        });

        $i18n.LocaleEnvironment.addMocks({
            getCurrentLocale: function () {
                return 'foo'.toLocale();
            }
        });

        equal(translatable.toString(), "HELLO ALL THE WORLD",
            "should return translated string according to resolved stringifiable");

        $i18n.LocaleEnvironment.removeMocks();
    });
}());
