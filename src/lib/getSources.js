import prisma from "./prisma";

export async function getSources() {

  let result = await prisma.sources.findMany();

  if (result != null) {
    return result;
  } else {
    return false;
  }
}
