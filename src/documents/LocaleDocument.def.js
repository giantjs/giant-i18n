/*global giant */
giant.postpone(giant, 'LocaleDocument', function () {
    "use strict";

    var base = giant.Document,
        self = base.extend();

    /**
     * @name giant.LocaleDocument.create
     * @function
     * @param {giant.DocumentKey} localeKey
     * @returns {giant.LocaleDocument}
     */

    /**
     * @class
     * @extends giant.Document
     */
    giant.LocaleDocument = self
        .addConstants(/** @lends giant.LocaleDocument */{
            /**
             * @type {RegExp}
             * @constant
             * @link http://localization-guide.readthedocs.org/en/latest/l10n/pluralforms.html
             */
            RE_PLURAL_FORMULA_VALIDATOR: /^\s*nplurals\s*=\s*\d+;\s*plural\s*=\s*[()n\s\d!><=?:&|%]+\s*;\s*$/
        })
        .addMethods(/** @lends giant.LocaleDocument# */{
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
             * @returns {giant.LocaleDocument}
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
             * @returns {giant.LocaleDocument}
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
             * @returns {giant.LocaleDocument}
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
             * @param {string} pluralFormula
             * @returns {giant.LocaleDocument}
             */
            setPluralFormula: function (pluralFormula) {
                $assertion.isPluralFormula(pluralFormula, "Invalid plural formula");
                this.getField('pluralFormula').setValue(pluralFormula);
                return this;
            },

            /**
             * Retrieves a translation for the specified string according to this locale.
             * @param {string} originalString
             * @param {number} [pluralIndex]
             * @returns {string}
             */
            getTranslation: function (originalString, pluralIndex) {
                var translations = this.getField('translations').getItem(originalString).getValue();
                return translations &&
                       (translations instanceof Array ?
                           translations[pluralIndex || 0] :
                           translations);
            },

            /**
             * Sets single translation.
             * @param {string} originalString
             * @param {string[]} pluralForms
             * @returns {giant.LocaleDocument}
             */
            setTranslation: function (originalString, pluralForms) {
                this.getField('translations').getItem(originalString).setValue(pluralForms);
                return this;
            },

            /**
             * Sets all translations for a locale in one go.
             * @param {object} translationsNode Translations indexed by original string.
             * @returns {giant.LocaleDocument}
             */
            setTranslations: function (translationsNode) {
                this.getField('translations').setValue(translationsNode);
                return this;
            }
        });
});

giant.amendPostponed(giant, 'Document', function () {
    "use strict";

    giant.Document
        .addSurrogate(giant, 'LocaleDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'locale';
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends giant */{
        /** @param {string} expr */
        isPluralFormula: function (expr) {
            return giant.LocaleDocument.RE_PLURAL_FORMULA_VALIDATOR.test(expr);
        },

        /** @param {string} expr */
        isPluralFormulaOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   giant.LocaleDocument.RE_PLURAL_FORMULA_VALIDATOR.test(expr);
        }
    });
}());
