import React from "react";
import Draggable from "./Draggable";
import formatToExponential from "./Format";

interface TopEventProps {
  id: string;
  label: string;
  position: { x: number; y: number };
  probability: number;
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
}

const TopEvent: React.FC<TopEventProps> = ({
  id,
  label,
  position,
  probability,
  onDragEnd,
}) => {
  const handleDragEnd = (newPosition: { x: number; y: number }) => {
    onDragEnd(id, newPosition);
  };

  return (
    <Draggable initialPosition={position} onDragEnd={handleDragEnd}>
      <svg>
        <rect
          width="130"
          height="50"
          fill="red"
          stroke="black"
          strokeWidth="2"
        />
        <text
          x="65"
          y="20"
          alignmentBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
        >
          {label}
          <tspan x="65" dy="20" fontSize={12}>
            {formatToExponential(probability)}
          </tspan>
        </text>
      </svg>
    </Draggable>
  );
};

export default TopEvent;
