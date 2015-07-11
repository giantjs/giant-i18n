/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/config.js',
            'js/globals/localeEventSpace.js',
            'js/documents/LocaleDocument.js',
            'js/documents/LocaleEnvironmentDocument.js',
            'js/LocaleChangeEvent.js',
            'js/Locale.js',
            'js/LocaleEnvironment.js',
            'js/LocaleBound.js',
            'js/Translatable.js',
            'js/exports.js'
        ],

        test: [
            'js/jsTestDriver.conf'
        ],

        globals: {}
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
