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
             * @param {string} originalString
             * @param {number} [count=1]
             * @returns {string}
             */
            getTranslation: function (originalString, count) {
                count = count || 1;

                var pluralFormula = this.entityKey.toDocument().getPluralFormula(),
                // variables used in the formula
                    n = count,
                    nplurals, plural = 0;

                if (pluralFormula) {
                    /*jshint evil:true*/
                    eval(pluralFormula);
                }

                return this.entityKey.toDocument().getTranslation(originalString, Number(plural)) ||
                    originalString;
            }
        });
});

(function () {
    "use strict";

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
