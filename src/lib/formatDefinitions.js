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
    // Trim whitespace from examples
    for (const key of ["en", "es", "tz"]) {
      if (definitionArr[index][key]?.example) {
        definitionArr[index][key].example =
          definitionArr[index][key].example.trim();
      }
      if (definitionArr[index][key]?.translation) {
        definitionArr[index][key].translation =
          definitionArr[index][key].translation.trim();
        if (forceLower) {
          definitionArr[index][key].translation = toLowerCaseFirstLetter(
            definitionArr[index][key].translation
          );
        }
      }
    }
  }
  return definitionArr;
}
