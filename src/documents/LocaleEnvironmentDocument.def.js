/*global giant */
$oop.postpone(giant, 'LocaleEnvironmentDocument', function () {
    "use strict";

    var base = $entity.Document,
        self = base.extend();

    /**
     * @name giant.LocaleEnvironmentDocument.create
     * @function
     * @param {$entity.DocumentKey} localeEnvironmentKey
     * @returns {giant.LocaleEnvironmentDocument}
     */

    /**
     * @class
     * @extends $entity.Document
     */
    giant.LocaleEnvironmentDocument = self
        .addMethods(/** @lends giant.LocaleEnvironmentDocument# */{
            /**
             * Retrieves the current document key.
             * @returns {$entity.DocumentKey}
             */
            getCurrentLocaleKey: function () {
                var localeRef = this.getField('currentLocale').getValue();
                return localeRef && localeRef.toDocumentKey();
            },

            /**
             * @param {$entity.DocumentKey} localeKey
             * @returns {giant.LocaleEnvironmentDocument}
             */
            setCurrentLocaleKey: function (localeKey) {
                $assertion.isDocumentKey(localeKey, "Invalid locale key");
                this.getField('currentLocale').setValue(localeKey.toString());
                return this;
            },

            /**
             * @param {$entity.DocumentKey} localeKey
             * @returns {giant.LocaleEnvironmentDocument}
             */
            addReadyLocale: function (localeKey) {
                $assertion.isDocumentKey(localeKey, "Invalid locale key");
                this.getField('readyLocales').getItem(localeKey.toString()).setValue(true);
                return this;
            },

            /**
             * @param {$entity.DocumentKey} localeKey
             * @returns {boolean}
             */
            getReadyLocale: function (localeKey) {
                $assertion.isDocumentKey(localeKey, "Invalid locale key");
                return this.getField('readyLocales').getItem(localeKey.toString()).getValue();
            }
        });
});

$oop.amendPostponed($entity, 'Document', function () {
    "use strict";

    $entity.Document
        .addSurrogate(giant, 'LocaleEnvironmentDocument', function (documentKey) {
            return documentKey && documentKey.documentType === 'localeEnvironment';
        });
});
