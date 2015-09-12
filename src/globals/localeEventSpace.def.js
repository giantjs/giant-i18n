/*global giant */
giant.postpone(giant, 'localeEventSpace', function () {
    "use strict";

    /**
     * Event space dedicated to locale events.
     * @type {giant.EventSpace}
     */
    giant.localeEventSpace = giant.EventSpace.create();
});
