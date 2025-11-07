import prisma from "@/lib/prisma";
import { sortDirections } from "@/lib/sort";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const limit = searchParams.get("limit") || 50;
  const offset = searchParams.get("offset");
  const type = searchParams.get("type") == "sources" ? "sources" : "words";
  const sortBy = searchParams.get("sortBy") || "lastModified";
  const sortDir = searchParams.get("sortDir") || sortDirections.DESC;
  const partOfSpeech = searchParams.get("part") || false;
  const source = searchParams.get("source") || false;

  let filterObj = {}, sortObj = {};
  sortObj[sortBy] = sortDir;
  if (partOfSpeech) {
    filterObj.part_of_speech = partOfSpeech;
  }
  if (source) {
    filterObj.source_id = source;
  }

  if (type == "sources") {
    const results = await prisma.sources.findMany();
    return Response.json(results);
  } else if (type == "words") {
    const results = await prisma.words.findMany({
      where: filterObj,
      orderBy: sortObj,
      skip: Number(offset),
      take: Number(limit),
      include: {
        Spellings: true,
        Senses: true
      }
    });
    return Response.json(results);
  }
}
