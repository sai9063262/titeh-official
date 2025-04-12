
import React from "react";

// This is a custom FlashLight icon since lucide-react doesn't have a built-in flashlight icon
const FlashLight = ({ 
  size = 24, 
  color = "currentColor", 
  strokeWidth = 2,
  className = ""
}: { 
  size?: number; 
  color?: string; 
  strokeWidth?: number;
  className?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 2h8l4 5h-16l4-5z" />
      <path d="M12 7v13" />
      <path d="M8 16h8" />
      <path d="M10 20h4" />
      <path d="M12 7v4" />
      <path d="M10 9h4" />
    </svg>
  );
};

export default FlashLight;
