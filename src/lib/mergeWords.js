/**
 * Merge two word objects together, keeping the properties of the initial object where they exist and adding the properties of the new object where they do not.
 * @param {Word} baseWord Base word object to merge into
 * @param {Word} newWord New word object to merge into the base word
 * @returns {Word} The merged word object
 */
export default function mergeWords(baseWord, newWord) {
  console.log("\n| TzDB WordMerge 1.0 starting\n|============================");
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
      console.log(`| Merging array for field ${field}`);
      baseWord[field] = [...baseWord[field], ...newWord[field]];
    }
  }
  console.log("| Word merged successfully\n|============================\n");
  return baseWord;
}

function mergeDefinitions(A, B) {
  const res = [...A];

  B.forEach((b) => {
    let flag = false;

    res.forEach((a) => {
      Object.keys(b).forEach((lang) => {
        if (!a[lang]) {
          a[lang] = {
            translation: "",
            example: "",
          };
        }

        if (
          b[lang].translation &&
          b[lang].translation === a[lang].translation
        ) {
          if (b[lang].example && !a[lang].example) {
            a[lang].example = b[lang].example;
          }
          flag = true;
        } else if (b[lang].translation && !a[lang].translation) {
          a[lang].translation = b[lang].translation;
          a[lang].example = b[lang].example || "";
          flag = true;
        }
      });
    });

    if (!flag) {
      res.push({ ...b });
    }
  });

  res.forEach((def) => {
    Object.keys(def).forEach((lang) => {
      const vis = new Set();
      res.forEach((d) => {
        if (d[lang] && d[lang].example) {
          if (vis.has(d[lang].example)) {
            d[lang].example = "";
          } else {
            vis.add(d[lang].example);
          }
        }
      });
    });
  });

  return res;
}
