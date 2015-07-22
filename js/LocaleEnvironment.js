/*global dessert, troop, sntls, evan, bookworm, v18n */
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
        .setEventSpace(v18n.localeEventSpace)
        .addConstants(/** @lends v18n.LocaleEnvironment */{
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
        })
        .addMethods(/** @lends v18n.LocaleEnvironment# */{
            /** @ignore */
            init: function () {
                /**
                 * Document key identifying environment.
                 * Permanently set to 'localeEnvironment/'.
                 * @type {bookworm.DocumentKey}
                 */
                this.entityKey = 'localeEnvironment/'.toDocumentKey();

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
             * Marks specified locale as ready for use.
             * @param {v18n.Locale} locale
             * @returns {v18n.LocaleEnvironment}
             */
            markLocaleAsReady: function (locale) {
                dessert.isLocale(locale, "Invalid locale");
                this.entityKey.toDocument()
                    .addReadyLocale(locale.entityKey);
                return this;
            },

            /**
             * Tests whether the specified locale is marked as ready.
             * @param {v18n.Locale} locale
             * @returns {boolean}
             */
            isLocaleMarkedAsReady: function (locale) {
                dessert.isLocale(locale, "Invalid locale");
                return !!this.entityKey.toDocument()
                    .getReadyLocale(locale.entityKey);
            },

            /**
             * Triggered when the 'currentLocale' field changes on the localeEnvironment document.
             * TODO: Add handler for when the entire localeEnvironment document changes.
             * @param {bookworm.EntityChangeEvent} event
             * @ignore
             */
            onCurrentLocaleChange: function (event) {
                var link = evan.pushOriginalEvent(event),
                    localeRefBefore = event.beforeNode,
                    localeRefAfter = event.afterNode;

                this.spawnEvent(this.EVENT_LOCALE_CHANGE)
                    .setLocaleBefore(localeRefBefore && localeRefBefore.toDocumentKey().toLocale())
                    .setLocaleAfter(localeRefAfter && localeRefAfter.toDocumentKey().toLocale())
                    .triggerSync();

                link.unLink();
            },

            /**
             * @param {evan.Event} event
             * @ignore
             */
            onLocaleReady: function (event) {
                var link = evan.pushOriginalEvent(event),
                    locale = event.sender,
                    currentLocaleKey = this.entityKey.toDocument().getCurrentLocaleKey();

                if (locale.entityKey.equals(currentLocaleKey)) {
                    // locale is teh current locale
                    // signaling that current locale is ready for use
                    this.triggerSync(this.EVENT_CURRENT_LOCALE_READY);
                }

                link.unLink();
            },

            /**
             * @param {v18n.LocaleChangeEvent} event
             * @ignore
             */
            onLocaleChange: function (event) {
                var link = evan.pushOriginalEvent(event),
                    locale = event.localeAfter;

                if (locale.isMarkedAsReady()) {
                    // locale is marked ready for use
                    // signaling that current locale is ready for use
                    this.triggerSync(this.EVENT_CURRENT_LOCALE_READY);
                } else {
                    // locale is not marked as ready
                    // touching node to potentially signal that translations are not loaded yet
                    locale.entityKey.toDocument().getField('translations').touchNode();
                }

                link.unLink();
            }
        });
});

troop.amendPostponed(bookworm, 'FieldKey', function () {
    "use strict";

    'localeEnvironment//currentLocale'.toFieldKey()
        .subscribeTo(bookworm.Entity.EVENT_ENTITY_CHANGE, function (event) {
            v18n.LocaleEnvironment.create()
                .onCurrentLocaleChange(event);
        });
});

troop.amendPostponed(v18n, 'LocaleEnvironment', function () {
    "use strict";

    v18n.LocaleEnvironment.create()
        .subscribeTo(v18n.Locale.EVENT_LOCALE_READY, function (event) {
            v18n.LocaleEnvironment.create()
                .onLocaleReady(event);
        })
        .subscribeTo(v18n.LocaleEnvironment.EVENT_LOCALE_CHANGE, function (event) {
            v18n.LocaleEnvironment.create()
                .onLocaleChange(event);
        });
});
