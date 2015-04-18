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
             * Fetches language code, eg. "en" or "pt"
             * @returns {*}
             */
            getLanguageCode: function () {
                return this.getField('languageCode').getValue();
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
             * @returns {*}
             */
            getName: function () {
                return this.getField('name').getValue();
            },

            /**
             * Retrieves a translation for the specified string according to this locale.
             * @param {string} originalString
             * @returns {string}
             */
            getTranslation: function (originalString) {
                return this.getField('translations').getItem(originalString).getValue();
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
