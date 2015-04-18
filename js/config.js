/*global dessert, troop, sntls, flock, bookworm */
troop.amendPostponed(bookworm, 'config', function () {
    "use strict";

    bookworm.config
        .setNode('document>document>locale'.toPath(), /** @class @lends v18n.LocaleNode*/{
            /** @type {string} */
            countryCode: 'string',

            /** @type {string} */
            languageCode: 'string',

            /** @type {object} */
            translations: 'collection'
        });
});
