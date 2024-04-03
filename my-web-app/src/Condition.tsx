import React from 'react';
import Draggable from './Draggable';

interface ConditionProps {
  id: string;
  label: string;
  position: { x: number; y: number };
}

const Condition: React.FC<ConditionProps> = ({ id, label, position }) => {
  return (
    <Draggable initialPosition={position}>
        <svg x={position.x} y={position.y}>
            <rect width="130" height="50" fill="lightblue" stroke="black" strokeWidth="2"/>
            <text x="65" y="25" alignmentBaseline="middle" textAnchor="middle" fill="black" fontWeight="bold">
                {label}
            </text>
        </svg>
    </Draggable>
  );
};

export default Condition;
