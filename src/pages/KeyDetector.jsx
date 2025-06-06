import React, { useState, useEffect } from "react";
import { useMemo } from "react";

const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes perfect, especially when typing fast.",
  "Typing speed is essential for programmers and writers.",
  "React is a popular JavaScript library for building UIs.",
  "Shortcuts and muscle memory can boost typing speed.",
  "A fast typing finger improves your productivity daily.",
];

const getRandomText = () => {
  const index = Math.floor(Math.random() * texts.length);
  return texts[index];
};

const KeyDetector = () => {
  const [input, setInput] = useState("");
  const [targetText, setTargetText] = useState(getRandomText());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const handleChange = (e) => {
    const value = e.target.value;

    // Start timer on first key press
    if (input.length === 0 && value.length === 1) {
      setStartTime(Date.now());
    }

    // End timer if done typing
    if (value === targetText) {
      setEndTime(Date.now());
    }

    setInput(value);
  };

  const restartGame = () => {
    setTargetText(getRandomText());
    setInput("");
    setStartTime(null);
    setEndTime(null);
  };

  const getWPM = () => {
    if (!startTime || !endTime) return 0;
    const minutes = (endTime - startTime) / 1000 / 60;
    const words = targetText.split(" ").length;
    return Math.round(words / minutes);
  };

  const getAccuracy = () => {
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === targetText[i]) correct++;
    }
    return ((correct / targetText.length) * 100).toFixed(1);
  };

  const renderColoredText = () => {
    return targetText.split("").map((char, i) => {
      let color = "gray";
      if (i < input.length) {
        color = input[i] === char ? "green" : "red";
      }
      return (
        <span key={i} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  const renderColoredText1 = useMemo(() => {
    return targetText.split("").map((char, i) => {
      let color = "gray";
      if (i < input.length) {
        color = input[i] === char ? "green" : "red";
      }
      return (
        <span key={i} style={{ color }}>
          {char}
        </span>
      );
    });
  }, [input, targetText]);

  return (
    <div
      style={{
        fontFamily: "monospace",
        maxWidth: 800,
        margin: "auto",
        padding: 20,
      }}
    >
      <h2>Fast Typing Finger Game</h2>

      <div className="flex items-center gap-3 w-full">
        <div
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
            lineHeight: "1.5",
            fontSize: 18,
          }}
          className="w-full"
        >
          {renderColoredText1}
        </div>
        <button
          className="px-2 py-2 bg-blue-500 text-white"
          onClick={restartGame}
        >
          reload
        </button>
      </div>

      <div className="">
        <textarea
          rows={5}
          style={{
            width: "100%",
            fontSize: 18,
            padding: "2px 7px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
          value={input}
          onChange={handleChange}
          placeholder="Start typing here..."
        />
      </div>
      {endTime && (
        <div style={{ marginTop: 20 }}>
          <p>✅ Completed!</p>
          <p>🕒 Time: {((endTime - startTime) / 1000).toFixed(2)}s</p>
          <p>⌨️ Speed: {getWPM()} WPM</p>
          <p>🎯 Accuracy: {getAccuracy()}%</p>
        </div>
      )}
    </div>
  );
};

export default KeyDetector;
