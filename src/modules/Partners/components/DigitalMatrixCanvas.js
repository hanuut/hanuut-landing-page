import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const CanvasContainer = styled.canvas`
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  z-index: 0; 
  pointer-events: none; 
  background: #050505;
`;

const DigitalMatrixCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const isMobile = window.innerWidth < 768;

    let w, h;
    let pulses = [];
    let mouse = { x: -1000, y: -1000, radius: isMobile ? 150 : 300 };
    let animationFrame;

    const ORANGE = "rgba(240, 122, 72,";
    const GREEN = "rgba(57, 161, 112,";
    const WHITE = "rgba(255, 255, 255,";

    class DataPulse {
      constructor() { this.reset(); this.progress = Math.random(); }
      reset() {
        this.lineIndex = Math.floor(Math.random() * 24); 
        this.progress = Math.random() > 0.5 ? 0 : 1; 
        this.direction = this.progress === 0 ? 1 : -1; 
        this.baseSpeed = (Math.random() * 0.0005 + 0.0002);
        this.speed = this.baseSpeed; 
        this.isShooting = false;
        const rand = Math.random();
        if (rand < 0.01) this.color = WHITE; else if (rand < 0.06) this.color = GREEN; else this.color = ORANGE;
        this.opacity = Math.random() * 0.4 + 0.3;
      }
      update() { 
        this.progress += this.speed * this.direction; 
        if (this.progress > 1.1 || this.progress < -0.1) this.reset(); 
      }
      triggerHyperSpeed() { this.isShooting = true; this.speed = this.baseSpeed * 100; this.opacity = 1; }
    }

    const init = () => { pulses = []; const count = isMobile ? 20 : 45; for (let i = 0; i < count; i++) pulses.push(new DataPulse()); };
    const resize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = `${w}px`; canvas.style.height = `${h}px`; ctx.scale(dpr, dpr); init(); };
    const drawGrid = () => {
      const gridCount = 24; const horizon = h * 0.45; ctx.lineWidth = 1;
      for (let i = 0; i <= gridCount; i++) {
        const x = (w / gridCount) * i; let dx = mouse.x - x; let dy = mouse.y - (h * 0.7); let dist = Math.sqrt(dx * dx + dy * dy);
        let hoverEffect = mouse.x !== -1000 && dist < mouse.radius ? (1 - dist/mouse.radius) : 0;
        ctx.strokeStyle = `${ORANGE} ${0.08 + hoverEffect * 0.3})`; ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(w / 2 + (x - w / 2) * 0.05, horizon); ctx.stroke();
      }
      for (let j = 0; j < 10; j++) { const py = horizon + (Math.pow(j / 10, 2)) * (h - horizon); ctx.strokeStyle = `${ORANGE} 0.05)`; ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke(); }
    };
    const animate = () => {
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, w, h); drawGrid();
      const horizon = h * 0.45; const gridCount = 24;
      pulses.forEach(p => {
        p.update();
        const xStart = (w / gridCount) * p.lineIndex; const xEnd = w / 2 + (xStart - w / 2) * 0.05;
        const currentX = xStart + (xEnd - xStart) * p.progress; const currentY = horizon + (Math.pow(1 - p.progress, 2)) * (h - horizon);
        const rawSize = p.isShooting ? 30 : (15 * (1 - p.progress)); const size = Math.max(0.1, rawSize);
        ctx.beginPath(); const grad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, size);
        grad.addColorStop(0, `${p.color} ${p.opacity})`); grad.addColorStop(1, `${p.color} 0)`); ctx.fillStyle = grad; ctx.arc(currentX, currentY, size, 0, Math.PI * 2); ctx.fill();
      });
      if (Math.random() < 0.0011) { const available = pulses.filter(p => !p.isShooting); if (available.length > 0) available[Math.floor(Math.random() * available.length)].triggerHyperSpeed(); }
      const gradX = mouse.x === -1000 ? w/2 : mouse.x; const gradY = mouse.y === -1000 ? h/2 : mouse.y;
      const vignette = ctx.createRadialGradient(gradX, gradY, 0, gradX, gradY, Math.max(1, mouse.radius * 2));
      vignette.addColorStop(0, 'rgba(5, 5, 5, 0)'); vignette.addColorStop(0.7, 'rgba(5, 5, 5, 0.4)'); vignette.addColorStop(1, 'rgba(5, 5, 5, 0.8)');
      ctx.fillStyle = vignette; ctx.fillRect(0, 0, w, h); animationFrame = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };
    window.addEventListener("resize", resize); window.addEventListener("mousemove", handleMouseMove); window.addEventListener("mouseleave", handleMouseLeave);
    resize(); animate();
    
    return () => { window.removeEventListener("resize", resize); window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseleave", handleMouseLeave); cancelAnimationFrame(animationFrame); };
  }, []);

  return <CanvasContainer ref={canvasRef} />;
};

export default DigitalMatrixCanvas;