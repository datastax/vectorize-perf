"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Gauge from "@/components/Gauge";
import { SCROLL_TEXT } from "@/utils/consts";
import Header from "@/components/Header";
import StarFighter from "@/components/StarFighter";
import Footer from "@/components/Footer";


type TypeOptions = "vectorize" | "openai";
interface StarFighterProps {
  word: string;
  type: TypeOptions;
  duration: number;
  position: number;
}

export default function Home() {
  const [ vectorizeValue, setVectorizeValue ] = useState(0)
  const [ openaiValue, setOpenaiValue ] = useState(0)
  const [ starFighterWords, setStarFighterWords ] = useState<StarFighterProps[]>([])

  const durations: number[] = []

  const calcSpeed = (duration: number) => {
    const values = durations
    const min = Math.min(...values)
    return (min / duration) * 100
}

  const run = async (words: string[], version: TypeOptions) => {
    words.forEach(async word => {
      const start = Date.now()

      const response = await fetch(`/api/${version}`, {
          method: "POST",
          body: JSON.stringify({ word }),
          headers: { "Content-type": "application/json; charset=UTF-8" }
      })
      const json = await response.json()
      const end = Date.now()
      const duration = end - start

      durations.push(duration)

      if (version === "vectorize") {
          setVectorizeValue(calcSpeed(duration))
      } else if (version === "openai") {
          setOpenaiValue(calcSpeed(duration))
      }
      
      setStarFighterWords(prev => [...prev, {word: json.word, type: version, duration, position: Math.random() * 40}])
    })
  }
  const simultaneousCalls = async () => {
    const words = SCROLL_TEXT.split(/\s/).filter(w => w.length > 0)
    await Promise.all([
      run(words, "vectorize"),
      run(words, "openai"),
    ])
  } 

  useEffect(() => {
    simultaneousCalls();
  }, []);

  return (
    <>
      <Header />
      <main id="container" className="grow">
        <div id="vectorize" className="pane">
            <div className="gauge-container">
                {/* <Gauge name="gauge-vectorize" gaugeValue={vectorizeValue} /> */}
            </div>
        </div>
        <div id="openai" className="pane">
            <div className="gauge-container">
                {/* <Gauge name="gauge-openai" gaugeValue={openaiValue} /> */}
            </div>
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
