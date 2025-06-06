import React, { useCallback, useEffect, useState } from "react";
import { Filter } from "bad-words";
import { inappropriateWords } from "../constants/bad-language";
import * as nsfwjs from "nsfwjs";
import ImageIcon from "../assets/images/no-use.jpg";

function detectLanguage(text) {
  const thaiPattern = /[\u0E00-\u0E7F]/;
  const laoPattern = /[\u0E80-\u0EFF]/;
  const englishPattern = /[a-zA-Z]/;

  const thaiMatches = (text.match(thaiPattern) || []).length;
  const laoMatches = (text.match(laoPattern) || []).length;
  const englishMatches = (text.match(englishPattern) || []).length;

  const total = thaiMatches + laoMatches + englishMatches;

  if (total === 0) return "unknown";

  const thaiRatio = thaiMatches / total;
  const laoRatio = laoMatches / total;
  const englishRatio = englishMatches / total;

  if (thaiRatio > 0.3) {
    return "thai";
  }
  if (laoRatio > 0.3) {
    return "lao";
  }
  if (englishRatio > 0.3) {
    return "english";
  }

  return "mixed";
}

// Normalize text for better matching (removes tone marks, diacritics)
function normalizeText(text, language) {
  let normalized = text.normalize("NFD").toLowerCase();

  switch (language) {
    case "thai":
      // Remove Thai tone marks and vowel signs
      normalized = normalized
        .replace(/[\u0E48-\u0E4B]/g, "") // Tone marks
        .replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, ""); // Vowels and signs
      break;

    case "lao":
      // Remove Lao tone marks and vowel signs
      normalized = normalized
        .replace(/[\u0EC8-\u0ECB]/g, "") // Tone marks
        .replace(/[\u0EB1\u0EB4-\u0EBC]/g, ""); // Vowels and signs
      break;
  }

  return normalized;
}

// Check for inappropriate content with fuzzy matching
function containsInappropriateContent(text, language) {
  const wordsToCheck = inappropriateWords[language] || [];
  const normalizedText = normalizeText(text, language);

  return wordsToCheck.some((word) => {
    const normalizedWord = normalizeText(word, language);

    // Exact match
    if (normalizedText.includes(normalizedWord)) {
      return true;
    }

    // Fuzzy matching for character substitution attempts
    const fuzzyPattern = normalizedWord
      .split("")
      .map((char) => `${char}[\\u0020-\\u007E\\u0E00-\\u0EFF]*?`) // Allow any ASCII or Thai/Lao chars between
      .join("");

    const regex = new RegExp(fuzzyPattern, "i");
    return regex.test(normalizedText);
  });
}

// Main filtering function
function filter(text) {
  const filterBad = new Filter();
  if (!text || text.trim().length === 0) {
    return {
      isClean: true,
      cleanText: text,
      detectedLanguage: "unknown",
      confidence: 1,
    };
  }

  const detectedLanguage = detectLanguage(text);
  const languagesToCheck =
    detectedLanguage === "mixed"
      ? ["thai", "lao", "english"]
      : [detectedLanguage];

  let isClean = true;
  let cleanText = text;

  if (detectedLanguage === "english") {
    isClean = false;
    cleanText = filterBad.clean(text);
  } else {
    // Check each relevant language
    for (const lang of languagesToCheck) {
      const wordsToReplace = inappropriateWords[lang] || [];

      if (containsInappropriateContent(text, lang)) {
        isClean = false;
        // Replace inappropriate words with asterisks
        wordsToReplace.forEach((word) => {
          const regex = new RegExp(word, "gi");
          cleanText = cleanText.replace(regex, "*".repeat(word.length));
        });
        // if (lang === "english") {
        //   cleanText = filterBad.clean(text);
        //   console.log({ cleanText });
        // } else {
        //   // Replace inappropriate words with asterisks
        //   wordsToReplace.forEach((word) => {
        //     const regex = new RegExp(word, "gi");
        //     cleanText = cleanText.replace(regex, "*".repeat(word.length));
        //   });
        // }
      } else {
        // cleanText = filterBad.clean(text);
      }
    }
  }

  return {
    isClean,
    cleanText,
    detectedLanguage,
    confidence: detectedLanguage === "unknown" ? 0.5 : 0.9,
  };
}

// Add new inappropriate words
function addWords(language, words) {
  if (!inappropriateWords[language]) {
    inappropriateWords[language] = [];
  }
  inappropriateWords[language].push(...words);
}

