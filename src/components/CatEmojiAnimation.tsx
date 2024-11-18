"use client";

import { useEffect } from "react";

const CatEmojiAnimation = () => {
  useEffect(() => {
    const catEmojis = ["🐱", "😺", "😸", "😻", "🐈"];

    const spawnCat = (x: number, y: number) => {
      const cat = document.createElement("div");
      cat.className = "cat-emoji";

      // Random cat emoji from array
      cat.textContent = catEmojis[Math.floor(Math.random() * catEmojis.length)];

      // Generate random angle and distance for movement
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 600 + 200; // Increased distance range (200px to 800px)
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      // Random initial scale for variety
      const scale = Math.random() * 0.5 + 1.5; // Scale between 1.5x and 2x

      cat.style.setProperty("--tx", `${tx}px`);
      cat.style.setProperty("--ty", `${ty}px`);
      cat.style.setProperty("--scale", scale.toString());

      // Position at click point
      cat.style.left = `${x}px`;
      cat.style.top = `${y}px`;

      // Random rotation
      const rotation = Math.random() * 720 - 360; // Rotation between -360 and 360 degrees
      cat.style.setProperty("--rotation", `${rotation}deg`);

      document.body.appendChild(cat);

      // Remove after animation
      cat.addEventListener("animationend", () => {
        cat.remove();
      });
    };

    const handleClick = (e: MouseEvent) => {
      // Spawn more cats
      for (let i = 0; i < 4; i++) {
        spawnCat(e.pageX, e.pageY);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
};

export default CatEmojiAnimation;
