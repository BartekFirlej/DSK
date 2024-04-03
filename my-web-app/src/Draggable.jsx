import React, { useState } from 'react';

const Draggable = ({ initialPosition, children }) => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);

  const handleMouseDown = (e) => {
    setDragging(true);
    // To prevent the default action (selection) on drag start
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      // Using a functional update to correctly calculate the new position based on the previous position
      setPosition(prevPos => ({
        x: prevPos.x + e.movementX,
        y: prevPos.y + e.movementY,
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <svg x={position.x} y={position.y}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Optionally stop dragging if the mouse leaves the draggable area
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
    >
      {children}
    </svg>
  );
};

export default Draggable;
