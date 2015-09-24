/*global giant */
$oop.postpone(giant, 'LocaleChangeEvent', function () {
    "use strict";

    var base = $event.Event,
        self = base.extend();

    /**
     * @name giant.LocaleChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {giant.LocaleChangeEvent}
     */

    /**
     * @class
     * @extends $oop.Base
     */
    giant.LocaleChangeEvent = self
        .addMethods(/** @lends giant.LocaleChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {$event.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * @type {giant.Locale}
                 */
                this.localeBefore = undefined;

                /**
                 * @type {giant.Locale}
                 */
                this.localeAfter = undefined;
            },

            /**
             * @param {giant.Locale} localeBefore
             * @returns {giant.LocaleChangeEvent}
             */
            setLocaleBefore: function (localeBefore) {
                this.localeBefore = localeBefore;
                return this;
            },

            /**
             * @param {giant.Locale} localeAfter
             * @returns {giant.LocaleChangeEvent}
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
        .addSurrogate(giant, 'LocaleChangeEvent', function (eventName) {
            var prefix = 'locale.change';
            return eventName.substr(0, prefix.length) === prefix;
        });
});
