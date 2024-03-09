const fastify = require('fastify')({logger: true})
const path = require('node:path')

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public')
})

// Declare a route
fastify.post('/api/openai', async function handler (request, reply) {
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const word = request.body.word
    console.log(word)
    await sleep(5000)
    return { word }
  })

  fastify.post('/api/vectorize', async function handler (request, reply) {
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const word = request.body.word
    console.log(word)
    await sleep(2000)
    return { word }
  })

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    // Server is now listening on ${address}
  })