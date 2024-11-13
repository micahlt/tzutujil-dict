import "./types";

const toLowerCaseFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * Fix spacing and capitalization before importing or updating definitionArr
 * @param {Definition[]} definitionArr
 * @param {Boolean} forceLower
 */
export default function formatDefinitions(definitionArr, forceLower = false) {
  // Update each document
  for (let index in definitionArr) {
    let keepDef = false;
    // Trim whitespace from examples
    for (const key of ["en", "es", "tz"]) {
      if (!!definitionArr[index][key]?.example) {
        keepDef = true;
        definitionArr[index][key].example =
          definitionArr[index][key].example.trim();
      }
      if (!!definitionArr[index][key]?.translation) {
        keepDef = true;
        definitionArr[index][key].translation =
          definitionArr[index][key].translation.trim();
        if (forceLower) {
          definitionArr[index][key].translation = toLowerCaseFirstLetter(
            definitionArr[index][key].translation
          );
        }
      }
    }
    if (!keepDef) {
      console.log("Don't keep definition")
      definitionArr.splice(index, 1);
    }
  }
  return definitionArr;
}
