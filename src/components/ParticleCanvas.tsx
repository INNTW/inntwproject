"use client";

import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

const PARTICLE_COUNT = 60;
const COLORS = [
  "rgba(255, 255, 255,",    // white motes
  "rgba(255, 220, 160,",    // warm embers
  "rgba(200, 200, 220,",    // cool dust
];

/**
 * PARTICLE ATMOSPHERE
 * Tiny floating particles drift upward through the tile gaps.
 * Creates a living, breathing feeling — like dust motes or embers.
 * Bottom fog/mist effect for grounding.
 */
export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const createParticle = (): Particle => {
      const maxLife = 300 + Math.random() * 400;
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.2 + Math.random() * 0.5),
        size: 0.5 + Math.random() * 1.5,
        opacity: 0,
        life: 0,
        maxLife,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, createParticle);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Bottom fog gradient
      const fogGrad = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
      fogGrad.addColorStop(0, "transparent");
      fogGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.15)");
      fogGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

      // Update and draw particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Gentle drift
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vx *= 0.99; // dampen

        // Fade in then out
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) {
          p.opacity = lifeRatio / 0.1;
        } else if (lifeRatio > 0.7) {
          p.opacity = (1 - lifeRatio) / 0.3;
        } else {
          p.opacity = 1;
        }

        // Draw
        const alpha = p.opacity * 0.35;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${alpha})`;
        ctx.fill();

        // Subtle glow on larger particles
        if (p.size > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color} ${alpha * 0.15})`;
          ctx.fill();
        }

        // Respawn when dead or off screen
        if (p.life >= p.maxLife || p.y < -20) {
          particlesRef.current[i] = createParticle();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}
