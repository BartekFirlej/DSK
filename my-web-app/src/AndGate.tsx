import React from "react";
import Draggable from "./Draggable";
import formatToExponential from "./Format";
import FTANode from "./FTANode";

interface AndGateProps extends FTANode {
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
}

const AndGate: React.FC<AndGateProps> = ({
  id,
  position,
  probability,
  label,
  type,
  onDragEnd,
}) => {
  const handleDragEnd = (newPosition: { x: number; y: number }) => {
    onDragEnd(id, newPosition);
  };
  return (
    <Draggable initialPosition={position} onDragEnd={handleDragEnd}>
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

export default AndGate;
