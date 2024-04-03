import React from 'react';
import Draggable from './Draggable';

interface BasicEventProps {
  id: string;
  label: string;
  position: { x: number; y: number };
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
}

const BasicEvent: React.FC<BasicEventProps> = ({ id, label, position, onDragEnd }) => {
  const handleDragEnd = (newPosition: { x: number; y: number }) => {
    onDragEnd(id, newPosition);
    console.log('NOWA POZYCJa' + newPosition)
  };

  return (
    <Draggable initialPosition={position} onDragEnd={handleDragEnd}>
      <circle cx="50" cy="50" r="35" fill="green" stroke="black" strokeWidth="2" />
      <text x="50" y="50" alignmentBaseline="middle" textAnchor="middle" fill="white" fontWeight="bold">
        {label}
      </text>
    </Draggable>
  );  
};

export default BasicEvent;
