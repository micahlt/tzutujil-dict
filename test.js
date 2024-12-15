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

/** @type {Definition} */
const blankDefinition = {
  "en": { "translation": "", "example": "" },
  "es": { "translation": "", "example": "" },
  "tz": { "example": "" }
}

const definitionsA = [
  {
    "en": { "translation": "fromDefA", "example": "" },
    "es": { "translation": "abdomen", "example": "mea abdomen" },
    "tz": { "example": "" }
  }
];

const definitionsB = [
  {
    "en": { "translation": "fromDefA", "example": "fromDefB" },
    "es": { "translation": "abdomen", "example": "" },
    "tz": { "example": "tfasfz" }
  },
  {
    "en": { "translation": "stomach", "example": "test" },
    "es": { "translation": "", "example": "" },
    "tz": { "example": "regular" }
  }
];

/**
 * Merge two definition arrays
 * @param {Definition[]} A
 * @param {Definition[]} B
 */
function mergeDefinitions(A = [], B = []) {
  // Validate inputs are arrays
  if (!Array.isArray(A) || !Array.isArray(B)) {
    throw new Error("Both inputs must be arrays");
  }

  const locales = ["es", "en", "tz"];

  // Loop over definitions in the incoming word
  B.forEach((def) => {
    // The index of the closest definition in the base word def array
    const baseIndex = A.findIndex(
      (base) => base.es.translation == def.es.translation
    );
    // If the Spanish translation does not yet exist then create a new definition
    if (baseIndex == -1) {
      if (!!def.es?.translation) {
        A.push({
          ...blankDefinition,
          ...def,
        });
      } else {
        if (
          !A[0].tz.example &&
          !A[0].en.translation &&
          !A[0].en.example &&
          !A[0].es.example
        ) {
          A[0] = { ...A[0], ...def };
        } else {
          A.push({
            ...blankDefinition,
            ...def,
          });
        }
      }
    }
    // If the Spanish translation already exists then merge the definitions
    else {
      A[baseIndex].es.translation = def.es?.translation || "";
      A[baseIndex].en.translation = def.en?.translation || "";
      locales.forEach((l) => {
        if (!!def[l]?.example) {
          if (!!A[baseIndex][l].example) {
            // In the case of two different examples under the same translation,
            // we simply append the second example as a string
            if (A[baseIndex][l].example != def[l].example) {
              A[baseIndex][l].example += "\n" + def[l].example;
            }
          } else {
            A[baseIndex][l].example = def[l].example;
          }
        }
      });
    }
  });

  return A;
}

console.log(mergeDefinitions(definitionsA, definitionsB));
