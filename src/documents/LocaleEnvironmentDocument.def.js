/*global giant */
$oop.postpone(giant, 'LocaleEnvironmentDocument', function () {
    "use strict";

    var base = giant.Document,
        self = base.extend();

    /**
     * @name giant.LocaleEnvironmentDocument.create
     * @function
     * @param {giant.DocumentKey} localeEnvironmentKey
     * @returns {giant.LocaleEnvironmentDocument}
     */

    /**
     * @class
     * @extends giant.Document
     */
    giant.LocaleEnvironmentDocument = self
        .addMethods(/** @lends giant.LocaleEnvironmentDocument# */{
            /**
             * Retrieves the current document key.
             * @returns {giant.DocumentKey}
             */
            getCurrentLocaleKey: function () {
                var localeRef = this.getField('currentLocale').getValue();
                return localeRef && localeRef.toDocumentKey();
            },

            /**
             * @param {giant.DocumentKey} localeKey
             * @returns {giant.LocaleEnvironmentDocument}
             */
            setCurrentLocaleKey: function (localeKey) {
                $assertion.isDocumentKey(localeKey, "Invalid locale key");
                this.getField('currentLocale').setValue(localeKey.toString());
                return this;
            },

            /**
             * @param {giant.DocumentKey} localeKey
             * @returns {giant.LocaleEnvironmentDocument}
             */
            addReadyLocale: function (localeKey) {
                $assertion.isDocumentKey(localeKey, "Invalid locale key");
                this.getField('readyLocales').getItem(localeKey.toString()).setValue(true);
                return this;
            },

            /**
             * @param {giant.DocumentKey} localeKey
             * @returns {boolean}
             */
            getReadyLocale: function (localeKey) {
                $assertion.isDocumentKey(localeKey, "Invalid locale key");
                return this.getField('readyLocales').getItem(localeKey.toString()).getValue();
            }
        });
});

$oop.amendPostponed(giant, 'Document', function () {
    "use strict";

    giant.Document
        .addSurrogate(giant, 'LocaleEnvironmentDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'localeEnvironment';
        });
});
