import "dotenv/config";
require("dotenv").config();
import clientPromise from "@/lib/mongodb";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET(req) {
  // Create the connection to the database
  const client = await clientPromise;
  const db = client.db("tzdb");
  const sources = db.collection("sources");
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  const result = await sources.findOne({ _id: new ObjectId(id) });
  if (!!result) {
    return Response.json(result);
  } else {
    return Response.json(
      { error: "No source found with the provided ID" },
      { status: 404 }
    );
  }
}

export async function PUT(req) {
  const headersList = headers();
  const password = headersList.get("x-pwd");
  // Create the connection to the database
  if (password == process.env.ADMIN_PASSWORD) {
    const client = await clientPromise;
    const db = client.db("tzdb");
    const sources = db.collection("sources");

    const json = await req.json();

    if (!json) {
      return Response.json(
        { success: false, reason: "Missing content" },
        {
          status: 400,
        }
      );
    } else {
      Object.keys(json).forEach((key) => {
        json[key] = json[key].replaceAll("’", "'");
      });
      try {
        const res = await sources.insertOne({
          name: json.name,
          description: json.description || "",
          url: json.url,
        });
        if (!res.acknowledged) {
          return Response.json(
            { success: false, code: res.err },
            {
              status: 400,
            }
          );
        } else {
          return Response.json({ success: true, id: res.insertedId });
        }
      } catch (err) {
        console.error(err);
        return Response.json(
          { error: "Could not insert source into DB" },
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

export async function PATCH(req) {
  const headersList = headers();
  const password = headersList.get("x-pwd");
  // Create the connection to the database
  if (password == process.env.ADMIN_PASSWORD) {
    const client = await clientPromise;
    const db = client.db();
    const sources = db.collection("sources");

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
        const res = await sources.updateOne(
          { _id: json.id },
          {
            name: json.name,
            words: json.wordCount,
            description: json.description || "",
            url: json.url,
          }
        );

        if (!res.acknowledged) {
          return Response.json(
            { success: false, reason: err },
            {
              status: 400,
            }
          );
        } else {
          return Response.json({ success: true });
        }
      } catch (err) {
        return Response.json(
          { error: "Could not update source in DB" },
          {
            status: 500,
          }
        );
      }
    }
  } else {
    return Response(
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
  // Create the connection to the database
  if (password == process.env.ADMIN_PASSWORD) {
    const client = await clientPromise;
    const db = client.db();
    const sources = db.collection("sources");

    const json = await req.json();

    if (!json || !json.id) {
      return Response.json(
        { success: false, reason: "Missing ID" },
        {
          status: 400,
        }
      );
    } else {
      await sources.deleteOne({ _id: json.id });
      return Response.json({ success: true });
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
