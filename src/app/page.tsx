"use client";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { words } from "./_words/words";
import style from "./page.module.css";
import { GrPowerReset } from "react-icons/gr";
import "./word.css";

export default function Home() {
  const [state, setState] = useState<string[]>([]);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [time, setTime] = useState<number | undefined>();

  const countState = useRef<number>(0);

  const wordRef = useRef<(HTMLDivElement | null)[]>([]);

  const wordIndex = useRef<number>(0);
  const letterIndex = useRef<number>(0);
  const currentWordLength = useRef<number | undefined>(0);
  const extraTypeLetter = useRef<number>(0);

  const currentWordRef = useRef<HTMLDivElement | null>(null);

  const paragraphRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const mainParagraphRef = useRef<HTMLDivElement | null>(null);

  const updateCursorPosition = () => {
    const cursor = cursorRef.current;
    const paragraph = paragraphRef.current;
    const nextLetter = currentWordRef.current?.children[letterIndex.current];

    if (nextLetter && paragraph && cursor) {
      const rect = nextLetter.getBoundingClientRect();
      const containerRect = paragraph.getBoundingClientRect();

      const offsetLeft = rect.left - 2 - containerRect.left;
      const offsetTop = rect.top + 5 - containerRect.top;

      cursor.style.left = `${offsetLeft - 2}px`;
      cursor.style.top = `${offsetTop}px`;
    } else {
      const currentWord = currentWordRef.current;
      if (currentWord && currentWordLength.current && cursor && paragraph) {
        const lastLetter = currentWord.children[currentWordLength.current - 1];
        const rect = lastLetter.getBoundingClientRect();
        const containerRect = paragraph.getBoundingClientRect();

        const offsetLeft = rect.right - containerRect.left;
        const offsetTop = rect.top - containerRect.top;

        cursor.style.left = `${offsetLeft - 2}px`;
        cursor.style.top = `${offsetTop + 5}px`;
      }
    }
  };

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
        if (extraTypeLetter.current !== 0) {
          currentWordRef.current?.lastChild?.remove();
          extraTypeLetter.current -= 1;
          updateCursorPosition();
        } else {
          if (letterIndex.current == 0) return;
          letterIndex.current -= 1;
          currentWordRef.current?.children[
            letterIndex.current
          ]?.classList.remove("wrong");
          currentWordRef.current?.children[
            letterIndex.current
          ]?.classList.remove("right");
          updateCursorPosition();
        }
      }

      if (isSpace) {
        if (wordIndex.current === wordRef.current?.length) return;
        wordIndex.current += 1;
        letterIndex.current = 0;
        currentWordRef.current = wordRef.current[wordIndex.current];
        currentWordLength.current =
          wordRef.current[wordIndex.current]?.children.length;
        if (mainParagraphRef.current!.getBoundingClientRect().top > 216) {
          console.log(mainParagraphRef.current!.getBoundingClientRect());
          const margin = parseInt(mainParagraphRef.current!.style.top || "0px");
          mainParagraphRef.current!.style.top = margin - 60 + "px";
          updateCursorPosition();
        }
        updateCursorPosition();
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
              updateCursorPosition();
            } else {
              currentWordRef.current?.children[
                letterIndex.current
              ].classList.add("wrong");
              letterIndex.current += 1;
              updateCursorPosition();
            }
          } else {
            const span = document.createElement("span");
            span.innerHTML = e.key;
            span.style.color = "#9b2226";
            span.classList.add("extra");
            currentWordRef.current?.append(span);
            extraTypeLetter.current += 1;
            updateCursorPosition();
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
    updateCursorPosition();
  }, [state]);

  return (
    <div className={style.homeContainer}>
      <div className={style.timeOption}>
        <div
          onClick={() => setTime(30)}
          className={`${time == 30 && style.setTime}`}
        >
          30
        </div>
        <div
          onClick={() => setTime(50)}
          className={`${time == 50 && style.setTime}`}
        >
          50
        </div>
        <div
          onClick={() => setTime(60)}
          className={`${time == 60 && style.setTime}`}
        >
          60
        </div>
        <div
          onClick={() => setTime(100)}
          className={`${time == 100 && style.setTime}`}
        >
          100
        </div>
      </div>
      <div className={style.wordsMainContainer} ref={paragraphRef}>
        <div className={style.wordsContainer} ref={mainParagraphRef}>
          <div className={style.cursor} ref={cursorRef}></div>
          {state.map((words, index) => (
            <div
              key={index}
              ref={(e) => {
                wordRef.current[index] = e;
              }}
              tabIndex={0}
              className={style.word}
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
