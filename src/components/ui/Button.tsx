"use client";

import React, { useRef } from "react";
import { motion, MotionProps } from "framer-motion";
import clsx from "clsx";

type CleanMotionButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDragTransitionEnd"
> &
  MotionProps;

interface ButtonProps extends CleanMotionButtonProps {
  variant?: "primary" | "success" | "danger" | "warning" | "secondary" | "undefined";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rippleColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "undefined",
  leftIcon,
  rightIcon,
  rippleColor,
  className,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = btnRef.current;
    if (!button) return;

    const ripple = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - rect.left - radius}px`;
    ripple.style.top = `${e.clientY - rect.top - radius}px`;
    ripple.style.background = rippleColor || "rgba(255, 255, 255, 0.3)";
    ripple.classList.add("ripple");

    const existing = button.getElementsByClassName("ripple")[0];
    if (existing) existing.remove();

    button.appendChild(ripple);
  };

  const variants = {
    primary: "bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold",
    success: " bg-green-100 text-green-700 rounded-md hover:bg-green-200 font-semibold",
    danger: "bg-red-300 hover:bg-red-400 text-white font-semibold",
    warning: "bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-semibold",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold",
    undefined: "",
  };

  return (
    <motion.button
      ref={btnRef}
      whileTap={{ scale: 0.97 }}
      onClick={(e) => {
        createRipple(e);
        props.onClick?.(e);
      }}
      className={clsx(
        " flex items-center justify-center gap-2 overflow-hidden px-4 py-2 rounded-xl font-semibold transition duration-200 select-none",
        variants[variant],
        className,
      )}
      {...props}
    >
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </motion.button>
  );
};
