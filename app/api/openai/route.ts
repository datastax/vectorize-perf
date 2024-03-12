import { AstraDB } from "@datastax/astra-db-ts";
import getUuid from "uuid-by-string";
import OpenAI from "openai";
import { NextResponse } from "next/server";

const {
  ASTRA_DB_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY
} = process.env

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const astraDb = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT)

export async function POST(req: Request) {
  const { word } = await req.json();

  const collection = await astraDb.collection("openai")
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: word,
    encoding_format: "float",
  })
  const uuid = getUuid(word)
  try {
    const vector = embedding.data[0]?.embedding
  
    await collection.updateOne(
      { _id: uuid },
      { $set: { text: word, $vector: vector } },
      { upsert: true }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 });
  }
  
  return NextResponse.json({ word }, { status: 200 });
};