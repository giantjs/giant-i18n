/*global dessert, troop, sntls, evan, flock, bookworm, v18n */
troop.postpone(v18n, 'Locale', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTrait(evan.Evented);

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
     * @extends evan.Evented
     * @extends rubberband.Stringifiable
     */
    v18n.Locale = self
        .setInstanceMapper(function (localeKey) {
            return String(localeKey);
        })
        .setEventSpace(v18n.localeEventSpace)
        .addConstants(/** @lends v18n.Locale */{
            /** @constant */
            EVENT_LOCALE_READY: 'locale.ready'
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

                this.setEventPath(['locale', localeKey.documentId].toPath());
            },

            /**
             * Sets this locale as current.
             * @returns {v18n.Locale}
             */
            setAsCurrentLocale: function () {
                v18n.LocaleEnvironment.create().setCurrentLocale(this);
                return this;
            },

            /**
             * Marks locale as ready for use.
             * This is how the application signals to v18n that loading and merging the locale
             * has finished. V18n is agnostic about the process by which locales are loaded,
             * so the application needs to tell v18n explicitly that it has.
             * @returns {v18n.Locale}
             */
            markAsReady: function () {
                v18n.LocaleEnvironment.create().markLocaleAsReady(this);
                return this;
            },

            /**
             * Tests whether locale is marked as ready.
             * @returns {boolean}
             */
            isMarkedAsReady: function () {
                return v18n.LocaleEnvironment.create().isLocaleMarkedAsReady(this);
            },

            /**
             * Retrieves the translation for the specified string, according to the current locale.
             * @param {string} originalString String to be translated.
             * @param {number} [multiplicity=1] Multiplicity of the thing identified by originalString.
             * @returns {string}
             */
            getTranslation: function (originalString, multiplicity) {
                if (typeof multiplicity === 'undefined') {
                    multiplicity = 1;
                }

                var pluralIndex = this._getPluralIndex(multiplicity) || 0,
                    translation = this.entityKey.toDocument()
                        .getTranslation(originalString, pluralIndex);

                return typeof translation === 'string' ?
                    translation :
                    originalString;
            },

            /** @returns {string} */
            toString: function () {
                return this.entityKey.documentId;
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onLocaleMarkedAsReady: function (event) {
                var link = evan.pushOriginalEvent(event);
                this.triggerSync(this.EVENT_LOCALE_READY);
                link.unLink();
            }
        });
});

troop.amendPostponed(bookworm, 'entities', function () {
    "use strict";

    bookworm.entities.eventSpace
        .delegateSubscriptionTo(
            flock.ChangeEvent.EVENT_CACHE_CHANGE,
            'document>localeEnvironment>>readyLocales'.toPath(),
            'document>localeEnvironment>>readyLocales>|'.toQuery(),
            (function (event) {
                var localeRef = event.originalPath.getLastKey();
                v18n.Locale.create(localeRef.toDocumentKey())
                    .onLocaleMarkedAsReady(event);
            }));
});

troop.amendPostponed(bookworm, 'DocumentKey', function () {
    "use strict";

    bookworm.DocumentKey
        .addMethods(/** @lends bookworm.DocumentKey */{
            /** @returns {v18n.Locale} */
            toLocale: function () {
                return v18n.Locale.create(this);
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {v18n.Locale} expr */
        isLocale: function (expr) {
            return v18n.Locale.isBaseOf(expr);
        },

        /** @param {v18n.Locale} [expr] */
        isLocaleOptional: function (expr) {
            return typeof expr === 'undefined' ||
                v18n.Locale.isBaseOf(expr);
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
