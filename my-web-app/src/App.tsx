import React, { useState }  from 'react';
import Menu from './Menu'; 
import ExternalEvent from './ExternalEvent';
import TopEvent from './TopEvent';
import BasicEvent from './BasicEvent';
import OrGate  from './OrGate';
import AndGate from './AndGate';
import Condition from './Condition';

const App: React.FC = () => {

  const [topEvents, setTopEvents] = useState<Array<{ id: string; label: string; position: { x: number; y: number; } }>>([]);
  const [basicEvents, setBasicEvents] = useState<Array<{ id: string; label: string; position: { x: number; y: number } }>>([]);
  const [externalEvents, setExternalEvents] = useState<Array<{ id: string; label: string; position: { x: number; y: number } }>>([]);
  const [orGates, setOrGates] = useState<Array<{ id: string; position: { x: number; y: number } }>>([]);
  const [andGates, setAndGates] = useState<Array<{ id: string; position: { x: number; y: number } }>>([]);
  const [conditions, setConditions] = useState<Array<{ id: string; label: string; position: { x: number; y: number } }>>([]);


  const handleAddTopEvent = () => {
    const newTopEvent = { id: "event" + (topEvents.length + 1), label: "System Failure", position: { x: 350, y: 50 + (topEvents.length * 60) } };
    setTopEvents([...topEvents, newTopEvent]);
  };

  const handleAddGate = (gateType: 'AND' | 'OR' | 'NOT') => {
    if (gateType === 'OR'){
      const newGate = { id: `orGate${orGates.length + 1}`, position: { x: 200 + (orGates.length * 100), y: 500 } };
      setOrGates([...orGates, newGate]);
    }
    else if(gateType === 'AND'){
      const newGate = { id: `andGate${andGates.length + 1}`, position: { x: 100 + (andGates.length * 100), y: 400 } };
      setAndGates([...andGates, newGate]);
    }
  };

  const handleAddBasicEvent = () => {
    const newEvent = { id: `basicEvent${basicEvents.length + 1}`, label: "Basic Event", position: { x: 150 + (basicEvents.length * 100), y: 200 } };
    setBasicEvents([...basicEvents, newEvent]);
  };

  const handleAddExternalEvent = () => {
    const newEvent = { id: `externalEvent${externalEvents.length + 1}`, label: "External Event", position: { x: 100 + (externalEvents.length * 100), y: 300 } };
    setExternalEvents([...externalEvents, newEvent]);
  };

  const handleAddCondition = () => {
    const newCondition = { id: `condition${conditions.length + 1}`, label: "New Condition", position: { x: 50 + (conditions.length * 150), y: 600 } };
    setConditions([...conditions, newCondition]);
  };
  

  return (
    <div className="app-container">
      <Menu
        onAddTopEvent={handleAddTopEvent}
        onAddGate={handleAddGate}
        onAddBasicEvent={handleAddBasicEvent}
        onAddExternalEvent={handleAddExternalEvent}
        onAddCondition={handleAddCondition}
      />
      <h2>Fault Tree Analysis Diagram</h2>
      <div className="diagram-container"> {}
        <svg width="1600" height="800" style={{ border: '2px solid black' }}>
          {topEvents.map(event => (
            <TopEvent key={event.id} id={event.id} label={event.label} position={event.position} />
          ))}
          {basicEvents.map(event => (
            <BasicEvent key={event.id} id={event.id} label={event.label} position={event.position} />
          ))}
          {externalEvents.map(event => (
            <ExternalEvent key={event.id} id={event.id} label={event.label} position={event.position} />
          ))}
          {orGates.map(gate => (
            <OrGate key={gate.id} id={gate.id} position={gate.position} />
          ))}
          {andGates.map(gate => (
            <AndGate key={gate.id} id={gate.id} position={gate.position} />
          ))}
          {conditions.map(condition => (
            <Condition key={condition.id} {...condition} />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default App;