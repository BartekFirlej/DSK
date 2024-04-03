import React from 'react';
import Draggable from './Draggable';

interface TopEventProps {
  id: string; 
  label: string; 
  position: { x: number; y: number }; 
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
}

const TopEvent: React.FC<TopEventProps> = ({ id, label, position, onDragEnd }) => {
    const handleDragEnd = (newPosition: { x: number; y: number }) => {
      onDragEnd(id, newPosition);
    };

  return (
    <Draggable initialPosition={position} onDragEnd={handleDragEnd}>
        <svg>
            <rect width="130" height="50" fill="red" stroke="black" strokeWidth="2"/>
            <text x="65" y="25" alignmentBaseline="middle" textAnchor="middle" fill="white" fontWeight="bold">
                {label}
            </text>
        </svg>
    </Draggable>
  );
};

export default TopEvent;
