$oop.postpone($i18n, 'LocaleBound', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Adds locale binding functionality to the host class.
     * @class
     * @extends $oop.Base
     */
    $i18n.LocaleBound = self
        .addMethods(/** @lends $i18n.LocaleBound# */{
            /** @ignore */
            init: function () {
                /** @type {$data.Tree} */
                this.localeBindings = $data.Tree.create();
            },

            /**
             * Binds the specified handler to current locale readiness event.
             * @param {string} methodName
             * @returns {$i18n.LocaleBound}
             */
            bindToCurrentLocaleReady: function (methodName) {
                $assertion.isFunction(this[methodName], "Attempting to bind non-method");

                var eventName = $i18n.EVENT_CURRENT_LOCALE_READY,
                    localeBindings = this.localeBindings,
                    bindingPath = [eventName, methodName].toPath(),
                    bindingInfo = localeBindings.getNode(bindingPath),
                    handler;

                if (!bindingInfo) {
                    handler = this[methodName].bind(this);
                    $i18n.LocaleEnvironment.create()
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
             * @returns {$i18n.LocaleBound}
             */
            unbindFromCurrentLocaleReady: function (methodName) {
                $assertion.isFunction(this[methodName], "Attempting to unbind non-method");

                var eventName = $i18n.EVENT_CURRENT_LOCALE_READY,
                    localeBindings = this.localeBindings,
                    bindingPath = [eventName, methodName].toPath(),
                    bindingInfo = localeBindings.getNode(bindingPath),
                    handler;

                if (bindingInfo) {
                    handler = bindingInfo.handler;
                    $i18n.LocaleEnvironment.create()
                        .unsubscribeFrom(eventName, handler);
                    localeBindings.unsetPath(bindingPath);
                }

                return this;
            },

            /**
             * Unbinds all locale related handlers.
             * @returns {$i18n.LocaleBound}
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
