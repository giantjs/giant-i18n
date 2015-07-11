/*global giant, giant, giant, giant, giant, giant */
giant.postpone(giant, 'LocaleBound', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * Adds locale binding functionality to the host class.
     * @class
     * @extends giant.Base
     */
    giant.LocaleBound = self
        .addMethods(/** @lends giant.LocaleBound# */{
            /** @ignore */
            init: function () {
                /** @type {giant.Collection} */
                this.localeBindings = giant.Collection.create()
                    .setItem(giant.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY, []);
            },

            /**
             * Binds the specified handler to current locale readiness event.
             * @param {function} handler
             * @returns {giant.LocaleBound}
             */
            bindToCurrentLocaleReady: function (handler) {
                giant.isFunction(handler, "Invalid handler");

                var EVENT_CURRENT_LOCALE_READY = giant.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY,
                    handlers = this.localeBindings.getItem(EVENT_CURRENT_LOCALE_READY),
                    handlerIndex = handlers.indexOf(handler);

                if (handlerIndex === -1) {
                    handlers.push(handler);
                    giant.LocaleEnvironment.create()
                        .subscribeTo(EVENT_CURRENT_LOCALE_READY, handler);
                }

                return this;
            },

            /**
             * Unbinds specified handler from current locale readiness event.
             * @param {function} handler
             * @returns {giant.LocaleBound}
             */
            unbindFromCurrentLocaleReady: function (handler) {
                giant.isFunction(handler, "Invalid handler");

                var EVENT_CURRENT_LOCALE_READY = giant.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY,
                    handlers = this.localeBindings.getItem(giant.LocaleEnvironment.EVENT_CURRENT_LOCALE_READY),
                    handlerIndex = handlers.indexOf(handler);

                if (handlerIndex !== -1) {
                    handlers.splice(handlerIndex, 1);
                    giant.LocaleEnvironment.create()
                        .unsubscribeFrom(EVENT_CURRENT_LOCALE_READY, handler);
                }

                return this;
            },

            /**
             * Unbinds all locale related handlers.
             * @returns {giant.LocaleBound}
             */
            unbindAll: function () {
                var localeEnvironment = giant.LocaleEnvironment.create();

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
