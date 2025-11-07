/**
 * @typedef { import("@prisma/client").Words } Word
 */

import prisma from "./prisma";
import { notFound } from "next/navigation";
import idCompat from "./idCompat";

/**
 * @param {String} idOrTzWord 
 * @returns {Word}
 */
export async function getWord(idOrTzWord) {
  if (!idOrTzWord) {
    return notFound();
  }

  if (idOrTzWord == "new") {
    return {
      notes: null,
      source_id: "",
      part_of_speech: "Other",
      Spellings: [
        {
          spelling: "",
          is_primary: true
        }
      ],
      Senses: [],
      Examples: []
    }
  }

  let mode = "id";
  try {
    idCompat(idOrTzWord);
  } catch {
    mode = "tzWord";
  }

  let result;
  if (mode == "id") {
    try {
      result = await prisma.words.findUnique({
        where: idCompat(idOrTzWord),
        include: {
          Spellings: true,
          Senses: true,
          Sources: true,
          Examples: true
        },
      });
    } catch (e) {
      console.error(e);
    }
  } else if (mode == "tzWord") {
    result = await prisma.words.findFirst({
      where: {
        Spellings: {
          some: {
            is_primary: true,
            spelling: {
              equals: decodeURIComponent(idOrTzWord),
              mode: "insensitive"
            }
          }
        }
      },
      include: {
        Spellings: true,
        Senses: true,
        Sources: true,
        Examples: true
      },
    })
  }

  if (result != null) {
    return result;
  } else {
    return notFound();
  }
}
