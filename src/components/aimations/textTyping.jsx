import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TypingWithCursor = () => {
  return (
    <div className="flex items-center">
      <TypingText text="A place that makes me feel" speed={90} />
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="ml-1 text-lg font-mono"
      >
        |
      </motion.span>
    </div>
  );
};

const TypingText = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return <p className="text-lg font-mono">{displayedText}</p>;
};
