"use client";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { words } from "./_words/words";
import style from "./page.module.css";
import { GrPowerReset } from "react-icons/gr";
import "./word.css";

export default function Home() {
  const [state, setState] = useState<string[]>([]);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const countState = useRef<number>(0);

  const wordRef = useRef<(HTMLDivElement | null)[]>([]);

  const wordIndex = useRef<number>(0);
  const letterIndex = useRef<number>(0);
  const currentWordLength = useRef<number | undefined>(0);
  const extraTypeLetter = useRef<number>(0);

  const currentWordRef = useRef<HTMLDivElement | null>(null);

  const paragraphRef = useRef<HTMLDivElement | null>(null);

  const handleRestart = () => {
    countState.current = 0;
    setState([]);
    setGuessedLetters([]);
    wordIndex.current = 0;
    letterIndex.current = 0;
    paragraphRef.current?.classList.add("blink");
    setTimeout(() => {
      paragraphRef.current?.classList.remove("blink");
    }, 800);
  };

  useLayoutEffect(() => {
    while (countState.current != 200) {
      const randomInt = Math.floor(Math.random() * words.length - 1) + 0;
      setState((prev: string[]) => [...prev, words[randomInt]]);
      countState.current += 1;
    }
  }, [handleRestart]);

  useEffect(() => {
    const handleKeyBoardEvent = (e: KeyboardEvent) => {
      const isSpace = e.key === " ";
      const isBackspace = e.key == "Backspace";

      if (isBackspace) {
        if (extraTypeLetter.current > 0) {
          currentWordRef.current?.lastChild?.remove();
          extraTypeLetter.current -= 1;
        } else {
          if (letterIndex.current == 0) return;
          letterIndex.current -= 1;
          currentWordRef.current?.children[
            letterIndex.current
          ]?.classList.remove("wrong");
          currentWordRef.current?.children[
            letterIndex.current
          ]?.classList.remove("right");
        }
      }

      if (isSpace) {
        if (wordIndex.current === wordRef.current?.length) return;
        wordIndex.current += 1;
        letterIndex.current = 0;
        currentWordRef.current = wordRef.current[wordIndex.current];
        currentWordLength.current =
          wordRef.current[wordIndex.current]?.children.length;
      }

      if (e.key.match(/^[a-z]+$/) && !isBackspace) {
        setGuessedLetters((prev: string[]) => [...prev, e.key]);
        if (currentWordLength.current) {
          if (letterIndex.current < currentWordLength.current) {
            const rightLetter =
              currentWordRef.current?.children[letterIndex.current].innerHTML;
            if (e.key == rightLetter) {
              currentWordRef.current?.children[
                letterIndex.current
              ].classList.add("right");
              letterIndex.current += 1;
            } else {
              currentWordRef.current?.children[
                letterIndex.current
              ].classList.add("wrong");
              letterIndex.current += 1;
            }
          } else {
            const span = document.createElement("span");
            span.innerHTML = e.key;
            span.style.color = "#9b2226";
            span.classList.add("extra");
            currentWordRef.current?.append(span);
            extraTypeLetter.current += 1;
          }
        }
      }
    };

    document.addEventListener("keyup", handleKeyBoardEvent);

    return () => {
      document.removeEventListener("keyup", handleKeyBoardEvent);
    };
  }, []);

  useEffect(() => {
    currentWordRef.current = wordRef.current[wordIndex.current];
    currentWordLength.current =
      wordRef.current[wordIndex.current]?.children.length;
  }, [state]);

  return (
    <div className={style.homeContainer}>
      <div className={style.timeOption}>
        <div>30</div>
        <div>50</div>
        <div>60</div>
        <div>100</div>
      </div>
      <div className={style.wordsMainContainer} ref={paragraphRef}>
        <div className={style.wordsContainer}>
          {state.map((words, index) => (
            <div
              key={index}
              ref={(e) => {
                wordRef.current[index] = e;
              }}
              tabIndex={0}
            >
              {words?.split("").map((letters, letterIndex) => (
                <span key={letterIndex}>{letters}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={style.resetBtn} onClick={handleRestart}>
        <GrPowerReset />
      </div>
    </div>
  );
}
