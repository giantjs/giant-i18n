/*global dessert, troop, sntls, evan, v18n */
troop.postpone(v18n, 'StringFormat', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name v18n.StringFormat.create
     * @function
     * @param {string} format Handlebars - based format string.
     * @returns {v18n.StringFormat}
     */

    /**
     * String format with handlebars parameters that may be replaced with string literals or other formats.
     * @class
     * @extends troop.Base
     */
    v18n.StringFormat = self
        .addConstants(/** @lends v18n.StringFormat */{
            /**
             * @type {RegExp}
             * @constant
             */
            RE_PLACEHOLDER_TESTER: /^{{ \w+ }}$/,

            /**
             * @type {RegExp}
             * @constant
             */
            RE_FORMAT_SPLITTER: /({{ \w+ }})/
        })
        .addPrivateMethods(/** @lends v18n.StringFormat# */{
            /**
             * @param {Array} resolvedParameters Array of strings and arrays.
             * @returns {string}
             * @private
             */
            _flattenResolvedParameters: function (resolvedParameters) {
                var result = "",
                    i, subTree;

                for (i = 0; i < resolvedParameters.length; i++) {
                    subTree = resolvedParameters[i];
                    if (subTree instanceof Array) {
                        result += this._flattenResolvedParameters(subTree);
                    } else {
                        result += subTree;
                    }
                }

                return result;
            }
        })
        .addMethods(/** @lends v18n.StringFormat# */{
            /**
             * @param {string} format
             * @ignore
             */
            init: function (format) {
                /**
                 * Original format string.
                 * @type {string}
                 */
                this.format = format;

                /**
                 * Tokenized format split along placeholders.
                 * @type {string[]}
                 */
                this.tokens = undefined;

                this.parseFormat();
            },

            /**
             * Parses format and stores results as instance properties.
             * Override in subclasses.
             * @returns {v18n.StringFormat}
             */
            parseFormat: function () {
                var format = this.format,
                    tokens;

                if (this.RE_PLACEHOLDER_TESTER.test(format)) {
                    this.tokens = format;
                } else {
                    tokens = format.split(this.RE_FORMAT_SPLITTER);
                    this.tokens = tokens.length > 1 ? tokens : format;
                }

                return this;
            },

            /**
             * Fills current format with content using the specified replacements and returns the generated string.
             * @param {object} replacements Placeholder - format string associations.
             * @returns {string}
             * @example
             * 'May fortune {{ foo }}'.toStringFormat()
             *  .setContent({
             *      '{{ foo }}': "favor the {{ what }}.",
             *      '{{ what }}': "foolish"
             *  }) // "May fortune favor the foolish."
             */
            setContent: function (replacements) {
                var resolvedParameters = sntls.Collection
                    // merging current format with replacement values as formats
                    .create({
                        '{{ main }}': this.format.toStringFormat()
                    })
                    .mergeWith(sntls.Collection.create(replacements)
                        // discarding value-less replacements
                        .filterBySelector(function (replacement) {
                            return typeof replacement !== 'undefined';
                        })
                        // converting each replacement to a format
                        .passEachItemTo(String)
                        .callOnEachItem('toStringFormat'))
                    .toStringFormatCollection()

                    // resolving format parameters for main format as well as replacements
                    .resolveParameters();

                return this._flattenResolvedParameters(resolvedParameters['{{ main }}']);
            }
        });
});

(function (/**v18n*/widgets) {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {v18n.StringFormat} expr */
        isStringFormat: function (expr) {
            return widgets.StringFormat.isBaseOf(expr);
        },

        /** @param {v18n.StringFormat} expr */
        isStringFormatOptional: function (expr) {
            return typeof expr === 'undefined' &&
                   widgets.StringFormat.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to StringFormat instance.
             * @returns {v18n.StringFormat}
             */
            toStringFormat: function () {
                return widgets.StringFormat.create(this.valueOf());
            }
        },
        false, false, false);
}(v18n));
