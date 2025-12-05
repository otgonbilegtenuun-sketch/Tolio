"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Heart = {
  id: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
};

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [letterText, setLetterText] = useState(
    "Your letter will appear here. Add your words to public/1.txt."
  );

  const heartEmoji = useMemo(
    () =>
      [
        "\\u2764\\uFE0F",
        "\\uD83D\\uDC95",
        "\\uD83D\\uDC97",
        "\\uD83D\\uDC96",
        "\\uD83D\\uDC9D",
      ].map((hex) => JSON.parse(`"${hex}"`)),
    []
  );
  const loveSeal = useMemo(() => JSON.parse("\"\\uD83D\\uDC8C\""), []);

  useEffect(() => {
    const loadLetter = async () => {
      try {
        const res = await fetch("/1.txt");
        if (!res.ok) return;
        const text = (await res.text()).trim();
        if (text.length > 0) {
          setLetterText(text);
        }
      } catch {
        // Swallow fetch errors; fallback text remains.
      }
    };

    loadLetter();
  }, []);

  useEffect(() => {
    if (!opened) return;

    const addHeart = () => {
      const id = Math.random().toString(36).slice(2);
      const duration = 3.2 + Math.random() * 1.5;
      const delay = Math.random() * 0.6;
      const heart: Heart = {
        id,
        left: Math.random() * 100,
        delay,
        duration,
        size: 18 + Math.random() * 16,
      };

      setHearts((prev) => [...prev, heart]);
      setTimeout(
        () => setHearts((prev) => prev.filter((h) => h.id !== id)),
        (duration + delay) * 1000 + 200
      );
    };

    const interval = setInterval(addHeart, 180);
    const stop = setTimeout(() => clearInterval(interval), 2600);

    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [opened]);

  return (
    <div className={styles.page}>
      <div className={styles.hearts}>
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className={styles.heart}
            style={{
              left: `${heart.left}%`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}px`,
            }}
          >
            {heartEmoji[heart.id.length % heartEmoji.length]}
          </span>
        ))}
      </div>

      <main className={styles.main}>
        <div className={styles.envelopeBlock}>
          <div className={`${styles.envelope} ${opened ? styles.opened : ""}`}>
            <div className={styles.topFlap} />
            <div className={styles.bottomFlap} />
            <div className={styles.seal}>{loveSeal}</div>
          </div>
          <button
            className={styles.button}
            onClick={() => setOpened(true)}
            disabled={opened}
          >
            {opened ? "Letter opened" : "Click to open"}
          </button>
          <p className={styles.caption}>
            Tap the envelope to reveal what my heart&apos;s been holding.
          </p>
        </div>

        {opened && (
          <section className={styles.letterPanel}>
            <div className={styles.header}>
              <div className={styles.ribbon}>For my favorite person</div>
            </div>
            <div className={styles.content}>
              <div className={styles.textBlock}>
                {letterText
                  .split("\n")
                  .filter((paragraph) => paragraph.trim().length > 0)
                  .map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 12)}`}>
                      {paragraph}
                    </p>
                  ))}
              </div>
              <div className={styles.photo}>
                <Image
                  src="/her.jpg"
                  alt="My favorite person"
                  width={360}
                  height={477}
                  priority
                />
                <div className={styles.polaroidNote}>with all my love</div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
