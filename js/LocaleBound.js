/*global dessert, troop, sntls, evan, shoeshine, v18n */
troop.postpone(v18n, 'LocaleBound', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Adds locale binding functionality to the host class.
     * @class
     * @extends troop.Base
     */
    v18n.LocaleBound = self
        .addMethods(/** @lends v18n.LocaleBound# */{
            /** @ignore */
            init: function () {
                /** @type {sntls.Collection} */
                this.localeBindings = sntls.Collection.create()
                    .setItem(v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY, []);
            },

            /**
             * Binds the specified handler to current locale readiness event.
             * @param {function} handler
             * @returns {v18n.LocaleBound}
             */
            bindToCurrentLocaleReady: function (handler) {
                dessert.isFunction(handler, "Invalid handler");

                var EVENT_CURRENT_LOCALE_READY = v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY,
                    handlers = this.localeBindings.getItem(EVENT_CURRENT_LOCALE_READY),
                    handlerIndex = handlers.indexOf(handler);

                if (handlerIndex === -1) {
                    handlers.push(handler);
                    v18n.LocaleEnvironment.create()
                        .subscribeTo(EVENT_CURRENT_LOCALE_READY, handler);
                }

                return this;
            },

            /**
             * Unbinds specified handler from current locale readiness event.
             * @param {function} handler
             * @returns {v18n.LocaleBound}
             */
            unbindFromCurrentLocaleReady: function (handler) {
                dessert.isFunction(handler, "Invalid handler");

                var EVENT_CURRENT_LOCALE_READY = v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY,
                    handlers = this.localeBindings.getItem(v18n.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY),
                    handlerIndex = handlers.indexOf(handler);

                if (handlerIndex !== -1) {
                    handlers.splice(handlerIndex, 1);
                    v18n.LocaleEnvironment.create()
                        .unsubscribeFrom(EVENT_CURRENT_LOCALE_READY, handler);
                }

                return this;
            },

            /**
             * Unbinds all locale related handlers.
             * @returns {v18n.LocaleBound}
             */
            unbindAll: function () {
                var localeEnvironment = v18n.LocaleEnvironment.create();

                this.localeBindings = this.localeBindings
                    .forEachItem(function (handlers, eventName) {
                        handlers.toCollection()
                            .passEachItemTo(localeEnvironment.unsubscribeFrom, localeEnvironment, 1, eventName);
                    })
                    .mapValues(function () {
                        return [];
                    });

                return this;
            }
        });
});
