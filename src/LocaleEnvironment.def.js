/*global giant */
giant.postpone(giant, 'LocaleEnvironment', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend()
            .addTrait(giant.Evented);

    /**
     * Creates or retrieves a LocaleEnvironment instance.
     * @name giant.LocaleEnvironment.create
     * @function
     * @returns {giant.LocaleEnvironment}
     */

    /**
     * Manages current locale settings.
     * @class
     * @extends giant.Base
     * @extends giant.Evented
     */
    giant.LocaleEnvironment = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .setEventSpace(giant.eventSpace)
        .addMethods(/** @lends giant.LocaleEnvironment# */{
            /** @ignore */
            init: function () {
                /**
                 * Document key identifying environment.
                 * Permanently set to 'localeEnvironment/'.
                 * @type {giant.DocumentKey}
                 */
                this.entityKey = 'localeEnvironment/'.toDocumentKey();

                this.setEventPath('locale'.toPath());
            },

            /**
             * Fetches current locale as a Locale instance.
             * @returns {giant.Locale}
             */
            getCurrentLocale: function () {
                var localeKey = this.entityKey.toDocument().getCurrentLocaleKey();
                return localeKey && localeKey.toLocale();
            },

            /**
             * Sets current locale.
             * There is a shorthand for this on the Locale class.
             * @example
             * giant.LocaleEnvironment.create().setCurrentLocale('pt-br'.toLocale())
             * @param {giant.Locale} locale
             * @returns {giant.LocaleEnvironment}
             * @see giant.Locale#setAsCurrentLocale
             */
            setCurrentLocale: function (locale) {
                $assertion.isLocale(locale, "Invalid locale");
                this.entityKey.toDocument()
                    .setCurrentLocaleKey(locale.entityKey);
                return this;
            },

            /**
             * Marks specified locale as ready for use.
             * @param {giant.Locale} locale
             * @returns {giant.LocaleEnvironment}
             */
            markLocaleAsReady: function (locale) {
                $assertion.isLocale(locale, "Invalid locale");
                this.entityKey.toDocument()
                    .addReadyLocale(locale.entityKey);
                return this;
            },

            /**
             * Tests whether the specified locale is marked as ready.
             * @param {giant.Locale} locale
             * @returns {boolean}
             */
            isLocaleMarkedAsReady: function (locale) {
                $assertion.isLocale(locale, "Invalid locale");
                return !!this.entityKey.toDocument()
                    .getReadyLocale(locale.entityKey);
            },

            /**
             * Triggered when the 'currentLocale' field changes on the localeEnvironment document.
             * TODO: Add handler for when the entire localeEnvironment document changes.
             * @param {giant.EntityChangeEvent} event
             * @ignore
             */
            onCurrentLocaleChange: function (event) {
                var localeRefBefore = event.beforeNode,
                    localeRefAfter = event.afterNode;

                this.spawnEvent(giant.EVENT_LOCALE_CHANGE)
                    .setLocaleBefore(localeRefBefore && localeRefBefore.toDocumentKey().toLocale())
                    .setLocaleAfter(localeRefAfter && localeRefAfter.toDocumentKey().toLocale())
                    .triggerSync();
            },

            /**
             * @param {giant.Event} event
             * @ignore
             */
            onLocaleReady: function (event) {
                var locale = event.sender,
                    currentLocaleKey = this.entityKey.toDocument().getCurrentLocaleKey();

                if (locale.entityKey.equals(currentLocaleKey)) {
                    // locale is teh current locale
                    // signaling that current locale is ready for use
                    this.triggerSync(giant.EVENT_CURRENT_LOCALE_READY);
                }
            },

            /**
             * @param {giant.LocaleChangeEvent} event
             * @ignore
             */
            onLocaleChange: function (event) {
                var locale = event.localeAfter;

                if (locale.isMarkedAsReady()) {
                    // locale is marked ready for use
                    // signaling that current locale is ready for use
                    this.triggerSync(giant.EVENT_CURRENT_LOCALE_READY);
                } else {
                    // locale is not marked as ready
                    // touching node to potentially signal that translations are not loaded yet
                    locale.entityKey.toDocument().getField('translations').touchNode();
                }
            }
        });
});

(function () {
    "use strict";

    giant.addGlobalConstants(/** @lends giant */{
        /**
         * Signals that the current locale has changed.
         * Does not mean though that the new locale is loaded and is ready for use.
         * @constant
         */
        EVENT_LOCALE_CHANGE: 'locale.change',

        /**
         * Signals that the current locale is ready for use.
         * Triggered either when a) locales are loaded and current locale changes, or
         * b) current locale is set which is then successfully loaded.
         * @constant
         */
        EVENT_CURRENT_LOCALE_READY: 'locale.ready.current'
    });
}());

giant.amendPostponed(giant, 'FieldKey', function () {
    "use strict";

    'localeEnvironment//currentLocale'.toFieldKey()
        .subscribeTo(giant.EVENT_ENTITY_CHANGE, function (event) {
            giant.LocaleEnvironment.create()
                .onCurrentLocaleChange(event);
        });
});

giant.amendPostponed(giant, 'LocaleEnvironment', function () {
    "use strict";

    giant.LocaleEnvironment.create()
        .subscribeTo(giant.EVENT_LOCALE_READY, function (event) {
            giant.LocaleEnvironment.create()
                .onLocaleReady(event);
        })
        .subscribeTo(giant.EVENT_LOCALE_CHANGE, function (event) {
            giant.LocaleEnvironment.create()
                .onLocaleChange(event);
        });
});
