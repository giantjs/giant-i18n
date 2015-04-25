/*global dessert, troop, sntls, v18n */
troop.postpone(v18n, 'LocaleEnvironment', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name v18n.LocaleEnvironment.create
     * @function
     * @returns {v18n.LocaleEnvironment}
     */

    /**
     * @class
     * @extends troop.Base
     */
    v18n.LocaleEnvironment = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addMethods(/** @lends v18n.LocaleEnvironment# */{
            /** @ignore */
            init: function () {
                /**
                 * Document key identifying locale.
                 * @type {bookworm.DocumentKey}
                 */
                this.entityKey = 'localeEnvironment/default'.toDocumentKey();
            },

            /**
             * @returns {v18n.Locale}
             */
            getCurrentLocale: function () {
                var localeKey = this.entityKey.toDocument().getCurrentLocaleKey();
                return localeKey && localeKey.toLocale();
            },

            /**
             * @param {v18n.Locale} locale
             * @returns {v18n.LocaleEnvironment}
             */
            setCurrentLocale: function (locale) {
                dessert.isLocale(locale, "Invalid locale");
                this.entityKey.toDocument()
                    .setCurrentLocaleKey(locale.entityKey);
                return this;
            },

            /**
             * @param {v18n.Locale} locale
             * @returns {v18n.LocaleEnvironment}
             */
            registerLocale: function (locale) {
                dessert.isLocale(locale, "Invalid locale");
                this.entityKey.toDocument()
                    .addLocale(locale.entityKey);
                return this;
            }
        });
});
