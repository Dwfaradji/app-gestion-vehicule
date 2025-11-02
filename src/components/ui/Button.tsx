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
  isActive?: boolean;
  isTab?: boolean;
  loading?: boolean;
}

/**
 * 🎨 Bouton personnalisable avec effet ripple, support du chargement et des variantes.
 *
 * - Peut être utilisé comme **bouton classique** ou **onglet (tab)**.
 * - Affiche un **spinner** lors du chargement (`loading`).
 * - Supporte les variantes colorées et un état actif.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "undefined",
  leftIcon,
  rightIcon,
  rippleColor,
  className,
  isActive = false,
  isTab = false,
  loading = false,
  disabled,
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

  // 🌈 Variantes de styles
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 shadow-md hover:from-blue-200 hover:to-blue-100 font-semibold transition",
    success:
      "bg-gradient-to-r from-green-100 to-green-200 text-green-700 shadow-md hover:from-green-200 hover:to-green-100 font-semibold transition",
    danger:
      "bg-gradient-to-r from-red-100 to-red-200 text-red-700 shadow-md hover:from-red-200 hover:to-red-100 font-semibold transition",
    warning:
      "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 shadow-md hover:from-yellow-200 hover:to-yellow-100 font-semibold transition",
    secondary:
      "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-md hover:from-gray-200 hover:to-gray-100 font-semibold transition",
    undefined: "",
  };

  // 🩶 Tabs
  const baseTab = "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm font-medium transition";
  const activeTabVariants = {
    primary:
      "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 shadow-md hover:from-blue-200 hover:to-blue-100 font-semibold transition",
    success:
      "bg-gradient-to-r from-green-100 to-green-200 text-green-700 shadow-md hover:from-green-200 hover:to-green-100 font-semibold transition",
    danger:
      "bg-gradient-to-r from-red-100 to-red-200 text-red-700 shadow-md hover:from-red-200 hover:to-red-100 font-semibold transition",
    warning:
      "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 shadow-md hover:from-yellow-200 hover:to-yellow-100 font-semibold transition",
    secondary:
      "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-md hover:from-gray-200 hover:to-gray-100 font-semibold transition",
    undefined: "",
  };

  const buttonStyle = isTab ? (isActive ? activeTabVariants[variant] : baseTab) : variants[variant];

  return (
    <motion.button
      ref={btnRef}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      onClick={(e) => {
        if (!loading && !disabled) {
          createRipple(e);
          props.onClick?.(e);
        }
      }}
      disabled={disabled || loading}
      className={clsx(
        "flex items-center justify-center gap-2 overflow-hidden px-4 py-2 rounded-xl select-none duration-200",
        buttonStyle,
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {loading && (
        <span
          className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {!loading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </motion.button>
  );
};
