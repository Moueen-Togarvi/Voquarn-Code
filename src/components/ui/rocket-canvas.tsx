"use client";

import React, { useEffect, useRef } from "react";

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

export function RocketCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let smokeParticles: SmokeParticle[] = [];
    let sparkParticles: SparkParticle[] = [];

    // Fit canvas to parent container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      // Make canvas height 180% of container so smoke flows down into the rest of the sections
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = (rect.height * 1.8) * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio * 1.8);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Rocket thruster nozzle coordinates (relative to canvas center)
    const getNozzles = () => {
      const w = canvas.width / window.devicePixelRatio;
      const centerX = (w / 2) + 5; // Match the rocket's left: "calc(50% + 5px)" position
      // Space Shuttle gk.png (width 250px, top 0) aligns perfectly at centerY = 380
      const centerY = 380;

      return [
        { x: centerX - 25, y: centerY },      // Left SSME
        { x: centerX,      y: centerY + 10 }, // Center SSME (main)
        { x: centerX + 25, y: centerY },      // Right SSME
      ];
    };

    const smokeColors = [
      "rgba(160, 164, 168, 0.85)", // Light ash grey
      "rgba(180, 185, 190, 0.8)",  // Soft neutral grey
      "rgba(200, 205, 210, 0.75)", // Pale grey
      "rgba(140, 145, 150, 0.85)", // Medium slate grey
    ];

    const fireColors = [
      "#ff5400", // Bright orange
      "#ff8a00", // Warm orange
      "#ff3300", // Red-orange
      "#ffaa00", // Yellow-gold
    ];

    // Main animation loop
    const animate = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = (canvas.height / window.devicePixelRatio) / 1.8; // Use standard height for coordinates

      // CLEAR CANVAS: Completely transparent to allow seamless integration with page background
      ctx.clearRect(0, 0, w, h * 2.2);

      const nozzles = getNozzles();

      // 1. Generate Smoke Particles
      if (Math.random() < 0.85) {
        nozzles.forEach((nozzle, index) => {
          const isMain = index === 1;
          smokeParticles.push({
            x: nozzle.x + (Math.random() - 0.5) * 3,
            y: nozzle.y + Math.random() * 3,
            vx: (Math.random() - 0.5) * (isMain ? 0.3 : 0.6),
            vy: 0.8 + Math.random() * 1.5, // Downward flow
            radius: 2 + Math.random() * 3, // Very narrow initial size
            alpha: 0.95,
            color: smokeColors[Math.floor(Math.random() * smokeColors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
          });
        });
      }

      // 2. Generate Spark Particles (fire/laser thrusters)
      for (let i = 0; i < 2; i++) {
        nozzles.forEach((nozzle) => {
          sparkParticles.push({
            x: nozzle.x + (Math.random() - 0.5) * 4,
            y: nozzle.y + Math.random() * 3,
            vx: (Math.random() - 0.5) * 2,
            vy: 6 + Math.random() * 8, // Blasting down
            radius: 1.0 + Math.random() * 2.0,
            alpha: 1.0,
            color: fireColors[Math.floor(Math.random() * fireColors.length)],
          });
        });
      }

      // 3. Draw Laser Flame Columns (Thruster Beams)
      nozzles.forEach((nozzle, index) => {
        const isMain = index === 1;
        const beamWidth = isMain ? 10 : 6;
        const beamLength = isMain ? 70 : 45;

        ctx.save();
        const beamGrad = ctx.createLinearGradient(nozzle.x, nozzle.y, nozzle.x, nozzle.y + beamLength);
        beamGrad.addColorStop(0, "#ffffff");
        beamGrad.addColorStop(0.2, "#ffaa00");
        beamGrad.addColorStop(0.6, "#ff5400");
        beamGrad.addColorStop(1, "rgba(255, 84, 0, 0)");

        ctx.fillStyle = beamGrad;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff5400";

        // Draw conical thruster nozzle flame
        ctx.beginPath();
        ctx.moveTo(nozzle.x - beamWidth / 2, nozzle.y);
        ctx.lineTo(nozzle.x + beamWidth / 2, nozzle.y);
        ctx.lineTo(nozzle.x + (beamWidth * 1.4) / 2, nozzle.y + beamLength);
        ctx.lineTo(nozzle.x - (beamWidth * 1.4) / 2, nozzle.y + beamLength);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // 4. Update and Render Spark Particles
      sparkParticles = sparkParticles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.05;
        p.radius *= 0.97;

        if (p.alpha <= 0) return false;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
        return true;
      });

      // 5. Update and Render Smoke Particles (Billowing effect)
      smokeParticles = smokeParticles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Slower air friction
        p.vx *= 0.99;

        // Billow outwards as it descends (very slow expansion for narrow smoke)
        p.radius += 0.08;

        // DENSE AT HERO, FAINTS AT BOTTOM: Decrease alpha faster as y increases
        const depthFactor = Math.min(1.0, p.y / (h * 1.6));
        p.alpha -= 0.0012 + depthFactor * 0.0018;
        p.rotation += p.rotationSpeed;

        if (p.alpha <= 0 || p.y > h * 2.2) return false;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Draw puffy cloud
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Texture shadow
        ctx.beginPath();
        ctx.arc(-p.radius * 0.12, -p.radius * 0.12, p.radius * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        ctx.fill();

        ctx.restore();
        return true;
      });

      // Subtle rising fire embers
      if (Math.random() < 0.08) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(Math.random() * w, h * 0.8 + Math.random() * h, 0.8 + Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffaa00";
        ctx.globalAlpha = 0.45;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
    />
  );
}
