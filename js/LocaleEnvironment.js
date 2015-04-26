/*global dessert, troop, sntls, evan, flock, bookworm, v18n */
troop.postpone(v18n, 'LocaleEnvironment', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTrait(evan.Evented);

    /**
     * Creates or retrieves a LocaleEnvironment instance.
     * @name v18n.LocaleEnvironment.create
     * @function
     * @returns {v18n.LocaleEnvironment}
     */

    /**
     * Manages current locale settings.
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    v18n.LocaleEnvironment = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .setEventSpace(evan.eventSpace)
        .addConstants(/** @lends v18n.LocaleEnvironment */{
            /** @constant */
            EVENT_LOCALE_CHANGE: 'locale.change'
        })
        .addMethods(/** @lends v18n.LocaleEnvironment# */{
            /** @ignore */
            init: function () {
                /**
                 * Document key identifying environment.
                 * Permanently set to 'localeEnvironment/default'.
                 * @type {bookworm.DocumentKey}
                 */
                this.entityKey = 'localeEnvironment/default'.toDocumentKey();

                this.setEventPath('locale'.toPath());
            },

            /**
             * Fetches current locale as a Locale instance.
             * @returns {v18n.Locale}
             */
            getCurrentLocale: function () {
                var localeKey = this.entityKey.toDocument().getCurrentLocaleKey();
                return localeKey && localeKey.toLocale();
            },

            /**
             * Sets current locale.
             * There is a shorthand for this on the Locale class.
             * @example
             * v18n.LocaleEnvironment.create().setCurrentLocale('pt-br'.toLocale())
             * @param {v18n.Locale} locale
             * @returns {v18n.LocaleEnvironment}
             * @see v18n.Locale#setAsCurrentLocale
             */
            setCurrentLocale: function (locale) {
                dessert.isLocale(locale, "Invalid locale");
                this.entityKey.toDocument()
                    .setCurrentLocaleKey(locale.entityKey);
                return this;
            },

            /**
             * Registers locale as one of the available locales.
             * @param {v18n.Locale} locale
             * @returns {v18n.LocaleEnvironment}
             */
            registerLocale: function (locale) {
                dessert.isLocale(locale, "Invalid locale");
                this.entityKey.toDocument()
                    .addLocale(locale.entityKey);
                return this;
            },

            /**
             * Triggered when the 'currentLocale' field changes on the localeEnvironment document.
             * TODO: Add handler for when the entire localeEnvironment document changes.
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onCurrentLocaleChange: function (event) {
                var link = evan.pushOriginalEvent(event),
                    localeRefBefore = event.beforeValue,
                    localeRefAfter = event.afterValue;

                this.spawnEvent(this.EVENT_LOCALE_CHANGE)
                    .setLocaleBefore(localeRefBefore && localeRefBefore.toDocumentKey().toLocale())
                    .setLocaleAfter(localeRefAfter && localeRefAfter.toDocumentKey().toLocale())
                    .triggerSync();

                link.unLink();
            }
        });
});

troop.amendPostponed(bookworm, 'entities', function () {
    "use strict";

    bookworm.entities.subscribeTo(
        flock.ChangeEvent.EVENT_CACHE_CHANGE,
        'document>localeEnvironment>default>currentLocale'.toPath(),
        function (event) {
            v18n.LocaleEnvironment.create().onCurrentLocaleChange(event);
        });
});
