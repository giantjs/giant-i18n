/*global giant */
giant.postpone(giant, 'Locale', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend()
            .addTrait(giant.Evented);

    /**
     * @name giant.Locale.create
     * @function
     * @param {giant.DocumentKey} localeKey
     * @returns {giant.Locale}
     */

    /**
     * Represents a locale, such as 'en-us', or 'de-de'. Provides an API for setting a locale
     * as current locale, as well as translating strings.
     * @class
     * @extends giant.Base
     * @extends giant.Evented
     * @extends giant.Stringifiable
     */
    giant.Locale = self
        .setInstanceMapper(function (localeKey) {
            return String(localeKey);
        })
        .setEventSpace(giant.localeEventSpace)
        .addConstants(/** @lends giant.Locale */{
            /** @constant */
            EVENT_LOCALE_READY: 'locale.ready'
        })
        .addPrivateMethods(/** @lends giant.Locale# */{
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
        .addMethods(/** @lends giant.Locale# */{
            /**
             * @param {giant.DocumentKey} localeKey
             * @ignore
             */
            init: function (localeKey) {
                giant.isDocumentKey(localeKey, "Invalid locale key");

                /**
                 * Document key identifying locale.
                 * @type {giant.DocumentKey}
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
             * @returns {giant.Locale}
             */
            setAsCurrentLocale: function () {
                giant.LocaleEnvironment.create().setCurrentLocale(this);
                return this;
            },

            /**
             * Marks locale as ready for use.
             * This is how the application signals to giant that loading and merging the locale
             * has finished. V18n is agnostic about the process by which locales are loaded,
             * so the application needs to tell giant explicitly that it has.
             * @returns {giant.Locale}
             */
            markAsReady: function () {
                giant.LocaleEnvironment.create().markLocaleAsReady(this);
                return this;
            },

            /**
             * Tests whether locale is marked as ready.
             * @returns {boolean}
             */
            isMarkedAsReady: function () {
                return giant.LocaleEnvironment.create().isLocaleMarkedAsReady(this);
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
             * @param {giant.EntityChangeEvent} event
             * @ignore
             */
            onLocaleMarkedAsReady: function (event) {
                var link = giant.pushOriginalEvent(event);
                this.triggerSync(this.EVENT_LOCALE_READY);
                link.unlink();
            }
        });
});

giant.amendPostponed(giant, 'entityEventSpace', function () {
    "use strict";

    giant.entityEventSpace
        .delegateSubscriptionTo(
            giant.Entity.EVENT_ENTITY_CHANGE,
            'entity>document>localeEnvironment>>readyLocales'.toPath(),
            'entity>document>localeEnvironment>>readyLocales>|'.toQuery(),
            (function (event) {
                var localeRef = event.originalPath.getLastKey();
                giant.Locale.create(localeRef.toDocumentKey())
                    .onLocaleMarkedAsReady(event);
            }));
});

giant.amendPostponed(giant, 'DocumentKey', function () {
    "use strict";

    giant.DocumentKey
        .addMethods(/** @lends giant.DocumentKey */{
            /** @returns {giant.Locale} */
            toLocale: function () {
                return giant.Locale.create(this);
            }
        });
});

(function () {
    "use strict";

    giant.addTypes(/** @lends giant */{
        /** @param {giant.Locale} expr */
        isLocale: function (expr) {
            return giant.Locale.isBaseOf(expr);
        },

        /** @param {giant.Locale} [expr] */
        isLocaleOptional: function (expr) {
            return typeof expr === 'undefined' ||
                giant.Locale.isBaseOf(expr);
        }
    });

    giant.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @returns {giant.Locale}
             */
            toLocale: function () {
                var localeKey = ['locale', this.valueOf()].toDocumentKey();
                return giant.Locale.create(localeKey);
            }
        },
        false, false, false);
}());
