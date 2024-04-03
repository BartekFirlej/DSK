import React from 'react';
import andGateImage from './img/and.png'; // Adjust path as necessary

interface AndGateProps {
  id: string;
  position: { x: number; y: number };
}

const AndGate: React.FC<AndGateProps> = ({ id, position }) => {
  return (
    <svg x={position.x} y={position.y}>
        <image href={andGateImage} height="50px" width="50px"/>
    </svg>
  );
};

export default AndGate;
