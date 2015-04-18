/*global dessert, troop, sntls, evan, v18n */
troop.postpone(v18n, 'StringFormatCollection', function (/**v18n*/widgets) {
    "use strict";

    /**
     * @name v18n.StringFormat.create
     * @function
     * @param {object|StringFormat[]} [items]
     * @returns {v18n.StringFormat}
     */

    /**
     * Collection of StringFormat instances. Allows aggregated token extraction and parameters resolution.
     * @class
     * @extends sntls.Collection
     * @extends v18n.StringFormat
     */
    v18n.StringFormatCollection = sntls.Collection.of(widgets.StringFormat)
        .addMethods(/** @lends v18n.StringFormatCollection */{
            /**
             * Extracts a combined set of tokens from all formats in the collection.
             * @returns {sntls.Collection}
             */
            extractTokens: function () {
                return this
                    // concatenating all tokens of all formats in the collection
                    .collectProperty('tokens')
                    .getValues()
                    .reduce(function (previous, current) {
                        return previous.concat(current);
                    }, [])

                    // extracting unique tokens
                    .toStringDictionary()
                    .reverse()

                    // symmetrizing results (key = value)
                    .toCollection()
                    .mapValues(function (index, token) {
                        return token;
                    });
            },

            /**
             * Resolves format parameters. Returns an object in which each format parameter is associated with
             * an array-of-arrays structure holding corresponding string literals.
             * @returns {object}
             */
            resolveParameters: function () {
                var tokens = this.extractTokens(),
                    tokenizedFormats = this
                        .mergeWith(tokens
                            .callOnEachItem('toStringFormat')
                            .toStringFormatCollection())
                        .collectProperty('tokens');

                tokenizedFormats
                    // going through all tokenized formats and replacing parameter value in each
                    .forEachItem(function (/**string[]*/tokenizedFormat) {
                        var i, token;
                        if (tokenizedFormat instanceof Array) {
                            for (i = 0; i < tokenizedFormat.length; i++) {
                                token = tokenizedFormat[i];
                                tokenizedFormat[i] = tokenizedFormats.getItem(token);
                            }
                        }
                    });

                return tokenizedFormats.items;
            }
        });
});

troop.amendPostponed(sntls, 'Hash', function (ns, className, /**v18n*/widgets) {
    "use strict";

    sntls.Hash.addMethods(/** @lends sntls.Hash */{
        /**
         * @returns {v18n.StringFormatCollection}
         */
        toStringFormatCollection: function () {
            return widgets.StringFormatCollection.create(this.items);
        }
    });
}, v18n);

(function (/**v18n*/widgets) {
    "use strict";

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /** @returns {v18n.StringFormatCollection} */
            toStringFormatCollection: function () {
                return widgets.StringFormatCollection.create(this);
            }
        },
        false, false, false);
}(v18n));
