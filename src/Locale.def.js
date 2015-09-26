$oop.postpone($i18n, 'Locale', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend()
            .addTrait($event.Evented);

    /**
     * @name $i18n.Locale.create
     * @function
     * @param {$entity.DocumentKey} localeKey
     * @returns {$i18n.Locale}
     */

    /**
     * Represents a locale, such as 'en-us', or 'de-de'. Provides an API for setting a locale
     * as current locale, as well as translating strings.
     * @class
     * @extends $oop.Base
     * @extends $event.Evented
     * @extends $utils.Stringifiable
     */
    $i18n.Locale = self
        .setInstanceMapper(function (localeKey) {
            return String(localeKey);
        })
        .setEventSpace($event.eventSpace)
        .addPrivateMethods(/** @lends $i18n.Locale# */{
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
        .addMethods(/** @lends $i18n.Locale# */{
            /**
             * @param {$entity.DocumentKey} localeKey
             * @ignore
             */
            init: function (localeKey) {
                $assertion.isDocumentKey(localeKey, "Invalid locale key");

                /**
                 * Document key identifying locale.
                 * @type {$entity.DocumentKey}
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
             * @returns {$i18n.Locale}
             */
            setAsCurrentLocale: function () {
                $i18n.LocaleEnvironment.create().setCurrentLocale(this);
                return this;
            },

            /**
             * Marks locale as ready for use.
             * This is how the application signals to $i18n that loading and merging the locale
             * has finished. V18n is agnostic about the process by which locales are loaded,
             * so the application needs to tell $i18n explicitly that it has.
             * @returns {$i18n.Locale}
             */
            markAsReady: function () {
                $i18n.LocaleEnvironment.create().markLocaleAsReady(this);
                return this;
            },

            /**
             * Tests whether locale is marked as ready.
             * @returns {boolean}
             */
            isMarkedAsReady: function () {
                return $i18n.LocaleEnvironment.create().isLocaleMarkedAsReady(this);
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
             * @ignore
             */
            onLocaleMarkedAsReady: function () {
                this.triggerSync($i18n.EVENT_LOCALE_READY);
            }
        });
});

$oop.amendPostponed($entity, 'entityEventSpace', function () {
    "use strict";

    $entity.entityEventSpace
        .subscribeTo(
        $entity.EVENT_ENTITY_CHANGE,
        'entity>document>localeEnvironment>>readyLocales'.toPath(),
        (function (event) {
            var itemKey = event.affectedKey,
                localeRef = itemKey && itemKey.itemId,
                localeKey = localeRef && localeRef.toDocumentKey();

            if (localeKey) {
                $i18n.Locale.create(localeKey)
                    .onLocaleMarkedAsReady(event);
            }
        }));
});

$oop.amendPostponed($entity, 'DocumentKey', function () {
    "use strict";

    $entity.DocumentKey
        .addMethods(/** @lends $entity.DocumentKey */{
            /** @returns {$i18n.Locale} */
            toLocale: function () {
                return $i18n.Locale.create(this);
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($i18n, /** @lends $i18n */{
        /**
         * Signals that a locale is ready for use.
         * @constant
         */
        EVENT_LOCALE_READY: 'locale.ready'
    });

    $assertion.addTypes(/** @lends $i18n */{
        /** @param {$i18n.Locale} expr */
        isLocale: function (expr) {
            return $i18n.Locale.isBaseOf(expr);
        },

        /** @param {$i18n.Locale} [expr] */
        isLocaleOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $i18n.Locale.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * @returns {$i18n.Locale}
         */
        toLocale: function () {
            var localeKey = ['locale', this.valueOf()].toDocumentKey();
            return $i18n.Locale.create(localeKey);
        }
    });
}());
