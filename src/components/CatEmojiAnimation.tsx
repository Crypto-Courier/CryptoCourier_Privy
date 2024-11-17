'use client';

import { useEffect } from 'react';

const CatEmojiAnimation = () => {
  useEffect(() => {
    const catEmojis = ['🐱'];

    const spawnCat = (x: number, y: number) => {
      const cat = document.createElement('div');
      cat.className = 'cat-emoji';

      // Random cat emoji from array
      cat.textContent = catEmojis[Math.floor(Math.random() * catEmojis.length)];

      // Generate random angle and distance for movement
      const angle = Math.random() * Math.PI * 2; // Random angle (0 to 360 degrees)
      const distance = Math.random() * 100 + 50; // Random distance (300px to 1000px)
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      cat.style.setProperty('--tx', `${tx}px`);
      cat.style.setProperty('--ty', `${ty}px`);

      // Position at click point
      cat.style.left = `${x}px`;
      cat.style.top = `${y}px`;

      document.body.appendChild(cat);

      // Remove after animation
      cat.addEventListener('animationend', () => {
        cat.remove();
      });
    };

    const handleClick = (e: MouseEvent) => {
      // Spawn multiple cats in random directions
      for (let i = 0; i < 2; i++) {
        spawnCat(e.pageX, e.pageY);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
};

export default CatEmojiAnimation;
