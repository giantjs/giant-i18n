$oop.amendPostponed($entity, 'config', function () {
    "use strict";

    $entity.config
        .appendNode('document>field'.toPath(), {
            'locale/name'         : {fieldType: 'string'},
            /** Reserved. Not used currently. */
            'locale/timezone'     : {fieldType: 'string'},
            'locale/countryCode'  : {fieldType: 'string'},
            'locale/languageCode' : {fieldType: 'string'},
            'locale/pluralFormula': {fieldType: 'string'},
            'locale/translations' : {fieldType: 'collection'},

            'localeEnvironment/currentLocale': {fieldType: 'reference'},
            'localeEnvironment/readyLocales' : {fieldType: 'collection'}
        });
});
