"use client";
import { useEffect, useRef, useState } from "react";
import { words } from "./_words/words";
import style from "./page.module.css";

export default function Home() {
  const [state, setState] = useState<string[]>([]);
  const countState = useRef<number>(0);
  const wordRef = useRef(null);
  const letterRef = useRef(null);

  useEffect(() => {
    while (countState.current != 200) {
      const randomInt = Math.floor(Math.random() * words.length - 1) + 0;
      setState((prev: string[]) => [...prev, words[randomInt]]);
      countState.current += 1;
    }
  }, []);

  return (
    <div className={style.homeContainer}>
      <div className={style.timeOption}>
        <div>30</div>
        <div>50</div>
        <div>60</div>
        <div>100</div>
      </div>
      <div className={style.wordsContainer}>
        {state.map((words, index) => (
          <div key={index} ref={wordRef}>
            {words?.split("").map((letters, index) => (
              <span ref={letterRef}>{letters}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
