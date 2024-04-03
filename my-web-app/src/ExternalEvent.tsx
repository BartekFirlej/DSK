import React from 'react';

interface ExternalEventProps {
  id: string;
  label: string;
  position: { x: number; y: number };
}

const ExternalEvent: React.FC<ExternalEventProps> = ({ id, label, position }) => {
  const diamondPath = `M${position.x},${position.y + 25} l25,-25 l25,25 l-25,25 l-25,-25`;

  return (
    <svg>
      <path d={diamondPath} fill="orange" />
      <text x={position.x + 25} y={position.y + 30} alignmentBaseline="middle" textAnchor="middle" fill="black">
        {label}
      </text>
    </svg>
  );
};

export default ExternalEvent;
