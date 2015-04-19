/*global dessert, troop, sntls, bookworm, v18n */
troop.postpone(v18n, 'LocaleDocument', function () {
    "use strict";

    var base = bookworm.Document,
        self = base.extend();

    /**
     * @name v18n.LocaleDocument.create
     * @function
     * @param {bookworm.DocumentKey} localeKey
     * @returns {v18n.LocaleDocument}
     */

    /**
     * @class
     * @extends bookworm.Document
     */
    v18n.LocaleDocument = self
        .addMethods(/** @lends v18n.LocaleDocument# */{
            /**
             * Fetches country code, eg. "us" or "uk"
             * @returns {string}
             */
            getCountryCode: function () {
                return this.getField('countryCode').getValue();
            },

            /**
             * Sets country code, eg. "us" or "uk"
             * @param {string} countryCode
             * @returns {v18n.LocaleDocument}
             */
            setCountryCode: function (countryCode) {
                this.getField('countryCode').setValue(countryCode);
                return this;
            },

            /**
             * Fetches language code, eg. "en" or "pt"
             * @returns {*}
             */
            getLanguageCode: function () {
                return this.getField('languageCode').getValue();
            },

            /**
             * Sets language code, eg. "en" or "pt"
             * @param {string} languageCode
             * @returns {v18n.LocaleDocument}
             */
            setLanguageCode: function (languageCode) {
                this.getField('languageCode').setValue(languageCode);
                return this;
            },

            /**
             * Fetches locale string based on language and country.
             * @example
             * 'en-us', 'de-at', or 'pt-br'
             * @returns {string}
             */
            getLocaleString: function () {
                return this.getLanguageCode() + '-' + this.getCountryCode();
            },

            /**
             * Fetches the locale's name. Subject to translation.
             * @returns {string}
             */
            getName: function () {
                return this.getField('name').getValue();
            },

            /**
             * Sets the locale's name.
             * @param {string} name
             * @returns {v18n.LocaleDocument}
             */
            setName: function (name) {
                this.getField('name').setValue(name);
                return this;
            },

            /**
             * Fetches plural formula stored as string.
             * @returns {string}
             */
            getPluralFormula: function () {
                return this.getField('pluralFormula').getValue();
            },

            /**
             * Sets plural formula.
             * TODO: Add assertion w/ format tester.
             * @param {string} pluralFormula
             * @returns {v18n.LocaleDocument}
             */
            setPluralFormula: function (pluralFormula) {
                this.getField('pluralFormula').setValue(pluralFormula);
                return this;
            },

            /**
             * Retrieves a translation for the specified string according to this locale.
             * @param {string} originalString
             * @param {number} pluralIndex
             * @returns {string}
             */
            getTranslation: function (originalString, pluralIndex) {
                var translations = this.getField('translations').getItem(originalString).getValue();
                return translations && translations[pluralIndex || 0];
            }
        });
});

troop.amendPostponed(bookworm, 'Document', function () {
    "use strict";

    bookworm.Document
        .addSurrogate(v18n, 'LocaleDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'locale';
        });
});
