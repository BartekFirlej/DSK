import React, { useState, useRef }  from 'react';
import Menu from './Menu'; 
import ExternalEvent from './ExternalEvent';
import TopEvent from './TopEvent';
import BasicEvent from './BasicEvent';
import OrGate  from './OrGate';
import AndGate from './AndGate';
import Condition from './Condition';
import Line, { LineRef } from './Line';

const App: React.FC = () => {
  const lineRef = useRef<LineRef>(null);

  const [linePositions, setLinePositions] = useState<{ [key: string]: { start: { x: number; y: number }; end: { x: number; y: number } } }>({});


  const [topEvents, setTopEvents] = useState<Array<{ id: string; label: string; position: { x: number; y: number; } }>>([]);
  const [basicEvents, setBasicEvents] = useState<Array<{ id: string; label: string; position: { x: number; y: number } }>>([]);
  const [externalEvents, setExternalEvents] = useState<Array<{ id: string; label: string; position: { x: number; y: number } }>>([]);
  const [orGates, setOrGates] = useState<Array<{ id: string; position: { x: number; y: number } }>>([]);
  const [andGates, setAndGates] = useState<Array<{ id: string; position: { x: number; y: number } }>>([]);
  const [conditions, setConditions] = useState<Array<{ id: string; label: string; position: { x: number; y: number } }>>([]);
  const [connections, setConnections] = useState<Array<{
    id: string;
    parent: string;
    child: string;
    startPosition: { x: number; y: number };
    endPosition: { x: number; y: number };
  }>>([
    {
      id: '1',
      parent: 'event1',
      child: 'orGate1',
      startPosition: { x: 350, y: 50 },
      endPosition: { x: 200, y: 300 }
    }
  ]);
  
  
  const handleAddTopEvent = () => {
    const newTopEvent = { id: "event" + (topEvents.length + 1), label: "System Failure", position: { x: 350, y: 50 + (topEvents.length * 60) } };
    setTopEvents([...topEvents, newTopEvent]);
  };

  const handleAddGate = (gateType: 'AND' | 'OR' | 'NOT') => {
    if (gateType === 'OR'){
      const newGate = { id: `orGate${orGates.length + 1}`, position: { x: 200 + (orGates.length * 100), y: 300 } };
      setOrGates([...orGates, newGate]);
    }
    else if(gateType === 'AND'){
      const newGate = { id: `andGate${andGates.length + 1}`, position: { x: 100 + (andGates.length * 100), y: 200 } };
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
    const newCondition = { id: `condition${conditions.length + 1}`, label: "New Condition", position: { x: 50 + (conditions.length * 150), y: 200 } };
    setConditions([...conditions, newCondition]);
  };

  var handleDragEnd = (id: string, newPosition: { x: number; y: number }) => {
    console.log('NOWA POZYCJAAA x: ' + newPosition.x + ', y: ' + newPosition.y);
    const updatedLinePositions = { ...linePositions };
    console.log(connections);
  
    connections.forEach(connection => {
      if (connection.parent === id) {
        console.log('Parent');
        const updatedConnections = connections.map(c => {
          if (c.id === connection.id) {
            return { ...c, startPosition: newPosition };
          } else {
            return c;
          }
        });
        setConnections(updatedConnections);
      } else if (connection.child === id) {
        console.log('Child');
        const updatedConnections = connections.map(c => {
          if (c.id === connection.id) {
            return { ...c, endPosition: newPosition };
          } else {
            return c;
          }
        });
        setConnections(updatedConnections);
      }
    });
  };



  const updateLinePositions = () => {
    if (lineRef.current) {
      lineRef.current.update({ x: 10, y: 20 }, { x: 30, y: 40 });
    }
  };
  
  const getNodePositionById = (id: string) => {
    const allElements = [
      ...topEvents,
      ...basicEvents,
      ...externalEvents,
      ...orGates,
      ...andGates,
      ...conditions,
    ];
  
    const element = allElements.find(element => element.id === id);
  
    return element ? element.position : null;
  };

  const getNodeById = (id: string) => {
    const allElements = [
      ...topEvents,
      ...basicEvents,
      ...externalEvents,
      ...orGates,
      ...andGates,
      ...conditions,
    ];
  
    const element = allElements.find(element => element.id === id);
  
    return element ? element : null;
  };

  const findConnectionsByNodeParentId = (id: string) => {
    const relevantConnections = connections.filter(connection => 
      connection.parent === id 
    );
    return relevantConnections;
  };

  const findConnectionsByNodeChildId = (id: string) => {
    const relevantConnections = connections.filter(connection => 
      connection.parent === id 
    );
    return relevantConnections;
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
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
              refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>
          {topEvents.map(event => (
            <TopEvent key={event.id} id={event.id} label={event.label} position={event.position} onDragEnd={handleDragEnd}/>
          ))}
          {basicEvents.map(event => (
            <BasicEvent key={event.id} id={event.id} label={event.label} position={event.position} onDragEnd={handleDragEnd}/>
          ))}
          {externalEvents.map(event => (
            <ExternalEvent key={event.id} id={event.id} label={event.label} position={event.position} onDragEnd={handleDragEnd}/>
          ))}
          {orGates.map(gate => (
            <OrGate key={gate.id} id={gate.id} position={gate.position} onDragEnd={handleDragEnd}/>
          ))}
          {andGates.map(gate => (
            <AndGate key={gate.id} id={gate.id} position={gate.position} onDragEnd={handleDragEnd}/>
          ))}
          {conditions.map(condition => (
            <Condition key={condition.id} {...condition} onDragEnd={handleDragEnd}/>
          ))}
          {connections.map((connection) => {
            const parentPosition = getNodePositionById(connection.parent);
            const childPosition = getNodePositionById(connection.child);
            if (parentPosition && childPosition) {
              console.log('RYSUJE LINIE')
              console.log(connections)
              return (
                  <svg>
                    <Line
                      id = {connection.id}
                      ref={lineRef}
                      startPosition={connection.startPosition}
                      endPosition={connection.endPosition}
                      parent = {connection.parent}
                      child = {connection.child}
                  />
                  </svg>
                );
            } else {
              console.warn(`Missing position for connection ${connection.id}`);
              return null;
            }
          })}
        </svg>
      </div>
    </div>
  );
};

export default App;