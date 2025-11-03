import { useState, useEffect } from "react";

export default function TypingEffect ({ text, typingSpeed = 50, deletingSpeed = 50, pause = 1000 }){
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (isDeleting) {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(text.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
      }
    } else {
      if (charIndex < text.length) {
        timeout = setTimeout(() => {
          setDisplayedText(text.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pause);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, text, typingSpeed, deletingSpeed, pause]);

  return <span>{displayedText}</span>;
};

