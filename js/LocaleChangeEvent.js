/*global dessert, troop, sntls, evan, v18n */
troop.postpone(v18n, 'LocaleChangeEvent', function () {
    "use strict";

    var base = evan.Event,
        self = base.extend();

    /**
     * @name v18n.LocaleChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {evan.EventSpace} eventSpace
     * @returns {v18n.LocaleChangeEvent}
     */

    /**
     * @class
     * @extends troop.Base
     */
    v18n.LocaleChangeEvent = self
        .addMethods(/** @lends v18n.LocaleChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {evan.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * @type {v18n.Locale}
                 */
                this.localeBefore = undefined;

                /**
                 * @type {v18n.Locale}
                 */
                this.localeAfter = undefined;
            },

            /**
             * @param {v18n.Locale} localeBefore
             * @returns {v18n.LocaleChangeEvent}
             */
            setLocaleBefore: function (localeBefore) {
                this.localeBefore = localeBefore;
                return this;
            },

            /**
             * @param {v18n.Locale} localeAfter
             * @returns {v18n.LocaleChangeEvent}
             */
            setLocaleAfter: function (localeAfter) {
                this.localeAfter = localeAfter;
                return this;
            }
        });
});

troop.amendPostponed(evan, 'Event', function () {
    "use strict";

    evan.Event
        .addSurrogate(v18n, 'LocaleChangeEvent', function (eventName) {
            var prefix = 'locale.change';
            return eventName.substr(0, prefix.length) === prefix;
        });
});
