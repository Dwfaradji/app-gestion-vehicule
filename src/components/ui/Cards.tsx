import React from "react";
import clsx from "clsx";

//type tableau d'objets de type CardProps
interface CardProps {
  icon: React.ElementType;
  color: string;
  label: string;
  value: string | number;
}

interface CardsProps {
  cards: CardProps[];
}

const Cards = ({ cards }: CardsProps) => {
  if (!cards || cards.length === 0) return null;
  return (
    <div className="grid grid-cols-6 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={clsx(
              "flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200",
              `text-${card.color}-700`,
            )}
          >
            <div
              className={clsx(
                `bg-${card.color}-100 p-3 rounded-full flex items-center justify-center`,
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
