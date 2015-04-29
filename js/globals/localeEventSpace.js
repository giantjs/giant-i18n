/*global dessert, troop, sntls, v18n */
troop.postpone(v18n, 'localeEventSpace', function () {
    "use strict";

    /**
     * Event space dedicated to locale events.
     * @type {evan.EventSpace}
     */
    v18n.localeEventSpace = evan.EventSpace.create();
});
