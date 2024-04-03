import React from 'react';
import Draggable from './Draggable';

interface AndGateProps {
  id: string;
  position: { x: number; y: number };
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
}

const AndGate: React.FC<AndGateProps> = ({ id, position, onDragEnd }) => {
  const handleDragEnd = (newPosition: { x: number; y: number }) => {
    onDragEnd(id, newPosition);
  };
  return (
    <Draggable initialPosition={position}  onDragEnd={handleDragEnd}>
        <svg x={position.x} y={position.y}>
            <rect width="40" height="40" fill="lightgreen" stroke="black" strokeWidth="2"/>
            <text x="20" y="20" alignmentBaseline="middle" textAnchor="middle" fill="black" fontWeight="bold">
                AND
            </text>
        </svg>
    </Draggable>
  );
};

export default AndGate;
