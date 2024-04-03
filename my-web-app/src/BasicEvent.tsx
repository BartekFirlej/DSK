import React from 'react';

interface BasicEventProps {
  id: string;
  label: string;
  position: { x: number; y: number };
}

const BasicEvent: React.FC<BasicEventProps> = ({ id, label, position }) => {
  return (
    <svg x={position.x} y={position.y}>
      <circle cx="50" cy="25" r="25" fill="green" />
      <text x="50" y="30" alignmentBaseline="middle" textAnchor="middle" fill="white">
        {label}
      </text>
    </svg>
  );
};

export default BasicEvent;
export {};
