import React from 'react';
import Draggable from './Draggable';

interface ExternalEventProps {
  id: string;
  label: string;
  position: { x: number; y: number };
}

const ExternalEvent: React.FC<ExternalEventProps> = ({ id, label, position }) => {
    const diamondPath = `M${position.x},${position.y + 37.5} l37.5,-37.5 l37.5,37.5 l-37.5,37.5 l-37.5,-37.5`;  
    return (
        <Draggable initialPosition={position}>
            <svg width="120" height="120" style={{ overflow: 'visible' }}>
                <path d={diamondPath} fill="orange" stroke="black" strokeWidth="2"/>
                <text x={position.x + 37.5} y={position.y + 37.5} dominantBaseline="central" textAnchor="middle" fill="black" fontWeight="bold">
                    {label}
                </text>
            </svg>
        </Draggable>
    );
};

export default ExternalEvent;
