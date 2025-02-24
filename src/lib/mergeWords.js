/**
 * Merge two word objects together, keeping the properties of the initial object where they exist and adding the properties of the new object where they do not.
 * @param {Word} baseWord Base word object to merge into
 * @param {Word} newWord New word object to merge into the base word
 * @returns {Word} The merged word object
 */
export default function mergeWords(baseWord, newWord) {
  console.log("\n| TzDB WordMerge 2.0 starting\n|============================");
  // Remove the weird apostraphe characters
  baseWord.variants = baseWord.variants.map((v) => v.replaceAll("’", "'"));
  newWord.variants = newWord.variants.map((v) => v.replaceAll("’", "'"));
  // Merge spelling variants
  baseWord.variants = Array.from(
    new Set([...baseWord.variants, ...newWord.variants])
  );
  // Merge translations and examples
  baseWord.definitions = mergeDefinitions(
    baseWord.definitions,
    newWord.definitions
  );
  // Loop and merge the remaining fields
  for (const field of Object.keys(newWord).filter(
    (f) => !["definitions", "variants", "_id", "lastModified"].includes(f)
  )) {
    // Handle merging string fields
    if (["string", "number"].includes(typeof baseWord[field])) {
      if (!baseWord[field] && !!newWord[field]) {
        console.log(`| Writing new data for field ${field}`);
        baseWord[field] = newWord[field];
      } else {
        console.log(`| Not overwriting field ${field}`);
      }
    } else if (typeof baseWord[field] == "object") {
      if (baseWord[field] === null) {
        console.log(`| Overwriting field ${field}`);
        baseWord[field] = newWord[field];
      } else {
        console.log(`| Merging array for field ${field}`);
        baseWord[field] = [...baseWord[field], ...newWord[field]];
      }
    }
  }
  console.log("| Word merged successfully\n|============================\n");
  return baseWord;
}

/** @type {Definition} */
const blankDefinition = {
  en: { translation: "", example: "" },
  es: { translation: "", example: "" },
  tz: { example: "" },
};

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
      (base) => base.es.translation?.trim()?.toLowerCase() == def.es.translation?.trim()?.toLowerCase()
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
      console.log("| Incoming def")
      console.log(A[baseIndex]);
      A[baseIndex].es.translation = A[baseIndex].es.translation || (def.es?.translation || "");
      A[baseIndex].en.translation = A[baseIndex].en.translation || (def.en?.translation || "");
      locales.forEach((l) => {
        if (!!def[l]?.example) {
          if (!!A[baseIndex][l].example) {
            // In the case of two different examples under the same translation,
            // we simply append the second example as a string
            if (A[baseIndex][l].example != def[l].example.replaceAll("’", "'")) {
              A[baseIndex][l].example += "\n" + def[l].example;
              A[baseIndex][l].example = A[baseIndex][l].example.replaceAll("’", "'")
            }
          } else {
            A[baseIndex][l].example = def[l].example.replaceAll("’", "'");
          }
        }
      });
    }
  });

  return A;
}

let r = mergeDefinitions(
  [
    {
      es: {
        translation: "hola",
      },
      en: {},
      tz: {},
    },
  ],
  [
    {
      es: {
        translation: "mega",
        example: "hey hola",
      },
    },
    {
      es: {
        translation: "hola",
        example: "this is a joke",
      },
    },
    {
      es: {
        example: "this is a jork",
      },
      en: {
        translation: "hey",
      },
    },
  ]
);