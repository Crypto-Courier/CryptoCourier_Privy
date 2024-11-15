"use client";
import { useState, useCallback } from "react";

const ImageParticle = ({ x, y, id, randomX, randomInitialY, rotation }) => {
  return (
    <div
      className="absolute pointer-events-none w-6 h-6"
      style={{
        left: x,
        top: y,
        animation: `fall-${
          randomX > 0 ? "right" : "left"
        } 1s ease-out forwards`,
        transform: `translate(${randomX}px, ${randomInitialY}px) rotate(${rotation}deg)`,
      }}
    >
      <img
        src="/path-to-your-icon.png" // Replace with the actual emoji or image path
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
  );
};

const ImageClickEffect = () => {
  const [particles, setParticles] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState(null);

  const createParticles = useCallback((x, y, count) => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      randomX: Math.random() * 100 - 50, // Range: -50 to 50
      randomInitialY: -Math.random() * 50, // Initial upward boost
      rotation: Math.random() * 360, // Random rotation
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    // Schedule cleanup
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((particle) => particle.id < Date.now() - 1000)
      );
    }, 1200);
  }, []);

  const handleClick = useCallback(
    (e) => {
      const x = e.clientX;
      const y = e.clientY;

      setClickCount((prevCount) => prevCount + 1);

      // If a timer exists, clear it
      if (clickTimeout) clearTimeout(clickTimeout);

      // Set a new timer to reset click count after 300ms
      const newTimeout = setTimeout(() => {
        createParticles(x, y, clickCount * 2); // 2 particles for each click
        setClickCount(0);
      }, 300);

      setClickTimeout(newTimeout);
    },
    [createParticles, clickCount, clickTimeout]
  );

  return (
    <div className="fixed inset-0 w-full h-full" onClick={handleClick}>
      <style jsx global>{`
        @keyframes fall-right {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(100px, 150px) rotate(360deg) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes fall-left {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(-100px, 150px) rotate(-360deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
      {particles.map((particle) => (
        <ImageParticle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          randomX={particle.randomX}
          randomInitialY={particle.randomInitialY}
          rotation={particle.rotation}
        />
      ))}
    </div>
  );
};

export default ImageClickEffect;
