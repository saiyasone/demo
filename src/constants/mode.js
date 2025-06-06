import { useCallback, useState } from "react";

class MultilingualContentFilter {
  // Detect language based on Unicode ranges
  detectLanguage(text) {
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

    if (thaiRatio > 0.3) return "thai";
    if (laoRatio > 0.3) return "lao";
    if (englishRatio > 0.3) return "english";

    return "mixed";
  }

  // Normalize text for better matching (removes tone marks, diacritics)
  normalizeText(text, language) {
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
  containsInappropriateContent(text, language) {
    const wordsToCheck = this.inappropriateWords[language] || [];
    const normalizedText = this.normalizeText(text, language);

    return wordsToCheck.some((word) => {
      const normalizedWord = this.normalizeText(word, language);

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
  filter(text) {
    if (!text || text.trim().length === 0) {
      return {
        isClean: true,
        cleanText: text,
        detectedLanguage: "unknown",
        confidence: 1,
      };
    }

    const detectedLanguage = this.detectLanguage(text);
    const languagesToCheck =
      detectedLanguage === "mixed"
        ? ["thai", "lao", "english"]
        : [detectedLanguage];

    let isClean = true;
    let cleanText = text;

    // Check each relevant language
    for (const lang of languagesToCheck) {
      if (this.containsInappropriateContent(text, lang)) {
        isClean = false;

        // Replace inappropriate words with asterisks
        const wordsToReplace = this.inappropriateWords[lang] || [];
        wordsToReplace.forEach((word) => {
          const regex = new RegExp(word, "gi");
          cleanText = cleanText.replace(regex, "*".repeat(word.length));
        });
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
  addWords(language, words) {
    if (!this.inappropriateWords[language]) {
      this.inappropriateWords[language] = [];
    }
    this.inappropriateWords[language].push(...words);
  }

  // Remove words from filter
  removeWords(language, words) {
    if (this.inappropriateWords[language]) {
      this.inappropriateWords[language] = this.inappropriateWords[
        language
      ].filter((word) => !words.includes(word));
    }
  }
}

// React Hook for content filtering

export const useContentFilter = () => {
  const [filter] = useState(() => new MultilingualContentFilter());

  const filterContent = useCallback(
    (text) => {
      return filter.filter(text);
    },
    [filter]
  );

  const addCustomWords = useCallback(
    (language, words) => {
      filter.addWords(language, words);
    },
    [filter]
  );

  return {
    filterContent,
    addCustomWords,
    detectLanguage: filter.detectLanguage.bind(filter),
  };
};

// React Component Example

export const MultilingualMessageInput = ({
  onSendMessage,
  placeholder = "Type message... / ພິມຂໍ້ຄວາມ... / พิมพ์ข้อความ...",
}) => {
  const [message, setMessage] = useState("");
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
      setError(errorMessages[result.detectedLanguage] || errorMessages.unknown);
      return;
    }

    onSendMessage(result.cleanText);
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

export default MultilingualMessageInput;
