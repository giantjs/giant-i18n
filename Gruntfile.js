/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/config.js',
            'js/LocaleDocument.js',
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