// React Hook for content filtering

export const useContentFilter = () => {
  const filterContent = useCallback((text) => {
    return filter(text);
  }, []);

  const addCustomWords = useCallback((language, words) => {
    addWords(language, words);
  }, []);

  return {
    filterContent,
    addCustomWords,
    detectLanguage: detectLanguage.bind(filter),
  };
};

// React Component Example

const MultilingualMessageInput = ({
  onSendMessage,
  placeholder = "Type message... / ພິມຂໍ້ຄວາມ... / พิมพ์ข้อความ...",
}) => {
  const [message, setMessage] = useState("sex");
  const [error, setError] = useState("");
  const [detectedLang, setDetectedLang] = useState("");

  const { filterContent, detectLanguage } = useContentFilter();

  const errorMessages = {
    thai: "ข้อความมีเนื้อหาที่ไม่เหมาะสม กรุณาแก้ไขก่อนส่ง",
    lao: "ຂໍ້ຄວາມມີເນື້ອຫາທີ່ບໍ່ເໝາະສົມ ກະລຸນາແກ້ໄຂກ່ອນສົ່ງ",
    english:
      "Message contains inappropriate content. Please modify before sending.",
    mixed:
      "Message contains inappropriate content. Please modify before sending.",
    unknown:
      "Message contains inappropriate content. Please modify before sending.",
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim()) {
      const lang = detectLanguage(value);
      setDetectedLang(lang);
    } else {
      setDetectedLang("");
    }

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    const result = filterContent(message);
    if (!result.isClean) {
      console.log({ result });
      setError(errorMessages[result.detectedLanguage] || errorMessages.unknown);
      return;
    }

    onSendMessage(result);
    setMessage("");
    setError("");
    setDetectedLang("");
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`message-input ${error ? "error" : ""}`}
          />
          <button type="submit" disabled={!message.trim()}>
            Send / ສົ່ງ / ส่ง
          </button>
        </div>

        {detectedLang && (
          <small className="language-indicator">
            Language detected: {detectedLang}
          </small>
        )}

        {error && <div className="error-message">{error}</div>}
      </form>

      <style jsx>{`
        .message-input-container {
          width: 100%;
          max-width: 600px;
        }

        .input-group {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .message-input {
          flex: 1;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s;
        }

        .message-input:focus {
          border-color: #007bff;
        }

        .message-input.error {
          border-color: #dc3545;
        }

        button {
          padding: 12px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        button:hover:not(:disabled) {
          background: #0056b3;
        }

        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .language-indicator {
          color: #666;
          font-size: 12px;
        }

        .error-message {
          color: #dc3545;
          font-size: 14px;
          margin-top: 4px;
          padding: 8px;
          background: #f8d7da;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

const Model = () => {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isBlured, setIsBlured] = useState(true);

  const handleOn = (message) => {
    console.log(message);
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await nsfwjs.load();
        setModel(loadedModel);
      } catch (error) {
        console.error("Failed to load NSFWJS model:", error);
      }
    };
    loadModel();
  }, []);

  const analyzeImage = async () => {
    if (!model) return null;

    const img = new Image();
    img.src = ImageIcon;
    return new Promise((resolve) => {
      img.onload = async () => {
        const data = await model.classify(img);
        setPredictions(data);
        resolve(data);
      };
    });
  };

  const checkIfShouldBlur = (predictions) => {
    const thresholds = {
      Porn: 0.3,
      Hentai: 0.3,
      // Sexy: 0.5,
    };

    return predictions.some((prediction) => {
      const threshold = thresholds[prediction.className];
      return threshold && prediction.probability > threshold;
    });
  };

  useEffect(() => {
    analyzeImage();
  }, [model]);

  useEffect(() => {
    if (predictions && predictions.length > 0) {
      const blured = checkIfShouldBlur(predictions);
      setIsBlured(blured);
    }
  }, [predictions]);

  return (
    <React.Fragment>
      <div className="" style={{ margin: "1rem" }}>
        <img
          src={ImageIcon}
          width={200}
          height={200}
          alt="demo-img"
          style={{
            filter: isBlured ? "blur(0.8rem)" : "inherit",
            borderRadius: "6px",
          }}
        />
      </div>
      <MultilingualMessageInput onSendMessage={handleOn} />
    </React.Fragment>
  );
};

export default Model;
