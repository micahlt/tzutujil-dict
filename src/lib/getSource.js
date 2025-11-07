import idCompat from "./idCompat";
import prisma from "./prisma";

export async function getSource(id) {
  if (!id) {
    return false;
  }

  let result = await prisma.sources.findUnique({ where: idCompat(id) });
  if (result != null) {
    return JSON.stringify(result);
  } else {
    return false;
  }
}
