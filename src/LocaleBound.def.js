/*global giant */
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
                /** @type {giant.Tree} */
                this.localeBindings = giant.Tree.create();
            },

            /**
             * Binds the specified handler to current locale readiness event.
             * @param {string} methodName
             * @returns {giant.LocaleBound}
             */
            bindToCurrentLocaleReady: function (methodName) {
                giant.isFunction(this[methodName], "Attempting to bind non-method");

                var eventName = giant.EVENT_CURRENT_LOCALE_READY,
                    localeBindings = this.localeBindings,
                    bindingPath = [eventName, methodName].toPath(),
                    bindingInfo = localeBindings.getNode(bindingPath),
                    handler;

                if (!bindingInfo) {
                    handler = this[methodName].bind(this);
                    giant.LocaleEnvironment.create()
                        .subscribeTo(eventName, handler);
                    localeBindings.setNode(bindingPath, {
                        eventName : eventName,
                        methodName: methodName,
                        handler   : handler
                    });
                }

                return this;
            },

            /**
             * Unbinds specified handler from current locale readiness event.
             * @param {string} methodName
             * @returns {giant.LocaleBound}
             */
            unbindFromCurrentLocaleReady: function (methodName) {
                giant.isFunction(this[methodName], "Attempting to unbind non-method");

                var eventName = giant.EVENT_CURRENT_LOCALE_READY,
                    localeBindings = this.localeBindings,
                    bindingPath = [eventName, methodName].toPath(),
                    bindingInfo = localeBindings.getNode(bindingPath),
                    handler;

                if (bindingInfo) {
                    handler = bindingInfo.handler;
                    giant.LocaleEnvironment.create()
                        .unsubscribeFrom(eventName, handler);
                    localeBindings.unsetPath(bindingPath);
                }

                return this;
            },

            /**
             * Unbinds all locale related handlers.
             * @returns {giant.LocaleBound}
             */
            unbindAll: function () {
                var that = this;

                // querying all binding parameters
                this.localeBindings
                    .queryValuesAsHash('|>|'.toQuery())
                    .toCollection()
                    .forEachItem(function (bindingInfo) {
                        that.unbindFromCurrentLocaleReady(bindingInfo.methodName);
                    });

                return this;
            }
        });
});
