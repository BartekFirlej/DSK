import React from 'react';
import Draggable from './Draggable';

interface BasicEventProps {
  id: string;
  label: string;
  probability: number;
  position: { x: number; y: number };
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
}

const BasicEvent: React.FC<BasicEventProps> = ({ id, label, probability, position, onDragEnd }) => {
  const handleDragEnd = (newPosition: { x: number; y: number }) => {
    onDragEnd(id, newPosition);
  };

  return (
    <Draggable initialPosition={position} onDragEnd={handleDragEnd}>
      <circle cx="40" cy="40" r="35" fill="green" stroke="black" strokeWidth="2" />
      <text x="40" y="40" alignmentBaseline="middle" textAnchor="middle" fill="black" fontWeight="bold">
        {label}
        <tspan x="40" dy="20">{probability}</tspan>
      </text>
    </Draggable>
  );  
};

export default BasicEvent;
