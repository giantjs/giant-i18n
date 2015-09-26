$oop.postpone($i18n, 'LocaleChangeEvent', function () {
    "use strict";

    var base = $event.Event,
        self = base.extend();

    /**
     * @name $i18n.LocaleChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {$i18n.LocaleChangeEvent}
     */

    /**
     * @class
     * @extends $oop.Base
     */
    $i18n.LocaleChangeEvent = self
        .addMethods(/** @lends $i18n.LocaleChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {$event.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * @type {$i18n.Locale}
                 */
                this.localeBefore = undefined;

                /**
                 * @type {$i18n.Locale}
                 */
                this.localeAfter = undefined;
            },

            /**
             * @param {$i18n.Locale} localeBefore
             * @returns {$i18n.LocaleChangeEvent}
             */
            setLocaleBefore: function (localeBefore) {
                this.localeBefore = localeBefore;
                return this;
            },

            /**
             * @param {$i18n.Locale} localeAfter
             * @returns {$i18n.LocaleChangeEvent}
             */
            setLocaleAfter: function (localeAfter) {
                this.localeAfter = localeAfter;
                return this;
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($i18n, 'LocaleChangeEvent', function (eventName) {
            var prefix = 'locale.change';
            return eventName.substr(0, prefix.length) === prefix;
        });
});
