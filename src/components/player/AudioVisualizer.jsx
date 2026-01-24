/**
 * AudioVisualizer Component
 * Canvas-based audio frequency visualizer
 * Note: Due to YouTube IFrame restrictions, this uses a simulated visualization
 * based on playback state rather than actual audio analysis
 */
import { useRef, useEffect, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";

function AudioVisualizer({ enabled = true, barCount = 12, className = "" }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const barsRef = useRef([]);

  const { isPlaying, isBuffering } = usePlayer();

  // Initialize bars with random heights
  useEffect(() => {
    barsRef.current = Array(barCount)
      .fill(0)
      .map(() => Math.random() * 0.5);
  }, [barCount]);

  // Animation loop
  useEffect(() => {
    if (!enabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      const barWidth = (rect.width / barCount) * 0.7;
      const gap = (rect.width / barCount) * 0.3;
      const maxHeight = rect.height * 0.9;

      // Update and draw bars
      barsRef.current.forEach((height, i) => {
        // Animate based on playback state
        if (isPlaying && !isBuffering) {
          // Smooth random movement
          const target = 0.2 + Math.random() * 0.8;
          barsRef.current[i] = height + (target - height) * 0.15;
        } else {
          // Fade to low when paused
          barsRef.current[i] = height + (0.1 - height) * 0.1;
        }

        const barHeight = Math.max(4, barsRef.current[i] * maxHeight);
        const x = i * (barWidth + gap) + gap / 2;
        const y = (rect.height - barHeight) / 2;

        // Gradient color
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, "rgba(139, 92, 246, 0.9)"); // accent-purple
        gradient.addColorStop(1, "rgba(59, 130, 246, 0.9)"); // primary

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, isPlaying, isBuffering, barCount]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default AudioVisualizer;
