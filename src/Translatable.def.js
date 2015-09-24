/*global giant */
$oop.postpone(giant, 'Translatable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name giant.Translatable.create
     * @function
     * @param {string|$utils.Stringifiable} originalString
     * @returns {giant.Translatable}
     */

    /**
     * Represents a string, that might manifest in different languages depending on the current locale.
     * @class
     * @extends $oop.Base
     * @extends $utils.Stringifiable
     */
    giant.Translatable = self
        .addMethods(/** @lends giant.Translatable# */{
            /**
             * @param {string|$utils.Stringifiable} originalString
             * @ignore
             */
            init: function (originalString) {
                /**
                 * Original string associated with the translatable.
                 * This will be used as the key when looking up translations.
                 * @type {string|$utils.Stringifiable}
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
             * @returns {giant.Translatable}
             */
            setMultiplicity: function (multiplicity) {
                this.multiplicity = multiplicity;
                return this;
            },

            /**
             * Wraps translatable into a LiveTemplate instance.
             * When the returned template is evaluated, so is the translatable.
             * @returns {$templating.LiveTemplate}
             */
            toLiveTemplate: function () {
                return $templating.LiveTemplate.create(this);
            },

            /**
             * Converts Translatable to a string, according to the current locale.
             * @returns {string}
             */
            toString: function () {
                var originalString = $utils.Stringifier.stringify(this.originalString),
                    currentLocale = giant.LocaleEnvironment.create().getCurrentLocale();

                return currentLocale ?
                    currentLocale.getTranslation(originalString, this.multiplicity) :
                    originalString;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to a translatable.
         * @returns {giant.Translatable}
         */
        toTranslatable: function () {
            return giant.Translatable.create(this.valueOf());
        }
    });
}());
