/**
 * @typedef {Object} Language a language translation and example.  The "tz" translation property should not be defined.
 * @prop {String} [translation] Translation of the Tz'utujil word in a language
 * @prop {String} [example] Example of the word in a language
 */

/**
 * @typedef {Object} Definition trilingual translations and examples
 * @prop {Language} en English definition and example
 * @prop {Language} es Spanish definition and example
 * @prop {Language} tz Tz'utujil example
 */

/**
 * @typedef {Object} Word a word in the Tz'utujil dictionary, containing spellings, definitions, examples, metadata, and much more
 * @prop {ObjectId} _id Identifier
 * @prop {string[]} variants Tz'utujil spelling variants
 * @prop {Definition[]} definitions Array of definitions and examples
 * @prop {String} sourceId ID of the source the word originally came from
 * @prop {String[]} roots Array of IDs representing Tz'utujil root words
 * @prop {Date} lastModified When the word was last updated
 * @prop {Number} part The part of speech
 * @prop {String[]} related Related words
 */
