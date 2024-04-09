import React from "react";
import Draggable from "./Draggable";
import formatToExponential from "./Format";
import FTANode from "./FTANode";

interface BasicEventProps extends FTANode{
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
}

const BasicEvent: React.FC<BasicEventProps> = ({
  id,
  label,
  probability,
  position,
  type,
  onDragEnd,
}) => {
  const handleDragEnd = (newPosition: { x: number; y: number }) => {
    onDragEnd(id, newPosition);
  };

  return (
    <Draggable initialPosition={position} onDragEnd={handleDragEnd}>
      <circle
        cx="40"
        cy="40"
        r="35"
        fill="green"
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

export default BasicEvent;
