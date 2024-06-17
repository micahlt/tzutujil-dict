import "dotenv/config";
require("dotenv").config();

import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

// Get a word by its ID or primary spelling variant
export async function GET(req) {
  const client = await clientPromise;
  const words = client.db("tzdb").collection("words");
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const tzWord = searchParams.get("tzWord");

  if (!id && !tzWord) {
    return new Response.json(
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
    result = await words.findOne({ _id: new ObjectId(id) });
  } else if (tzWord) {
    result = await words.findOne({ "variants.0": tzWord });
  }

  if (result == null) {
    return Response.json(result);
  }
}

// Add a new word to the database
export async function PUT(req) {
  const headersList = headers();
  const password = headersList.get("x-pwd");
  if (password == process.env.ADMIN_PASSWORD) {
    const client = await clientPromise;
    const words = client.db("tzdb").collection("words");

    const json = await req.json();

    if (!json || !json?.variants || !json?.definitions || !json?.sourceId) {
      return new Response.json(
        { success: false, reason: "Missing content" },
        {
          status: 400,
        }
      );
    } else {
      try {
        const res = await words.insertOne({
          variants: json.variants,
          definitions: json.definitions,
          sourceId: json.sourceId,
          notes: json.notes || "",
          examples: json.examples || [],
          lastModified: new Date(),
        });
        if (!res.acknowledged) {
          return new Response.json(
            {
              success: false,
              error: "Failed to insert word into DB",
            },
            {
              status: 400,
            }
          );
        } else {
          return Response.json({ success: true, id: res.insertId });
        }
      } catch (err) {
        return new Response.json(
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
    return new Response.json(
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
  const searchParams = req.nextUrl.searchParams;
  const password = headersList.get("x-pwd");
  if (password == process.env.ADMIN_PASSWORD) {
    const client = await clientPromise;
    const words = client.db("tzdb").collection("words");

    const tzWord = searchParams.get("tzWord");

    const json = await req.json();

    if (!json || (!json.id && !tzWord)) {
      return new Response.json(
        { success: false, reason: "Missing content or ID" },
        {
          status: 400,
        }
      );
    } else {
      try {
        const filter = json?.id
          ? {
              _id: new ObjectId(json.id),
            }
          : {
              "variants.0": tzWord,
            };
        const res = await words.findOneAndUpdate(filter, {
          $set: {
            variants: json.variants,
            definitions: json.definitions,
            sourceId: json.sourceId,
            notes: json.notes || "",
            examples: json.examples || [],
            lastModified: new Date(),
          },
        });
        if (!res) {
          return new Response.json(
            { success: false, error: "Failed to update document" },
            {
              status: 400,
            }
          );
        } else {
          revalidatePath(`/words/${json.id}`);
          return Response.json({ success: true, word: res });
        }
      } catch (err) {
        console.error(err);
        return new Response.json(
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
    return new Response.json(
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
      await words.deleteOne({ _id: new ObjectId(json.id) });
      return Response.json({ success: true });
    }
  } else {
    return new Response(
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
