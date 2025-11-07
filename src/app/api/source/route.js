import "dotenv/config";
require("dotenv").config();
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import idCompat from "@/lib/idCompat";

export async function GET(req) {
  // Create the connection to the database
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  const result = await prisma.sources.findUnique({ where: idCompat(id) });
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
  const headersList = await headers();
  const password = headersList.get("x-pwd");
  // Create the connection to the database
  if (password == process.env.ADMIN_PASSWORD) {
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
        const res = await prisma.sources.create({
          data: {
            name: json.name,
            description: json.description || "",
            url: json.url,
            author: json.author || "",
          }
        });
        if (!res) {
          return Response.json(
            { success: false, code: res.err },
            {
              status: 400,
            }
          );
        } else {
          return Response.json({ success: true, id: res.id });
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
  const headersList = await headers();
  const password = headersList.get("x-pwd");
  // Create the connection to the database
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
        const res = await prisma.sources.update({
          where: idCompat(json.id),
          data: {
            name: json.name,
            description: json.description || "",
            url: json.url,
            author: json.author || "",
          }
        });

        if (!res) {
          return Response.json(
            { success: false, reason: "Failed" },
            {
              status: 400,
            }
          );
        } else {
          return Response.json({ success: true, id: res.id });
        }
      } catch (err) {
        console.error(err);
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
  const headersList = await headers();
  const password = headersList.get("x-pwd");
  // Create the connection to the database
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
      await prisma.sources.delete({ where: idCompat(json.id) });
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