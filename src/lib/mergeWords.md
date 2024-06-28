Merge Words flow
----------------
- Create a copy of the old definitions array (i.e., `res`).
- Iterate over each new definition (`b`) in `newDefs`.
- For each new definition, check if it matches any existing definition (`a`) in `res`.
    - If a `lang` in the new definition does not exist in the old definition, initialize it.
    - If the translation in the new definition matches the translation in the old definition and the example in the new definition is non-empty and the old definition’s example is empty, update the old definition’s example.

- If the translation in the new definition does not exist in the old one, add the new translation and example to the old one.
- If no match is found for a new definition after checking all existing definitions, add the new one to `res`.
- Use a `Set()` to keep track of visited examples for each language.
- If an example is already visited, set the duplicate example to an empty string.
- 
------------------------------------------------

source: [Stack Overflow](https://stackoverflow.com/a/78679612/10806546)