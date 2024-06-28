import "dotenv/config";
require("dotenv").config();

import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import "@/lib/types";
import mergeWords from "@/lib/mergeWords";
import formatDefinitions from "@/lib/formatDefinitions";

// Get a word by its ID or primary spelling variant
export async function GET(req) {
  const client = await clientPromise;
  const words = client.db("tzdb").collection("words");
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
  try {
    if (id) {
      ObjectId.createFromHexString(id);
    }
  } catch (err) {
    return Response.json(
      {
        success: false,
        reason: "Improper ID format",
      },
      {
        status: 400,
      }
    );
  }

  let result;
  if (id) {
    result = await words.findOne({ _id: ObjectId.createFromHexString(id) });
  } else if (tzWord) {
    result = await words.findOne({ "variants.0": tzWord });
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
  const headersList = headers();
  const password = headersList.get("x-pwd");
  if (password == process.env.ADMIN_PASSWORD) {
    const client = await clientPromise;
    const words = client.db("tzdb").collection("words");

    /** @type {Word} */
    const json = await req.json();

    if (!json || !json?.variants || !json?.definitions || !json?.sourceId) {
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
        const regex = json.variants.map((v) => new RegExp(`^${v}$`, "i"));
        const existing = await words.findOne({
          variants: { $in: regex },
        });
        // If word already exists, merge any new content into the existing word
        if (existing) {
          try {
            const merged = mergeWords(existing, json);
            const res = await words.findOneAndUpdate(
              {
                _id: merged._id,
              },
              {
                $set: {
                  variants: merged.variants,
                  definitions: formatDefinitions(merged.definitions, true),
                  sourceId: merged.sourceId,
                  notes: merged.notes || "",
                  roots: merged.roots || [],
                  lastModified: new Date(),
                  part: merged.part,
                  related: merged.related || [],
                },
              }
            );
            if (res._id) {
              return Response.json(
                {
                  success: true,
                  info: "The word already exists; new content was successfully merged into the existing word.",
                  url: `/words/${res._id}`,
                  id: res._id,
                },
                { status: 200 }
              );
            } else {
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
        json.variants = json.variants.map(
          (v) => v[0].toLowerCase() + v.slice(1)
        );
        const res = await words.insertOne({
          variants: json.variants,
          definitions: formatDefinitions(json.definitions, true),
          sourceId: json.sourceId,
          notes: json.notes || "",
          roots: json.roots || [],
          lastModified: new Date(),
          part: json.part,
          related: json.related || [],
        });
        if (!res.acknowledged) {
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
          return Response.json(
            { success: true, id: res.insertedId },
            {
              status: 201,
            }
          );
        }
      } catch (err) {
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
  const headersList = headers();
  const password = headersList.get("x-pwd");
  if (password == process.env.ADMIN_PASSWORD) {
    const client = await clientPromise;
    const words = client.db("tzdb").collection("words");

    const json = await req.json();

    if (!json || !json._id) {
      return Response.json(
        { success: false, reason: "Missing content or ID" },
        {
          status: 400,
        }
      );
    } else {
      try {
        const regex = json.variants.map((v) => new RegExp(`^${v}$`, "i"));
        const existing = await words.findOne({
          variants: { $in: regex },
        });
        if (existing._id != json._id) {
          return Response.json(
            {
              success: false,
              error: "This word already exists.",
              url: `/words/${existing._id}`,
            },
            { status: 423 }
          );
        }
        json.variants = json.variants.map(
          (v) => v[0].toLowerCase() + v.slice(1)
        );
        const res = await words.findOneAndUpdate(
          {
            _id: ObjectId.createFromHexString(json._id),
          },
          {
            $set: {
              variants: json.variants,
              definitions: formatDefinitions(json.definitions),
              sourceId: json.sourceId,
              notes: json.notes || "",
              roots: json.roots || [],
              lastModified: new Date(),
              part: json.part,
              related: json.related || [],
            },
          }
        );
        if (!res) {
          return Response.json(
            { success: false, error: "Failed to update document" },
            {
              status: 400,
            }
          );
        } else {
          revalidatePath(`/words/${json._id}`);
          return Response.json({ success: true, word: res });
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
  const headersList = headers();
  const password = headersList.get("x-pwd");
  if (password == process.env.ADMIN_PASSWORD) {
    const client = await clientPromise;
    const words = client.db("tzdb").collection("words");

    const json = await req.json();

    if (!json || !json.id) {
      return Response.json(
        { success: false, reason: "Missing ID" },
        {
          status: 400,
        }
      );
    } else {
      await words.deleteOne({ _id: ObjectId.createFromHexString(json.id) });
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
