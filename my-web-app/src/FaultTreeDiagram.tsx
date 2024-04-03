import React, { useRef } from 'react';

const FaultTreeDiagram: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  return (
    <svg ref={ref} width="1600" height="900" style={{ border: '1px solid black', backgroundColor: '#f0f0f0' }}></svg>
  );
};

export default FaultTreeDiagram;
