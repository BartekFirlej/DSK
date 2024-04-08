interface FTANode {
    id: string;
    label: string;
    probability: number; 
    position: { x: number; y: number };
    type: string;
    children?: FTANode[]; 
  }

export default FTANode;