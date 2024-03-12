"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Gauge from "@/components/Gauge";
import { SCROLL_TEXT } from "@/utils/consts";

export default function Home() {
  const [ vectorizeValue, setVectorizeValue ] = useState(0)
  const [ openaiValue, setOpenaiValue ] = useState(0)

  const durations: number[] = []

  const showWord = (word: string, version: string, duration: number) => {
    const drop = document.createElement("div");
    drop.classList.add("drop")
    drop.classList.add("word")
    drop.classList.add(version)
    drop.style.left = (version === "vectorize" ? 0 : 50) + Math.random() * 40 + "%";
    drop.style.animationDuration = (duration * 10) + "ms"
    drop.innerText = word
    document.getElementById(version)?.appendChild(drop)
  }

  const calcSpeed = (duration: number) => {
    const values = durations
    const min = Math.min(...values)
    return (min / duration) * 100
}

  const run = async (words: string[], version: string) => {
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
      showWord(json.word, version, duration)               
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
    <div id="container">
      <div id="vectorize" className="pane">
          <div>
              <img src="/nvidia.svg" height="50px"/>
          </div>
          <div className="gauge-container">
              <Gauge name="gauge-vectorize" gaugeValue={vectorizeValue} />
          </div>
      </div>
      <div id="openai" className="pane">
          <div>
              <img src="/openai.svg" height="50px"/>
          </div>
          <div className="gauge-container">
              <Gauge name="gauge-openai" gaugeValue={openaiValue} />
          </div>
      </div>
  </div>
  );
}
