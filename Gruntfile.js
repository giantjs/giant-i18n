/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'src/namespace.js',
            'src/config.js',
            'src/globals/localeEventSpace.js',
            'src/documents/LocaleDocument.js',
            'src/documents/LocaleEnvironmentDocument.js',
            'src/LocaleChangeEvent.js',
            'src/Locale.js',
            'src/LocaleEnvironment.js',
            'src/LocaleBound.js',
            'src/Translatable.js',
            'src/exports.js'
        ],

        test: [
            'src/jsTestDriver.conf'
        ],

        globals: {}
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
