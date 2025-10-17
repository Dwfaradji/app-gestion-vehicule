"use client";

import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

export interface CardProps {
  icon: React.ElementType;
  color: "blue" | "green" | "red" | "yellow" | "indigo" | "purple" | "orange" | "gray";
  label: string;
  value: string | number;
}

interface CardsProps {
  cards: CardProps[];
}

const colorStyles: Record<CardProps["color"], string> = {
  blue: "text-blue-800 bg-blue-100/30",
  green: "text-green-800 bg-green-100/30",
  red: "text-red-800 bg-red-100/30",
  yellow: "text-yellow-800 bg-yellow-100/30",
  indigo: "text-indigo-800 bg-indigo-100/30",
  purple: "text-purple-800 bg-purple-100/30",
  orange: "text-orange-800 bg-orange-100/30",
  gray: "text-gray-700 bg-gray-100/30",
};

const Cards = ({ cards }: CardsProps) => {
  if (!cards?.length) return null;

  // Dupliquer les cartes pour le défilement infini
  const displayCards = [...cards, ...cards];

  return (
    <div className="overflow-hidden py-2">
      <motion.div
        className="flex gap-5"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: cards.length * 2, // vitesse adaptative selon le nombre de cartes
          ease: "linear",
        }}
      >
        {displayCards.map((card, i) => {
          const Icon = card.icon;
          const colors = colorStyles[card.color];

          return (
            <div
              key={i}
              className={clsx(
                "flex items-center gap-4 p-5 rounded-xl border border-gray-200 flex-shrink-0 min-w-[240px]",
                "bg-white/30 backdrop-blur-md shadow-md hover:shadow-lg transition-transform duration-200",
              )}
            >
              <div
                className={clsx(
                  "p-3 rounded-full flex items-center justify-center shrink-0",
                  colors,
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-600">{card.label}</p>
                <p className="text-xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Cards;
