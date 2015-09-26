$oop.postpone($i18n, 'LocaleEnvironment', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend()
            .addTrait($event.Evented);

    /**
     * Creates or retrieves a LocaleEnvironment instance.
     * @name $i18n.LocaleEnvironment.create
     * @function
     * @returns {$i18n.LocaleEnvironment}
     */

    /**
     * Manages current locale settings.
     * @class
     * @extends $oop.Base
     * @extends $event.Evented
     */
    $i18n.LocaleEnvironment = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .setEventSpace($event.eventSpace)
        .addMethods(/** @lends $i18n.LocaleEnvironment# */{
            /** @ignore */
            init: function () {
                /**
                 * Document key identifying environment.
                 * Permanently set to 'localeEnvironment/'.
                 * @type {$entity.DocumentKey}
                 */
                this.entityKey = 'localeEnvironment/'.toDocumentKey();

                this.setEventPath('locale'.toPath());
            },

            /**
             * Fetches current locale as a Locale instance.
             * @returns {$i18n.Locale}
             */
            getCurrentLocale: function () {
                var localeKey = this.entityKey.toDocument().getCurrentLocaleKey();
                return localeKey && localeKey.toLocale();
            },

            /**
             * Sets current locale.
             * There is a shorthand for this on the Locale class.
             * @example
             * $i18n.LocaleEnvironment.create().setCurrentLocale('pt-br'.toLocale())
             * @param {$i18n.Locale} locale
             * @returns {$i18n.LocaleEnvironment}
             * @see $i18n.Locale#setAsCurrentLocale
             */
            setCurrentLocale: function (locale) {
                $assertion.isLocale(locale, "Invalid locale");
                this.entityKey.toDocument()
                    .setCurrentLocaleKey(locale.entityKey);
                return this;
            },

            /**
             * Marks specified locale as ready for use.
             * @param {$i18n.Locale} locale
             * @returns {$i18n.LocaleEnvironment}
             */
            markLocaleAsReady: function (locale) {
                $assertion.isLocale(locale, "Invalid locale");
                this.entityKey.toDocument()
                    .addReadyLocale(locale.entityKey);
                return this;
            },

            /**
             * Tests whether the specified locale is marked as ready.
             * @param {$i18n.Locale} locale
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
             * @param {$entity.EntityChangeEvent} event
             * @ignore
             */
            onCurrentLocaleChange: function (event) {
                var localeRefBefore = event.beforeNode,
                    localeRefAfter = event.afterNode;

                this.spawnEvent($i18n.EVENT_LOCALE_CHANGE)
                    .setLocaleBefore(localeRefBefore && localeRefBefore.toDocumentKey().toLocale())
                    .setLocaleAfter(localeRefAfter && localeRefAfter.toDocumentKey().toLocale())
                    .triggerSync();
            },

            /**
             * @param {$event.Event} event
             * @ignore
             */
            onLocaleReady: function (event) {
                var locale = event.sender,
                    currentLocaleKey = this.entityKey.toDocument().getCurrentLocaleKey();

                if (locale.entityKey.equals(currentLocaleKey)) {
                    // locale is teh current locale
                    // signaling that current locale is ready for use
                    this.triggerSync($i18n.EVENT_CURRENT_LOCALE_READY);
                }
            },

            /**
             * @param {$i18n.LocaleChangeEvent} event
             * @ignore
             */
            onLocaleChange: function (event) {
                var locale = event.localeAfter;

                if (locale.isMarkedAsReady()) {
                    // locale is marked ready for use
                    // signaling that current locale is ready for use
                    this.triggerSync($i18n.EVENT_CURRENT_LOCALE_READY);
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

    $oop.addGlobalConstants.call($i18n, /** @lends $i18n */{
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

$oop.amendPostponed($entity, 'FieldKey', function () {
    "use strict";

    'localeEnvironment//currentLocale'.toFieldKey()
        .subscribeTo($entity.EVENT_ENTITY_CHANGE, function (event) {
            $i18n.LocaleEnvironment.create()
                .onCurrentLocaleChange(event);
        });
});

$oop.amendPostponed($i18n, 'LocaleEnvironment', function () {
    "use strict";

    $i18n.LocaleEnvironment.create()
        .subscribeTo($i18n.EVENT_LOCALE_READY, function (event) {
            $i18n.LocaleEnvironment.create()
                .onLocaleReady(event);
        })
        .subscribeTo($i18n.EVENT_LOCALE_CHANGE, function (event) {
            $i18n.LocaleEnvironment.create()
                .onLocaleChange(event);
        });
});
