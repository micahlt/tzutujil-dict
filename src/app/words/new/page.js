"use server";
import NewClient from "./newClient";

export default async function NewWord() {
  return (
    <>
      <NewClient />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "New Word | TzDB",
    description:
      "Creating a new word on the world's largest, most comprehensive Tz'utujil dictionary and translator.",
  };
}
