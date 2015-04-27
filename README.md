V18n
====

"Verkerhrsverbindungen"

*Internationalization framework*

The goal of v18n is to provide a simple API for localization based on and in line with the design principles of [troop](https://github.com/danstocker/troop), [sntls](https://github.com/danstocker/sntls), and [rubberband](https://github.com/danstocker/rubberband). V18n's central class is the `Translatable`, that resolves to a translation depending on the current locale settings when serialized.

Examples
--------

JsFiddle: [http://jsfiddle.net/danstocker/zwsutcL5/](http://jsfiddle.net/danstocker/zwsutcL5/)

For the examples below, we assume that the locale documents are properly initialized.

    'locale/en-uk'.toDocument()
        .setTranslations({
            "You have {{appleCount}} {{appleForm}}.": "You have {{appleCount}} {{appleForm}}.",
            "apple": ["apple", "apples"]
        })
        .setPluralFormula("nplurals=2; plural=(n != 1);");

    'locale/de-de'.toDocument()
        .setTranslations({
            "You have {{appleCount}} {{appleForm}}.": "Sie haben {{appleCount}} {{appleForm}}.",
            "apple": ["Apfel", "Äpfel"]
        })
        .setPluralFormula("nplurals=2; plural=(n != 1);");

In case we're loading these translations asynchronously, we might want to signal to the application that the locales are ready for use.

    'en-uk'.toLocale().markAsReady();
    'de-de'.toLocale().markAsReady();

### Using `Translatable`

In order to tell v18n to translate a term, it has to be converted to a `Translatable`. A `Translatable`, when serialized by calling `.toString()` on it, resolves to the specified term in the current language, provided that a match is found.

    var apple = 'apple'.toTranslatable();

    'en-uk'.toLocale().setAsCurrentLocale();

    apple.toString() // 'apple'

    'de-de'.toLocale().setAsCurrentLocale();

    apple.toString() // 'Apfel'

### Pluralization

`Translatable` instances carry a multiplicity property, which they use in determining the correct plural form of the term.

    var apple = 'apple'.toTranslatable()
        .setMultiplicity(6);

    'en-uk'.toLocale().setAsCurrentLocale();

    apple.toString() // 'apples'

    'de-de'.toLocale().setAsCurrentLocale();

    apple.toString() // 'Äpfel'

### Formatting

V18n uses the templating engine of rubberband, and thus allows expressions like the following.

    var sentence = rubberband.LiveTemplate.create("You have {{appleCount}} {{appleForm}}.".toTranslatable())
        .addReplacements({
            '{{appleCount}}': 6,
            '{{appleForm}}': "apple".toTranslatable()
                .setMultiplicity(6)
        });

    'en-uk'.toLocale().setAsCurrentLocale();
    sentence.toString() // "You have 6 apples."

    'de-de'.toLocale().setAsCurrentLocale();
    sentence.toString() // "Sie haben 6 Äpfel."

### Listening to locale changes

Components of the application might need to listen to locale changes. The event 'locale.ready.current' or `v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY` signals that the current locale, already loaded and just changed, or previously set and just loaded, is ready for use.

    v18n.LocaleEnvironment.create()
        .subscribeTo(v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY, function () {
            console.log("current locale is ready for use");
            // updating widgets, etc.
        });

### Getting the current locale

The class `LocaleEnvironment` manages the current localization state.

    'de-de'.toLocale().setAsCurrentLocale();

    v18n.LocaleEnvironment.create().getCurrentLocale().toString() // 'de-de'
