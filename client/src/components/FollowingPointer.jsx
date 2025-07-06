import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

const FollowerPointerCard = ({ children, className, userName, avatar }) => {
  const ref = useRef(null);
  const [rect, setRect] = useState(null);
  const [isInside, setIsInside] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  useEffect(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
  }, []);

  const handleMouseMove = (e) => {
    if (rect) {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      x.set(e.clientX - rect.left + scrollX);
      y.set(e.clientY - rect.top + scrollY);
    }
  };

  return (
    <div
      ref={ref}
      className={`relative ${className || ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
      style={{ cursor: isInside ? "none" : "auto" }}
    >
      <AnimatePresence>
        {isInside && (
          <FollowPointer
            x={springX}
            y={springY}
            userName={userName}
            avatar={avatar}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

const FollowPointer = ({ x, y, userName, avatar }) => {
  const [color] = useState(() => {
    const colors = [
      "#6366f1",
      "#8b5cf6",
      "#ec4899",
      "#0ea5e9",
      "#3b82f6",
      "#e11d48",
      "#f97316",
      "#facc15",
      "#22d3ee",
      "#94a3b8",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  return (
    <motion.div
      className="pointer-events-none absolute z-50"
      style={{
        top: y,
        left: x,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      {/* Pointer Icon */}
      <svg
        className="h-6 w-6 -rotate-[70deg] transform stroke-sky-600 text-sky-500"
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="1"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
      </svg>

      {/* Info Box */}
      <motion.div
        style={{ backgroundColor: color }}
        className="mt-1 flex min-w-max items-center justify-center gap-2 rounded-full px-3 py-1 text-xs text-white shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <img
          src={avatar}
          alt={userName}
          className="h-6 w-6 rounded-full border border-white"
        />
        <span className="font-medium">{userName}</span>
      </motion.div>
    </motion.div>
  );
};

export default FollowerPointerCard;
