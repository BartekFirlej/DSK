import React from 'react';
import Draggable from './Draggable';

interface ExternalEventProps {
  id: string;
  label: string;
  position: { x: number; y: number };
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
}

const ExternalEvent: React.FC<ExternalEventProps> = ({ id, label, position, onDragEnd }) => {
    const handleDragEnd = (newPosition: { x: number; y: number }) => {
      onDragEnd(id, newPosition);
    };
    const offsetX = 22.5; // Half the difference between the SVG size and the diamond size (120 - 75) / 2
    const offsetY = 22.5; // Same as offsetX for a square SVG
    
    const diamondPath = `M${position.x + offsetX},${position.y + offsetY + 37.5} 
                         l37.5,-37.5 
                         l37.5,37.5 
                         l-37.5,37.5 
                         l-37.5,-37.5`;  
    
    return (
        <Draggable initialPosition={position} onDragEnd={handleDragEnd}>
            <rect x="10" y="10" width="60" height="60" fill="orange" transform="rotate(45, 40, 40)" stroke="black" strokeWidth="2"/>
            <text x="45" y="40" alignmentBaseline="middle" textAnchor="middle" fill="black" fontWeight="bold">
                {label}
            </text>
        </Draggable>
    );
};

export default ExternalEvent;
