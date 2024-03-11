const fastify = require('fastify')
const getUuid = require('uuid-by-string')
const OpenAI = require("openai")
const dotenv = require("dotenv")
const { AstraDB } = require("@datastax/astra-db-ts")

dotenv.config()

const app = fastify({
  logger: true,
})

const {
  ASTRA_DB_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env

const openai = new OpenAI()

const astraDb = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT)

// Declare a route
app.post('/api/openai', async function handler (request, reply) {
    const word = request.body.word
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: word,
      encoding_format: "float",
    })
    const vector = embedding.data[0]?.embedding
    const collection = await astraDb.collection("openai")
    const uuid = getUuid(word)
    await collection.updateOne(
      { _id: uuid },
      { $set: { text: word, $vector: vector } },
      { upsert: true }
    )
    return { word }
  })

app.post('/api/vectorize', async function handler (request, reply) {
    const word = request.body.word
    const collection = await astraDb.collection("vectorize")
    const uuid = getUuid(word)

    await collection.updateOne(
      { _id: uuid },
      { $set: { text: word, $vectorize: word } },
      { upsert: true }
    )
    return { word }
  })

export default async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
}