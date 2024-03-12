import { AstraDB } from "@datastax/astra-db-ts";
import getUuid from "uuid-by-string";
import { NextResponse } from "next/server";

const {
  ASTRA_DB_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env

const astraDb = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT)

export async function POST(req: Request) {
  const { word } = await req.json()
  const collection = await astraDb.collection("vectorize")
  const uuid = getUuid(word)

  try {
    await collection.updateOne(
      { _id: uuid },
      { $set: { text: word, $vectorize: word } },
      { upsert: true }
    )
  } catch (error) {
    console.error("Error updating document: ", error)
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ word }, { status: 200 });
}
