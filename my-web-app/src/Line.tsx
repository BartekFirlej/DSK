import React, { useState, useImperativeHandle, forwardRef } from "react";

export interface LineProps {
  id: string;
  parent: string;
  child: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
}

export interface LineRef {
  update: (
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number }
  ) => void;
}

const Line = forwardRef<LineRef, LineProps>(
  ({ id, startPosition, endPosition, parent, child }, ref) => {
    return (
      <line
        id={id.toString()}
        x1={startPosition.x}
        y1={startPosition.y}
        x2={endPosition.x}
        y2={endPosition.y}
        stroke="black"
        strokeWidth="2"
      />
    );
  }
);

export default Line;
