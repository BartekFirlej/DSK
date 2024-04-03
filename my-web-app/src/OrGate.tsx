import React from 'react';
import Draggable from './Draggable';

interface OrGateProps {
  id: string;
  position: { x: number; y: number };
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void; // Add this prop
}

const OrGate: React.FC<OrGateProps> = ({ id, position, onDragEnd }) => {
    const handleDragEnd = (newPosition: { x: number; y: number }) => {
      onDragEnd(id, newPosition);
      console.log('NOWA POZYCJa' + newPosition)
    };
    return (
        <Draggable initialPosition={position} onDragEnd={handleDragEnd}> {/* Pass onDragEnd prop */}
            <svg>
                <rect width="40" height="40" fill="lightgreen" stroke="black" strokeWidth="2"/>
                <text x="20" y="20" alignmentBaseline="middle" textAnchor="middle" fill="black" fontWeight="bold">
                    OR
                </text>
            </svg>
        </Draggable>    
      );
};

export default OrGate;
