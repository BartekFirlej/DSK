import React from 'react';

interface ConditionProps {
  id: string;
  label: string;
  position: { x: number; y: number };
}

const Condition: React.FC<ConditionProps> = ({ id, label, position }) => {
  return (
    <svg x={position.x} y={position.y}>
      <rect width="100" height="50" fill="lightblue" />
      <text x="50" y="25" alignmentBaseline="middle" textAnchor="middle" fill="black">
        {label}
      </text>
    </svg>
  );
};

export default Condition;
