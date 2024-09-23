"use client";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { words } from "./_words/words";
import style from "./page.module.css";
import { GrPowerReset } from "react-icons/gr";
import "./word.css";

export default function Home() {
  const [state, setState] = useState<string[]>([]);
  const [time, setTime] = useState<number>(30);
  const timeRef = useRef<number>(time);
  const [isTyping, setIsTyping] = useState<Boolean>(false);
  const timmerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | undefined>();

  const wordsAddcountState = useRef<number>(0);

  const wordRef = useRef<(HTMLDivElement | null)[]>([]);

  const wordIndex = useRef<number>(0);
  const letterIndex = useRef<number>(0);
  const currentWordLength = useRef<number | undefined>(0);
  const extraTypeLetter = useRef<number>(0);

  const currentWordRef = useRef<HTMLDivElement | null>(null);

  const paragraphRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const mainParagraphRef = useRef<HTMLDivElement | null>(null);

  window.gameStart = null;

  const getWPS = () => {
    const lastTypedWordIndex = wordIndex.current;
    const typedWords = wordRef.current.slice(0, lastTypedWordIndex);
    const currectWords = typedWords.filter((word) => {
      let rightLetters = 0;
      let wrongLetters = 0;
      for (let i = 0; i < word!.children.length; i++) {
        if (word?.children[i].classList.contains("right")) {
          rightLetters += 1;
        } else if (word?.children[i].classList.contains("wrong")) {
          wrongLetters += 1;
        }
      }
      return wrongLetters === 0 && rightLetters === word?.children.length;
    });
    const calculateTime = timeRef.current * 1000;
    return (currectWords.length / calculateTime) * 60000;
  };

  const updateCursorPosition = () => {
    const cursor = cursorRef.current;
    const mainParagraph = mainParagraphRef.current;
    const nextLetter = currentWordRef.current?.children[letterIndex.current];

    if (nextLetter && mainParagraph && cursor) {
      const rect = nextLetter.getBoundingClientRect();
      const containerRect = mainParagraph.getBoundingClientRect();

      const offsetLeft = rect.left - containerRect.left;
      const offsetTop = rect.top - containerRect.top;

      cursor.style.left = `${offsetLeft - 2}px`;
      cursor.style.top = `${offsetTop + 5}px`;
      cursor.style.transition = ".2s";
    } else {
      const currentWord = currentWordRef.current;
      if (currentWord && currentWordLength.current && cursor && mainParagraph) {
        const lastLetter = currentWord.children[currentWordLength.current - 1];
        const rect = lastLetter.getBoundingClientRect();
        const containerRect = mainParagraph.getBoundingClientRect();

        const offsetLeft = rect.right - containerRect.left;
        const offsetTop = rect.top - containerRect.top;

        cursor.style.left = `${offsetLeft - 2}px`;
        cursor.style.top = `${offsetTop + 5}px`;
        cursor.style.transition = ".2s";
      }
    }
  };

  const handleRestart = async () => {
    wordsAddcountState.current = 0;
    setState([]);
    setIsTyping(false);
    wordIndex.current = 0;
    letterIndex.current = 0;
    await clearInterval(intervalRef.current);
    intervalRef.current = undefined;
    window.gameStart = null;
    paragraphRef.current?.classList.add("blink");
    await updateCursorPosition();
    mainParagraphRef.current!.style.top = "0px";
    paragraphRef.current?.classList.remove("over");
    mainParagraphRef.current?.classList.remove("gameover");
    cursorRef.current?.classList.remove("hide");
    await setTimeout(() => {
      paragraphRef.current?.classList.remove("blink");
    }, 800);
  };

  const handleGameOver = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = undefined;
    paragraphRef.current?.classList.add("over");
    mainParagraphRef.current?.classList.add("gameover");
    cursorRef.current?.classList.add("hide");
    timmerRef.current!.innerHTML = getWPS() + " Wpm";
    return;
  };

  const generateParagraph = () => {
    while (wordsAddcountState.current != 200) {
      const randomInt = Math.floor(Math.random() * words.length - 1) + 0;
      setState((prev: string[]) => [...prev, words[randomInt]]);
      wordsAddcountState.current += 1;
    }
  };

  useLayoutEffect(() => {
    generateParagraph();
    if (state.length === 200) {
      updateCursorPosition();
    }
  }, [handleRestart]);

  useEffect(() => {
    const handleKeyBoardEvent = (e: KeyboardEvent) => {
      const isSpace = e.key === " ";
      const isBackspace = e.key == "Backspace";
      const isLetter = e.key.match(/^[a-z]+$/) && !isBackspace;

      if (paragraphRef.current?.classList.contains("over")) {
        return;
      }

      updateCursorPosition();

      if (!intervalRef.current && isLetter) {
        intervalRef.current = setInterval(() => {
          if (!window.gameStart) {
            window.gameStart = new Date().getTime();
          }
          const currentTime = new Date().getTime();
          const msPassed = currentTime - window.gameStart;
          const sPassed = Math.floor(msPassed / 1000);
          const sLeft = (timeRef.current * 1000) / 1000 - sPassed - 1;
          timmerRef.current!.innerHTML = sLeft + "";
          if (sLeft == 0) {
            handleGameOver();
            return;
          }
        }, 1000);
      }

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

      if (isSpace && letterIndex.current != 0) {
        if (wordIndex.current === wordRef.current?.length) return;
        wordIndex.current += 1;
        letterIndex.current = 0;
        extraTypeLetter.current = 0;
        currentWordRef.current = wordRef.current[wordIndex.current];
        currentWordLength.current =
          wordRef.current[wordIndex.current]?.children.length;
        if (currentWordRef.current!.getBoundingClientRect().top > 300) {
          const margin = parseInt(mainParagraphRef.current!.style.top || "0px");
          mainParagraphRef.current!.style.top = margin - 60 + "px";
        }
        updateCursorPosition();
      }

      if (isLetter) {
        setIsTyping(true);
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

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  return (
    <div className={style.homeContainer}>
      {!isTyping ? (
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
      ) : (
        <div className={style.timmer} ref={timmerRef}>
          {time}
        </div>
      )}
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
