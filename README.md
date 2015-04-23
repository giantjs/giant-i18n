V18n
====

"Verkerhrsverbindungen"

*Internationalization framework*

The goal of v18n is to provide a simple API for localization based on and in line with he design principles of [troop](), [sntls](), and [rubberband](). V18n's central class is the `Translatable`, that resolves to a translation depending on the current locale settings when serialized.

Examples
--------

For the examples below, we assume that the locale documents are properly initialized and a current locale is set to 'de-de'.

    // ...

### Simple translation

In order to tell v18n to translate a string, it has to be converted to a `Translatable`. A `Translatable`, when serialized by calling `.toString()` on it, resolves to the specified string in the current language, provided that a match is found.

    // ...

### Multi-string translation with formatting

    // ...
