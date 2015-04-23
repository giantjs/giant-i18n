/*global dessert, troop, sntls, v18n */
troop.postpone(v18n, 'Locale', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name v18n.Locale.create
     * @function
     * @param {bookworm.DocumentKey} localeKey
     * @returns {v18n.Locale}
     */

    /**
     * @class
     * @extends troop.Base
     */
    v18n.Locale = self
        .setInstanceMapper(function (localeKey) {
            return String(localeKey);
        })
        .addConstants(/** @lends v18n.Locale */{
            /**
             * @type {RegExp}
             * @constant
             */
            RE_PLURAL_FORMULA_VALIDATOR: /^\s*nplurals\s*=\s*\d+;\s*plural\s*=\s*[()n\s\d!><=?:&|%]+\s*;\s*$/,

            /**
             * @type {bookworm.DocumentKey}
             * @constant
             */
            currentLocaleKey: 'locale/current'.toDocumentKey()
        })
        .addMethods(/** @lends v18n.Locale# */{
            /**
             * @param {bookworm.DocumentKey} localeKey
             * @ignore
             */
            init: function (localeKey) {
                dessert.isDocumentKey(localeKey, "Invalid locale key");

                /**
                 * Document key identifying locale.
                 * @type {bookworm.DocumentKey}
                 */
                this.entityKey = localeKey;

                /**
                 * Function for determining plural form of a string.
                 * @type {function}
                 */
                this.getPlural = undefined;
            },

            /**
             * Sets this locale as current.
             * @returns {v18n.Locale}
             */
            setAsCurrentLocale: function () {
                this.currentLocaleKey.toDocument()
                    .setNode(this.entityKey.toDocument().getNode());
                return this;
            },

            /**
             * TODO: Replace eval with parsing. (long term)
             * TODO: Add tests.
             * @param {string} originalString
             * @param {number} [count]
             * @returns {string}
             */
            getTranslation: function (originalString, count) {
                var pluralFormula = this.entityKey.toDocument().getPluralFormula(),
                // variables used in the formula
                    n = count,
                    nplurals, plural = 0;

                dessert.isPluralFormulaOptional(pluralFormula, "Invalid plural formula");

                if (pluralFormula) {
                    /*jshint evil:true*/
                    eval(pluralFormula);
                }

                return this.entityKey.toDocument().getTranslation(originalString, plural);
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {string} expr */
        isPluralFormula: function (expr) {
            return v18n.Locale.RE_PLURAL_FORMULA_VALIDATOR.test(expr);
        },

        /** @param {string} expr */
        isPluralFormulaOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   v18n.Locale.RE_PLURAL_FORMULA_VALIDATOR.test(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @returns {v18n.Locale}
             */
            toLocale: function () {
                var localeKey = ['locale', this.valueOf()].toDocumentKey();
                return v18n.Locale.create(localeKey);
            }
        },
        false, false, false);
}());
