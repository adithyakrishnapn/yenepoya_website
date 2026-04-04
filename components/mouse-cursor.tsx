"use client";

import { useEffect, useState } from "react";

export default function MouseCursor() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) {
      return;
    }

    setVisible(true);

    const onMove = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const onOver = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, select, [role='button']")) {
        setHovering(true);
      }
    };

    const onOut = () => setHovering(false);
    const onLeave = () => setHovering(false);

    window.addEventListener("pointermove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={`mouse-cursor-ring ${hovering ? "is-hovering" : ""}`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)` }}
      />
      <div
        aria-hidden="true"
        className={`mouse-cursor-dot ${hovering ? "is-hovering" : ""}`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)` }}
      />
    </>
  );
}
