/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 300, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide cursor on touch devices
    const touchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (touchDevice) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') || 
        target.classList.contains('interactive-hover') ||
        target.getAttribute('role') === 'button';
      
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Spring Ring */}
      <motion.div
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovered ? 1.5 : 1,
          borderColor: isHovered ? 'var(--theme-accent, #3b82f6)' : 'rgba(255, 255, 255, 0.4)',
          backgroundColor: isHovered ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0)',
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.2 }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-50 mix-blend-difference hidden md:block"
      />
      {/* Inner Dot */}
      <motion.div
        style={{
          x: useSpring(useMotionValue(-100), springConfig),
          y: useSpring(useMotionValue(-100), springConfig),
          left: cursorX,
          top: cursorY,
        }}
        animate={{
          scale: isClicking ? 1.2 : isHovered ? 0.3 : 1,
          backgroundColor: isHovered ? 'var(--theme-accent, #3b82f6)' : '#ffffff',
          x: 13, // center the dot
          y: 13,
        }}
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block"
      />
    </>
  );
}
