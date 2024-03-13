import 'dotenv/config';

const {
    ASTRA_DB_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
} = process.env

async function create() {
    console.log("Creating the Vectorize collection")
    let response = await fetch(`${ ASTRA_DB_ENDPOINT }/api/json/v1/default_keyspace`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': ASTRA_DB_APPLICATION_TOKEN
        } as HeadersInit,
        body: JSON.stringify({
            createCollection: { 
                name: "vectorize",
                options: { 
                    vector: {
                        metric: "cosine",
                        dimension: 1024,
                        service: {
                            provider: "nvidia",
                            modelName: "NV-Embed-QA"
                        }
                    } 
                } 
            } 
        })
    })
    let json = await response.json()
    console.log(json)
    console.log("Creating the OpenAI collection")
    response = await fetch(`${ ASTRA_DB_ENDPOINT }/api/json/v1/default_keyspace`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': ASTRA_DB_APPLICATION_TOKEN
        } as HeadersInit,
        body: JSON.stringify({
            createCollection: { 
                name: "openai",
                options: { 
                    vector: {
                        size: 1536 
                    } 
                } 
            } 
        })
    })
    json = await response.json()
    console.log(json)
}

create()

