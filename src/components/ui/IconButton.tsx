// "use client";
//
// import React from "react";
// import * as LucideIcons from "lucide-react";
// import type { LucideProps } from "lucide-react";
//
// type ButtonColor = "green" | "red" | "blue" | "gray" | "yellow";
//
// interface IconButtonProps {
//   icon: keyof typeof LucideIcons;
//   color?: ButtonColor;
//   tooltip?: string;
//   onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
//   size?: "sm" | "md" | "lg";
//   disabled?: boolean;
//   className?: string;
//   type?: "button" | "submit" | "reset";
//   textButton?: string;
// }
//
// export default function IconButton({
//   icon,
//   color = "gray",
//   tooltip,
//   onClick,
//   size = "md",
//   disabled = false,
//   className = "",
//   type,
//   textButton,
// }: IconButtonProps) {
//   const Icon = LucideIcons[icon] as React.ComponentType<LucideProps> | undefined;
//
//   const colorClasses: Record<ButtonColor, string> = {
//     green: "text-green-600 hover:bg-green-100",
//     red: "text-red-600 hover:bg-red-100",
//     blue: "text-blue-600 hover:bg-blue-100",
//     gray: "text-gray-500 hover:bg-gray-100",
//     yellow: "text-yellow-600 hover:bg-yellow-100",
//   };
//
//   const sizeClasses: Record<typeof size, string> = {
//     sm: "p-1.5 text-sm",
//     md: "p-2",
//     lg: "p-3 text-lg",
//   };
//
//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled}
//       title={tooltip}
//       className={`
//         rounded-full transition-colors
//         flex items-center justify-center
//         ${colorClasses[color]}
//         ${sizeClasses[size]}
//         ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
//         ${className}
//       `}
//     >
//       {Icon && <Icon className="w-4 h-4" />}{" "}
//       <span className={`${textButton ? "ml-2 text-gray-700" : ""} `}>{textButton}</span>
//     </button>
//   );
// }
