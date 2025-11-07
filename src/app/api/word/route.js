import "dotenv/config";

/**
 * @typedef { import("@prisma/client").Words } Word
 * @typedef { import("@prisma/client").Sources } Source
 * @typedef { import("@prisma/client").Senses } Sense
 * @typedef { import("@prisma/client").Examples } Example
 * @typedef { import("@prisma/client").Spellings } Spelling
 * 
 * @typedef {Object} WordExtras
 * @property {Source} Source
 * @property {Sense[]} Senses
 * @property {Example[]} Examples
 * @property {Spelling[]} Spellings
 * 
 * @typedef { Word & WordExtras } FullWord
 */

import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import mergeWords from "@/lib/mergeWords.js";
import formatDefinitions from "@/lib/formatDefinitions";
import prisma from "@/lib/prisma";
import idCompat from "@/lib/idCompat";

// Get a word by its ID or primary spelling variant
export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const tzWord = searchParams.get("tzWord");

  if (!id && !tzWord) {
    return Response.json(
      {
        success: false,
        reason: "Missing either id or tzWord params",
      },
      {
        status: 400,
      }
    );
  }

  let result;
  if (id) {
    result = await prisma.words.findUnique({
      where: idCompat(id),
      include: {
        Spellings: true,
        Senses: true,
        Sources: true,
        Examples: true
      },
    });
  } else if (tzWord) {
    result = await prisma.words.findFirst({
      where: {
        Spellings: {
          some: {
            is_primary: true,
            spelling: {
              equals: tzWord,
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
    return Response.json(result, { status: 200 });
  } else {
    return Response.json(
      { success: false, reason: "Word not found" },
      { status: 404 }
    );
  }
}

// Add a new word to the database
export async function PUT(req) {
  const headersList = await headers();
  const password = headersList.get("x-pwd");
  if (password == process.env.ADMIN_PASSWORD) {
    /** @type {FullWord} */
    const json = await req.json();

    if (!json || !json?.Spellings || !json?.Senses || !json?.source_id) {
      return Response.json(
        {
          success: false,
          error:
            "Missing content.  Ensure you have entered spelling variants, definitions, and a source ID",
        },
        {
          status: 400,
        }
      );
    } else {
      try {
        let wordExistsArr = [];

        json.Spellings.forEach((s) => {
          wordExistsArr.push(s.spelling.replaceAll("'", "'"));
          wordExistsArr.push(s.spelling.toLowerCase().replaceAll("'", "'"));
          wordExistsArr.push((s.spelling[0].toUpperCase() + s.spelling.slice(1)).replaceAll("'", "'"));
        });

        const existing = await prisma.words.findFirst({
          where: {
            Spellings: {
              some: {
                spelling: {
                  in: wordExistsArr
                }
              }
            }
          }
        });
        // If word already exists, merge any new content into the existing word
        if (existing) {
          try {
            console.log(existing);
            return Response.json({ "nope": "Not gonna do it" });
            // const merged = mergeWords(existing, json);
            // const res = await words.findOneAndUpdate(
            //   {
            //     _id: merged._id,
            //   },
            //   {
            //     $set: {
            //       variants: merged.variants,
            //       definitions: formatDefinitions(merged.definitions, true),
            //       sourceId: merged.sourceId,
            //       notes: merged.notes || "",
            //       roots: merged.roots || [],
            //       lastModified: new Date(),
            //       part: merged.part,
            //       related: merged.related || [],
            //     },
            //   }
            // );
            // if (res._id) {
            //   revalidatePath(`/words/${res._id}`);
            //   return Response.json(
            //     {
            //       success: true,
            //       info: "The word already exists; new content was successfully merged into the existing word.",
            //       url: `/words/${res._id}`,
            //       id: res._id,
            //     },
            //     { status: 200 }
            //   );
            // } else {
            //   return Response.json(
            //     {
            //       success: false,
            //       error:
            //         "That word already exists and could not be automatically merged.",
            //       url: `/words/${existing._id}`,
            //     },
            //     { status: 409 }
            //   );
            // }
          } catch (err) {
            console.error(err);
            return Response.json(
              {
                success: false,
                error:
                  "That word already exists and could not be automatically merged.",
                url: `/words/${existing._id}`,
              },
              { status: 409 }
            );
          }
        }

        const res = await prisma.words.create({
          data: {
            source_id: json.source_id,
            notes: json.notes || "",
            last_modified: new Date(),
            part_of_speech: json.part_of_speech,
            Spellings: {
              create: json.Spellings.map(s => {
                return ({
                  spelling: (s.spelling[0].toLowerCase() + s.spelling.slice(1)).replaceAll("’", "'"),
                  is_primary: s.is_primary || false
                })
              })
            },
            Senses: {
              create: json.Senses.map(sense => ({
                translation: sense.translation,
                language: sense.language
              }))
            },
            Examples: json.Examples ? {
              create: json.Examples.map(ex => ({
                text_tz: ex.text_tz.replaceAll("’", "'"),
                text_es: ex.text_es,
                text_en: ex.text_en
              }))
            } : undefined
          }
        });
        if (!res) {
          return Response.json(
            {
              success: false,
              error: "Failed to insert word into DB",
            },
            {
              status: 400,
            }
          );
        } else {
          revalidatePath(`/words/${res.id}`);
          return Response.json(
            { success: true, id: res.id, url: `/words/${res.id}`, },
            {
              status: 201,
            }
          );
        }
      } catch (err) {
        console.error(err);
        return Response.json(
          {
            success: false,
            error: err,
          },
          {
            status: 500,
          }
        );
      }
    }
  } else {
    return Response.json(
      { success: false, reason: "Unauthorized" },
      {
        status: 401,
      }
    );
  }
}

// Update existing word
export async function PATCH(req) {
  const headersList = await headers();
  const password = headersList.get("x-pwd");
  if (password == process.env.ADMIN_PASSWORD) {
    const json = await req.json();

    if (!json || !json.id) {
      return Response.json(
        { success: false, reason: "Missing content or ID" },
        {
          status: 400,
        }
      );
    } else {
      try {
        let wordExistsArr = [];

        json.Spellings.forEach((s) => {
          wordExistsArr.push(s.spelling.replaceAll("'", "'"));
          wordExistsArr.push(s.spelling.toLowerCase().replaceAll("'", "'"));
          wordExistsArr.push((s.spelling[0].toUpperCase() + s.spelling.slice(1)).replaceAll("'", "'"));
        });

        const existing = await prisma.words.findFirst({
          where: {
            Spellings: {
              some: {
                spelling: {
                  in: wordExistsArr
                }
              }
            }
          }
        });
        if (existing.id != json.id) {
          return Response.json(
            {
              success: false,
              error: "This word already exists.",
              url: `/words/${existing._id}`,
            },
            { status: 423 }
          );
        }
        const sanitize = (s) => (typeof s === "string" ? s.replaceAll("’", "'") : s ?? null);
        const sanitizeSpelling = (s) => {
          if (!s) return null;
          const s0 = String(s);
          return s0.length > 0
            ? (s0[0].toLowerCase() + s0.slice(1)).replaceAll("’", "'")
            : s0.replaceAll("’", "'");
        };

        const spellingsToCreate = Array.isArray(json.Spellings)
          ? json.Spellings.map((s) => ({
            spelling: sanitizeSpelling(s.spelling),
            is_primary: !!s.is_primary,
          }))
          : [];

        const sensesToCreate = Array.isArray(json.Senses)
          ? json.Senses.map((sense) => ({
            translation: sense.translation ?? null,
            language: sense.language ?? null,
          }))
          : [];

        const examplesToCreate = Array.isArray(json.Examples)
          ? json.Examples.map((ex) => ({
            text_tz: sanitize(ex.text_tz),
            text_es: sanitize(ex.text_es),
            text_en: sanitize(ex.text_en)
          }))
          : [];
        const updated = await prisma.$transaction(async (tx) => {
          // Make sure word exists (if using mongoId fallback, you might want to upsert instead)
          // If you want strict update-only: throw if not found
          const existing = await tx.words.findUnique({ where: { id: json.id } });
          if (!existing) {
            throw new Error(`Word not found for identifier: ${json.id}`);
          }

          // Nested update with deleteMany + create is supported; do it in one update call.
          // This keeps the entire operation atomic for that word.
          const res = await tx.words.update({
            where: {
              id: json.id
            },
            data: {
              source_id: json.source_id ?? null,
              notes: json.notes ?? "",
              part_of_speech: json.part_of_speech ?? null,

              // Replace Spellings
              Spellings: {
                deleteMany: {}, // deletes all existing spellings for this word
                create: spellingsToCreate,
              },

              // Replace Senses
              Senses: {
                deleteMany: {},
                create: sensesToCreate,
              },

              // Replace Examples (word-scoped examples)
              Examples:
                examplesToCreate.length > 0
                  ? {
                    deleteMany: {},
                    create: examplesToCreate,
                  }
                  : {
                    deleteMany: {}, // still clear any old examples if none provided
                  },
            },

            // include children so caller gets newest shape back
            include: {
              Spellings: true,
              Senses: true,
              Examples: true,
              Sources: true,
            },
          });

          return res;
        });
        if (!updated) {
          return Response.json(
            { success: false, error: "Failed to update document" },
            {
              status: 400,
            }
          );
        } else {
          revalidatePath(`/words/${json.id}`);
          return Response.json({ success: true, word: updated });
        }
      } catch (err) {
        console.error(err);
        return Response.json(
          {
            success: false,
            error: err,
          },
          {
            status: 500,
          }
        );
      }
    }
  } else {
    return Response.json(
      { success: false, reason: "Unauthorized" },
      {
        status: 401,
      }
    );
  }
}

export async function DELETE(req) {
  const headersList = await headers();
  const password = headersList.get("x-pwd");
  if (password == process.env.ADMIN_PASSWORD) {
    const json = await req.json();

    if (!json || !json.id) {
      return Response.json(
        { success: false, reason: "Missing ID" },
        {
          status: 400,
        }
      );
    } else {
      await prisma.words.delete({
        where: {
          id: json.id
        }
      });
      return Response.json({ success: true });
    }
  } else {
    return Response(
      JSON.stringify({ success: false, reason: "Unauthorized" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
