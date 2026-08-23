'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlassTileProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassTile({ children, className = '', onClick }: GlassTileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [sheenPos, setSheenPos] = useState({ x: '50%', y: '50%' });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotX  = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]),  { stiffness: 180, damping: 25 });
  const rotY  = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 25 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width  - 0.5;
    const ny = (e.clientY - rect.top)  / rect.height - 0.5;
    rawX.set(nx);
    rawY.set(ny);
    setSheenPos({
      x: `${((nx + 0.5) * 100).toFixed(1)}%`,
      y: `${((ny + 0.5) * 100).toFixed(1)}%`,
    });
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      className={`glass-tile ${onClick ? 'glass-tile--clickable' : ''} ${className}`}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: 'preserve-3d',
      }}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Pointer-tracked radial-gradient sheen */}
      {hovering && (
        <div
          className="glass-tile-sheen"
          style={{
            background: `radial-gradient(circle at ${sheenPos.x} ${sheenPos.y}, rgba(34,211,238,0.12) 0%, transparent 60%)`,
          }}
        />
      )}
      <div className="glass-tile-content">{children}</div>
    </motion.div>
  );
}
