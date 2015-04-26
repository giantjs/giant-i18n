/*global dessert, troop, sntls, bookworm, v18n */
troop.postpone(v18n, 'LocaleEnvironmentDocument', function () {
    "use strict";

    var base = bookworm.Document,
        self = base.extend();

    /**
     * @name v18n.LocaleEnvironmentDocument.create
     * @function
     * @param {bookworm.DocumentKey} localeEnvironmentKey
     * @returns {v18n.LocaleEnvironmentDocument}
     */

    /**
     * @class
     * @extends bookworm.Document
     */
    v18n.LocaleEnvironmentDocument = self
        .addMethods(/** @lends v18n.LocaleEnvironmentDocument# */{
            /**
             * Retrieves the current document key.
             * @returns {bookworm.DocumentKey}
             */
            getCurrentLocaleKey: function () {
                var localeRef = this.getField('currentLocale').getValue();
                return localeRef && localeRef.toDocumentKey();
            },

            /**
             * @param {bookworm.DocumentKey} localeKey
             * @returns {v18n.LocaleEnvironmentDocument}
             */
            setCurrentLocaleKey: function (localeKey) {
                dessert.isDocumentKey(localeKey, "Invalid locale key");
                this.getField('currentLocale').setValue(localeKey.toString());
                return this;
            },

            /**
             * @param {bookworm.DocumentKey} localeKey
             * @returns {v18n.LocaleEnvironmentDocument}
             */
            addReadyLocale: function (localeKey) {
                dessert.isDocumentKey(localeKey, "Invalid locale key");
                this.getField('readyLocales').getItem(localeKey.toString()).setValue(true);
                return this;
            }
        });
});

troop.amendPostponed(bookworm, 'Document', function () {
    "use strict";

    bookworm.Document
        .addSurrogate(v18n, 'LocaleEnvironmentDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'localeEnvironment';
        });
});
