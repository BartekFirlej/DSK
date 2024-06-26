import React from "react";
import Draggable from "./Draggable";
import FTANode from "./FTANode";

interface ConditionProps extends FTANode{
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
}

const Condition: React.FC<ConditionProps> = ({
  id,
  label,
  position,
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
          width="130"
          height="50"
          fill="lightblue"
          stroke="black"
          strokeWidth="2"
        />
        <text
          x="65"
          y="25"
          alignmentBaseline="middle"
          textAnchor="middle"
          fill="black"
          fontWeight="bold"
        >
          {label}
        </text>
      </svg>
    </Draggable>
  );
};

export default Condition;
