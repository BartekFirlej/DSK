import React, { useState } from 'react';

interface DraggableProps {
  initialPosition: { x: number; y: number };
  children: React.ReactNode;
  onDragEnd: (newPosition: { x: number; y: number }) => void;
}

const Draggable: React.FC<DraggableProps> = ({ initialPosition, children, onDragEnd }) => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [positionUpdate, setPositionUpdate] = useState(initialPosition);

  const handleMouseDown = (e: React.MouseEvent<SVGElement>) => {
    setDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    if (!dragging) return;
    const newPosition = {
        x: position.x + e.movementX,
        y: position.y + e.movementY,
    };
    setPosition(newPosition);
    onDragEnd(newPosition);
  };

  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(false);
  };

  return (
    <svg x={position.x} y={position.y}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: dragging ? 'grabbing' : 'grab', overflow: 'visible' }}
    >
      {children}
    </svg>
  );
};

export default Draggable;
