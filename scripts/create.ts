import 'dotenv/config';

const {
    ASTRA_DB_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
} = process.env

async function create() {
    console.log(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT)
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
                        size: 1024 
                    }, 
                    vectorize: { 
                        service: "nvidia", 
                        options: { 
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

