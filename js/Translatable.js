/*global dessert, troop, sntls, rubberband, v18n */
troop.postpone(v18n, 'Translatable', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name v18n.Translatable.create
     * @function
     * @param {string|rubberband.Stringifiable} originalString
     * @returns {v18n.Translatable}
     */

    /**
     * Represents a string, that might manifest in different languages depending on the current locale.
     * @class
     * @extends troop.Base
     * @extends rubberband.Stringifiable
     */
    v18n.Translatable = self
        .addMethods(/** @lends v18n.Translatable# */{
            /**
             * @param {string|rubberband.Stringifiable} originalString
             * @ignore
             */
            init: function (originalString) {
                /**
                 * Original string associated with the translatable.
                 * This will be used as the key when looking up translations.
                 * @type {string|rubberband.Stringifiable}
                 */
                this.originalString = originalString;

                /**
                 * Indicates the current multiplicity of the translatable.
                 * This value will be used in determining the plural form of the string.
                 * @type {number}
                 */
                this.multiplicity = 1;
            },

            /**
             * Sets multiplicity of translatable.
             * @param {number} multiplicity
             * @returns {v18n.Translatable}
             */
            setMultiplicity: function (multiplicity) {
                this.multiplicity = multiplicity;
                return this;
            },

            /**
             * Converts Translatable to a string, according to the current locale.
             * @returns {string}
             */
            toString: function () {
                var originalString = rubberband.Stringifier.stringify(this.originalString),
                    currentLocaleKey = v18n.Locale.currentLocaleKey,
                    locale = v18n.Locale.create(currentLocaleKey);

                return locale.getTranslation(originalString, this.multiplicity);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to a translatable.
             * @returns {v18n.Translatable}
             */
            toTranslatable: function () {
                return v18n.Translatable.create(this.valueOf());
            }
        },
        false, false, false);
}());
