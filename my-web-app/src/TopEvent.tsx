import React from 'react';

interface TopEventProps {
  id: string; 
  label: string; 
  position: { x: number; y: number }; 
}

const TopEvent: React.FC<TopEventProps> = ({ id, label, position }) => {
  return (
    <svg x={position.x} y={position.y}>
      <rect width="100" height="50" fill="red" />
      <text x="50" y="25" alignmentBaseline="middle" textAnchor="middle" fill="white">
        {label}
      </text>
    </svg>
  );
};

export default TopEvent;
