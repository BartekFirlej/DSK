import React from 'react';
import orGateImage from './img/or.png'; // Adjust the path according to your file structure

interface OrGateProps {
  id: string;
  position: { x: number; y: number };
}

const OrGate: React.FC<OrGateProps> = ({ id, position }) => {
    return (
        <svg x={position.x} y={position.y}>
            <image href={orGateImage} height="50" width="50"/>
        </svg>
      );
};

export default OrGate;
