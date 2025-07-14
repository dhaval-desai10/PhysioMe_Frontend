import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursor || !cursorDot) return;

    // Hide default cursor
    document.body.style.cursor = "none";

    // Mouse move handler - INSTANT response
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;

      // Main cursor follows INSTANTLY
      gsap.set(cursor, {
        x: x - 15,
        y: y - 15,
      });

      // Small dot follows INSTANTLY
      gsap.set(cursorDot, {
        x: x - 2,
        y: y - 2,
      });
    };

    // Mouse enter handler - instant
    const handleMouseEnter = () => {
      setIsHovering(true);
      gsap.set(cursor, { scale: 2 });
      gsap.set(cursorDot, { scale: 0 });
    };

    // Mouse leave handler - instant
    const handleMouseLeave = () => {
      setIsHovering(false);
      gsap.set(cursor, { scale: 1 });
      gsap.set(cursorDot, { scale: 1 });
    };

    // Mouse down handler - instant
    const handleMouseDown = () => {
      gsap.set(cursor, { scale: isHovering ? 1.7 : 0.8 });
    };

    // Mouse up handler - instant
    const handleMouseUp = () => {
      gsap.set(cursor, { scale: isHovering ? 2 : 1 });
    };

    // Add event listeners with passive for better performance
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mousedown", handleMouseDown, { passive: true });
    document.addEventListener("mouseup", handleMouseUp, { passive: true });

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], .cursor-pointer'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter, { passive: true });
      el.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    });

    // Cleanup
    return () => {
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [isHovering]);

  // Don't render on mobile devices
  if (typeof window !== "undefined") {
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobile) return null;
  }

  return (
    <>
      {/* Main cursor ring - ultra responsive */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999]"
        style={{
          borderRadius: "50%",
          border: `2px solid ${isHovering ? "#3b82f6" : "#ffffff"}`,
          backgroundColor: "transparent",
          mixBlendMode: "difference",
        }}
      />

      {/* Small center dot - instant response */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1 h-1 pointer-events-none z-[10000]"
        style={{
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
};

export default CustomCursor;
