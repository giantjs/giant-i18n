V18n
====

"Verkerhrsverbindungen"

*Internationalization framework*

The goal of v18n is to provide a simple API for localization based on and in line with he design principles of [troop](https://github.com/danstocker/troop), [sntls](https://github.com/danstocker/sntls), and [rubberband](https://github.com/danstocker/rubberband). V18n's central class is the `Translatable`, that resolves to a translation depending on the current locale settings when serialized.

Examples
--------

For the examples below, we assume that the locale documents are properly initialized.

    'locale/en-uk'.toLocaleDocument()
        .setTranslations({
            apple: ["apple", "apples"],
        });

    'locale/de-de'.toLocaleDocument()
        .setTranslations({
            apple: ["Apfel", "Äpfel"],
        });

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

### Multi-term translation with formatting

    // ...
