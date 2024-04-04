import React from "react";
import Draggable from "./Draggable";
import formatToExponential from "./Format";

interface ExternalEventProps {
  id: string;
  label: string;
  probability: number;
  position: { x: number; y: number };
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
}

const ExternalEvent: React.FC<ExternalEventProps> = ({
  id,
  label,
  probability,
  position,
  onDragEnd,
}) => {
  const handleDragEnd = (newPosition: { x: number; y: number }) => {
    onDragEnd(id, newPosition);
  };
  const offsetX = 22.5;
  const offsetY = 22.5;

  const diamondPath = `M${position.x + offsetX},${position.y + offsetY + 37.5} 
                         l37.5,-37.5 
                         l37.5,37.5 
                         l-37.5,37.5 
                         l-37.5,-37.5`;

  return (
    <Draggable initialPosition={position} onDragEnd={handleDragEnd}>
      <rect
        x="10"
        y="10"
        width="60"
        height="60"
        fill="orange"
        transform="rotate(45, 40, 40)"
        stroke="black"
        strokeWidth="2"
      />
      <text
        x="40"
        y="35"
        alignmentBaseline="middle"
        textAnchor="middle"
        fill="black"
        fontWeight="bold"
      >
        {label}
        <tspan x="40" dy="20" fontSize={12}>
          {formatToExponential(probability)}
        </tspan>
      </text>
    </Draggable>
  );
};

export default ExternalEvent;
