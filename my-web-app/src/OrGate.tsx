import React from "react";
import Draggable from "./Draggable";
import formatToExponential from "./Format";

interface OrGateProps {
  id: string;
  label: string;
  position: { x: number; y: number };
  probability: number;
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
}

const OrGate: React.FC<OrGateProps> = ({
  id,
  position,
  probability,
  label,
  onDragEnd,
}) => {
  const handleDragEnd = (newPosition: { x: number; y: number }) => {
    onDragEnd(id, newPosition);
  };
  return (
    <Draggable initialPosition={position} onDragEnd={handleDragEnd}>
      {" "}
      {/* Pass onDragEnd prop */}
      <svg>
        <rect
          width="50"
          height="50"
          fill="lightgreen"
          stroke="black"
          strokeWidth="2"
        />
        <text
          x="25"
          y="20"
          alignmentBaseline="middle"
          textAnchor="middle"
          fill="black"
          fontWeight="bold"
        >
          {label}
          <tspan x="25" dy="20" fontSize={12}>
            {formatToExponential(probability)}
          </tspan>
        </text>
      </svg>
    </Draggable>
  );
};

export default OrGate;
