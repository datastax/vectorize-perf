# Vectorize Perf Demo

You can find a live version of this performance demo at: https://vectorize-perf.vercel.app

## Description

This repo contains a simple perf demo that shows developers the benefits of using DataStax Astra DB Vectorize to ingest and compute embeddings in a single API call.

The demo is based on the [opening crawl](https://starwars.fandom.com/wiki/Opening_crawl) text from Star Wars:

```
It is a period of civil war.
Rebel spaceships, striking
from a hidden base, have won
their first victory against
the evil Galactic Empire.

During the battle, Rebel
spies managed to steal secret
plans to the Empire's
ultimate weapon, the DEATH
STAR, an armored space
station with enough power to
destroy an entire planet.

Pursued by the Empire's
sinister agents, Princess
Leia races home aboard her
starship, custodian of the
stolen plans that can save
her people and restore
freedom to the galaxy....
```

The demo takes this text and breaks it up into an array of words. This array is passed into two processes that run concurrently. All words in each process are handled one at a time.

### Process 1 - without Vectorize

For each word, two API calls are made on the back end. The first is to OpenAI to compute the embedding for the word. The second is to store the word and the vector in Astra DB. You can find this code in: `app/api/openai/route.ts`

### Process 2 - with Vectorize

For each word, a single API call is made to DataStax Data API where both the computation of the embedding and the storage in Astra DB are handled by the service. You can find this code in: `app/api/vectorize/route.ts`

## Vectorize Developer Preview

Vectorize is will be available as a Developer Preview soon. Stay tuned to [datastax.com](https://www.datastax.com) for more information.
