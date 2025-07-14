import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isOnHeading, setIsOnHeading] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursor || !cursorDot) return;

    // Hide default cursor
    document.body.style.cursor = "none";

    // Mouse move handler - Ultra smooth response
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;

      // Main cursor follows immediately for smoothest experience
      gsap.set(cursor, {
        x: x - 15,
        y: y - 15,
      });

      // Small dot follows immediately
      gsap.set(cursorDot, {
        x: x - 2,
        y: y - 2,
      });
    };

    // Mouse enter handler - Simple smooth scale
    const handleMouseEnter = (e) => {
      const element = e.target;
      setIsHovering(true);

      // Check if hovering over heading elements
      const isHeading = element.matches(
        "h1, h2, h3, h4, h5, h6, .heading, .title"
      );
      setIsOnHeading(isHeading);

      // Simple scale animation
      gsap.to(cursor, {
        scale: isHeading ? 2.5 : 2,
        duration: 0.2,
        ease: "power2.out",
      });

      gsap.to(cursorDot, {
        scale: 0,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    // Mouse leave handler - Simple smooth scale back
    const handleMouseLeave = () => {
      setIsHovering(false);
      setIsOnHeading(false);

      gsap.to(cursor, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to(cursorDot, {
        scale: 1,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    // Mouse down handler - smooth click feedback
    const handleMouseDown = () => {
      gsap.to(cursor, {
        scale: isOnHeading ? 2.5 : isHovering ? 1.7 : 0.8,
        duration: 0.08,
        ease: "power2.out",
      });
    };

    // Mouse up handler - smooth release
    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: isOnHeading ? 3 : isHovering ? 2 : 1,
        duration: 0.08,
        ease: "power2.out",
      });
    };

    // Add event listeners with passive for better performance
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mousedown", handleMouseDown, { passive: true });
    document.addEventListener("mouseup", handleMouseUp, { passive: true });

    // Add hover effects to interactive elements including headings
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], .cursor-pointer, h1, h2, h3, h4, h5, h6, .heading, .title'
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
  }, [isHovering, isOnHeading]);

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
      {/* Main cursor ring - No blur, clean appearance */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999]"
        style={{
          borderRadius: "50%",
          border: `2px solid ${
            isOnHeading ? "#f59e0b" : isHovering ? "#3b82f6" : "#ffffff"
          }`,
          backgroundColor: isOnHeading
            ? "rgba(245, 158, 11, 0.1)"
            : isHovering
            ? "rgba(59, 130, 246, 0.1)"
            : "transparent",
          mixBlendMode: "difference",
          willChange: "transform",
          transition: "border-color 0.2s ease, background-color 0.2s ease",
        }}
      />

      {/* Small center dot - Clean and smooth */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1 h-1 pointer-events-none z-[10000]"
        style={{
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
    </>
  );
};

export default CustomCursor;
