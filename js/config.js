/*global dessert, troop, sntls, flock, bookworm */
troop.amendPostponed(bookworm, 'config', function () {
    "use strict";

    bookworm.config
        .setNode('document>document>locale'.toPath(), /** @class @lends v18n.LocaleNode*/{
            /** @type {string} */
            name: 'string',

            /**
             * Reserved. Not used currently.
             * @type {string}
             */
            timezone: 'string',

            /** @type {string} */
            countryCode: 'string',

            /** @type {string} */
            languageCode: 'string',

            /** @type {string} */
            pluralFormula: 'string',

            /** @type {object} */
            translations: 'collection'
        });
});
