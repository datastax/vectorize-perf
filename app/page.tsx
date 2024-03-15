"use client"

import { useRef, useState } from "react";
import { SCROLL_TEXT } from "@/utils/consts";
import Header from "@/components/Header";
import StarFighter from "@/components/StarFighter";
import Footer from "@/components/Footer";
import Timer from "@/components/Timer";


export type TypeOptions = "vectorize" | "openai";
interface StarFighterProps {
  word: string;
  type: TypeOptions;
  duration: number;
  position: number;
}

export default function Home() {
  const [ vectorizeTimer, setVectorizeTimer ] = useState<boolean>(false)
  const [ openaiTimer, setOpenaiTimer ] = useState<boolean>(false)
  const [ restartKey, setRestartKey ] = useState<number>(0)
  const [ starFighterWords, setStarFighterWords ] = useState<StarFighterProps[]>([])
  const abortControllerRef = useRef<AbortController | null>(null);

  const run = async (words: string[], version: TypeOptions, signal: AbortSignal) => {
    if (version === "vectorize") {
      setVectorizeTimer(true)
    } else if (version === "openai") {
      setOpenaiTimer(true)
    }

    for (const word of words) {
      const start = Date.now()

      try {
        const response = await fetch(`/api/${version}`, {
          method: "POST",
          body: JSON.stringify({ word }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
          signal,
        })
        const json = await response.json()

        const end = Date.now()
        const duration = end - start
        
        setStarFighterWords(prev => [...prev, {word: json.word, type: version, duration, position: Math.random() * 40}])
      } catch (error: Error | any) {
        if (error.name === 'AbortError') {
          break; // Exit the loop if the fetch was aborted
        } else {
          console.error("Fetch error:", error);
        }
      }
    }
    console.log("broken loop")
    if (version === "vectorize") {
      setVectorizeTimer(false)
    } else if (version === "openai") {
      setOpenaiTimer(false)
    }
  }
  const simultaneousCalls = async () => {
    abortControllerRef.current = new AbortController();
    const words = SCROLL_TEXT.split(/\s/).filter(w => w.length > 0)
    await Promise.all([
      run(words, "vectorize", abortControllerRef.current.signal),
      run(words, "openai", abortControllerRef.current.signal),
    ])
  }

  const onStart = () => {
    simultaneousCalls();
  }

  return (
    <>
      <Header
        onStart={onStart}
        onReset={() => {
          setStarFighterWords([]);
          setOpenaiTimer(false);
          setVectorizeTimer(false);
          setRestartKey(prev => prev + 1);
          abortControllerRef.current?.abort();
        }}
      />
      <main className="grow flex w-full max-w-full bg-vectorize-panel bg-contain bg-no-repeat bg-center h-full z-0">
        <div className="self-end flex justify-around items-center w-full pb-6">
          <Timer running={vectorizeTimer} type="vectorize" restartKey={restartKey} />
          <Timer running={openaiTimer} type="openai" restartKey={restartKey} />
        </div>
        {starFighterWords.map((fighter, index) => (
          <StarFighter
            key={`${fighter.word}-${fighter.type}-${index}`}
            word={fighter.word}
            type={fighter.type} duration={fighter.duration}
            position={fighter.position}
          />
        ))}
      </main>
      <Footer />
    </>
  );
}
