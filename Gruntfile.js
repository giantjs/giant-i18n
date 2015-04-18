/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/config.js',
            'js/Stringifiable.js',
            'js/LocaleDocument.js',
            'js/Locale.js',
            'js/Translatable.js',
            'js/StringFormat.js',
            'js/StringFormatCollection.js',
            'js/exports.js'
        ],

        test: [
            'js/jsTestDriver.conf'
        ],

        globals: {
            dessert : true,
            troop   : true,
            sntls   : true,
            evan    : true,
            flock   : true,
            bookworm: true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
