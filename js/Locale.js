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
     * Represents a locale, such as 'en-us', or 'de-de'. Provides an API for setting a locale
     * as current locale, as well as translating strings.
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
        .addPrivateMethods(/** @lends v18n.Locale# */{
            /**
             * TODO: Replace eval with parsing. (long term)
             * @param multiplicity
             * @returns {number}
             * @private
             */
            _getPluralIndex: function (multiplicity) {
                /*jshint evil:true*/
                var pluralFormula;

                if (!this.getPluralIndex) {
                    pluralFormula = this.entityKey.toDocument().getPluralFormula();
                    if (pluralFormula) {
                        // plural formula is present in the cache
                        // constructing function
                        eval([
                            //@formatter:off
                            'this.getPluralIndex = function (n) {',
                                'var nplurals, plural;',
                                pluralFormula,
                                'return Number(plural);',
                            '}'
                            //@formatter:on
                        ].join('\n'));
                    }
                }

                return this.getPluralIndex && this.getPluralIndex(multiplicity);
            }
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
                 * Internal lookup function between multiplicity and plural index.
                 * The plural index pin-points the translated string in the translation array.
                 * @param {number} count
                 * @type {function}
                 */
                this.getPluralIndex = undefined;
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
             * Retrieves the translation for the specified string, according to the current locale.
             * @param {string} originalString String to be translated.
             * @param {number} [multiplicity=1] Multiplicity of the thing identified by originalString.
             * @returns {string}
             */
            getTranslation: function (originalString, multiplicity) {
                multiplicity = multiplicity || 1;

                var pluralIndex = this._getPluralIndex(multiplicity) || 0,
                    translation = this.entityKey.toDocument()
                        .getTranslation(originalString, pluralIndex);

                return typeof translation === 'string' ?
                    translation :
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
