import React, { useState, useRef, useEffect } from "react";
import Menu from "./Menu";
import ExternalEvent from "./ExternalEvent";
import TopEvent from "./TopEvent";
import BasicEvent from "./BasicEvent";
import OrGate from "./OrGate";
import AndGate from "./AndGate";
import Condition from "./Condition";
import Line, { LineProps, LineRef } from "./Line";
import { convertToObject } from "typescript";
import "./App.css";

const App: React.FC = () => {
  const lineRef = useRef<LineRef>(null);
  const [topEvents, setTopEvents] = useState<
    Array<{
      id: string;
      label: string;
      probability: number;
      position: { x: number; y: number };
    }>
  >([]);
  const [basicEvents, setBasicEvents] = useState<
    Array<{
      id: string;
      label: string;
      probability: number;
      position: { x: number; y: number };
    }>
  >([]);
  const [externalEvents, setExternalEvents] = useState<
    Array<{
      id: string;
      label: string;
      probability: number;
      position: { x: number; y: number };
    }>
  >([]);
  const [orGates, setOrGates] = useState<
    Array<{
      id: string;
      label: string;
      probability: number;
      position: { x: number; y: number };
    }>
  >([]);
  const [andGates, setAndGates] = useState<
    Array<{
      id: string;
      label: string;
      probability: number;
      position: { x: number; y: number };
    }>
  >([]);
  const [conditions, setConditions] = useState<
    Array<{ id: string; label: string; position: { x: number; y: number } }>
  >([]);
  const [connections, setConnections] = useState<
    Array<{
      id: string;
      parent: string;
      child: string;
      startPosition: { x: number; y: number };
      endPosition: { x: number; y: number };
    }>
  >([]);

  const [name, setName] = useState("");
  const [probability, setProbability] = useState(0);

  const handleAddTopEvent = () => {
    if (name) {
      const newTopEvent = {
        id: "event" + (topEvents.length + 1),
        label: name,
        position: { x: 350, y: 50 + topEvents.length * 60 },
        probability: 0,
      };
      setTopEvents([...topEvents, newTopEvent]);
    } else {
      alert("No name value.");
    }
  };

  const handleAddGate = (gateType: "AND" | "OR" | "NOT") => {
    if (gateType === "OR") {
      const newGate = {
        id: `orGate${orGates.length + 1}`,
        label: `OR${orGates.length + 1}`,
        position: { x: 200 + orGates.length * 100, y: 300 },
        probability: 0,
      };
      setOrGates([...orGates, newGate]);
    } else if (gateType === "AND") {
      const newGate = {
        id: `andGate${andGates.length + 1}`,
        label: `AND${andGates.length + 1}`,
        position: { x: 100 + andGates.length * 100, y: 200 },
        probability: 0,
      };
      setAndGates([...andGates, newGate]);
    }
  };

  const handleAddBasicEvent = () => {
    if (name && probability > 0 && probability <= 1) {
      const newEvent = {
        id: `basicEvent${basicEvents.length + 1}`,
        label: name,
        position: { x: 150 + basicEvents.length * 100, y: 200 },
        probability: probability,
      };
      setBasicEvents([...basicEvents, newEvent]);
    } else {
      alert("No name or wrong probability value.");
    }
  };

  const handleAddExternalEvent = () => {
    if (name && probability > 0 && probability <= 1) {
      const newEvent = {
        id: `externalEvent${externalEvents.length + 1}`,
        label: name,
        position: { x: 100 + externalEvents.length * 100, y: 300 },
        probability: probability,
      };
      setExternalEvents([...externalEvents, newEvent]);
    } else {
      alert("No name or wrong probability value.");
    }
  };

  const handleAddCondition = () => {
    const newCondition = {
      id: `condition${conditions.length + 1}`,
      label: "New Condition",
      position: { x: 50 + conditions.length * 150, y: 200 },
    };
    setConditions([...conditions, newCondition]);
  };

  var handleDragEnd = (id: string, newPosition: { x: number; y: number }) => {
    const updatedConnections = connections.map((connection) => {
      if (connection.parent === id) {
        return { ...connection, startPosition: newPosition };
      } else if (connection.child === id) {
        return { ...connection, endPosition: newPosition };
      } else {
        return connection;
      }
    });

    setConnections(updatedConnections);
    setTopEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, position: newPosition } : event
      )
    );
    setBasicEvents((basicEvents) =>
      basicEvents.map((event) =>
        event.id === id ? { ...event, position: newPosition } : event
      )
    );
    setExternalEvents((externalEvents) =>
      externalEvents.map((event) =>
        event.id === id ? { ...event, position: newPosition } : event
      )
    );
    setOrGates((orGates) =>
      orGates.map((gate) =>
        gate.id === id ? { ...gate, position: newPosition } : gate
      )
    );
    setAndGates((andGates) =>
      andGates.map((gate) =>
        gate.id === id ? { ...gate, position: newPosition } : gate
      )
    );
    setConditions((conditions) =>
      conditions.map((condition) =>
        condition.id === id
          ? { ...condition, position: newPosition }
          : condition
      )
    );
  };

  const getNodePositionById = (id: string) => {
    var allElements = [
      ...topEvents,
      ...basicEvents,
      ...externalEvents,
      ...orGates,
      ...andGates,
      ...conditions,
    ];
    var element = allElements.find((element) => element.id === id);
    return element ? element.position : null;
  };

  const getNodeProbabilityById = (id: string) => {
    var allElements = [
      ...basicEvents,
      ...externalEvents,
      ...orGates,
      ...andGates,
    ];
    var element = allElements.find((element) => element.id === id);
    return element ? element.probability : 0;
  };

  function canCreateConnection(fromId: string, toId: string): boolean {
    if (fromId === toId) {
      alert("Cannot create a connection to the same element.");
      return false;
    }
    const exists = connections.some(
      (conn) =>
        (conn.parent === fromId && conn.child === toId) ||
        (conn.parent === toId && conn.child === fromId)
    );
    if (exists) {
      alert("Connection already exists.");
      return false;
    }
    const isFromIdTopEvent = topEvents.some((event) => event.id === fromId);
    if (isFromIdTopEvent) {
      const isChildConnectionExists = connections.some(
        (conn) => conn.parent === fromId
      );
      if (isChildConnectionExists) {
        alert("A top event already has connection.");
        return false;
      }
    }

    const isChildTopEvent = topEvents.some((event) => event.id === toId);
    if (isChildTopEvent) {
      alert("A top event cannot be a child in any connection.");
      return false;
    }
    return true;
  }

  function calculateProbabilities() {
    setOrGates((orGates) =>
      orGates.map((gate) => {
        const childConnections = connections.filter(
          (conn) => conn.parent === gate.id
        );
        const probability =
          1 -
          childConnections.reduce((acc, conn) => {
            const childProbability = getChildProbability(conn.child) || 0;
            return acc * (1 - childProbability);
          }, 1);
        return { ...gate, probability };
      })
    );

    setAndGates((andGates) =>
      andGates.map((gate) => {
        const childConnections = connections.filter(
          (conn) => conn.parent === gate.id
        );
        const probability = childConnections.reduce((acc, conn) => {
          const childProbability = getChildProbability(conn.child) || 1;
          return acc * childProbability;
        }, 1);
        return { ...gate, probability };
      })
    );

    setTopEvents((topEvents) =>
      topEvents.map((event) => {
        const childConnection = connections.find(
          (connection) => connection.parent === event.id
        );
        if (childConnection) {
          const probability =
            getNodeProbabilityById(childConnection.child) || 0;
          if (probability) {
            return { ...event, probability };
          }
        }
        return event;
      })
    );
  }

  function getChildProbability(childId: string) {
    const child = [
      ...basicEvents,
      ...externalEvents,
      ...andGates,
      ...orGates,
    ].find((element) => element.id === childId);
    return child?.probability;
  }

  function createConnection(fromId: string, toId: string): void {
    if (canCreateConnection(fromId, toId)) {
      const parentPosition = getNodePositionById(fromId);
      const childPosition = getNodePositionById(toId);
      if (parentPosition && childPosition) {
        const newConnection: LineProps = {
          id: `connection${connections.length + 1}`,
          parent: fromId,
          child: toId,
          startPosition: parentPosition,
          endPosition: childPosition,
        };
        connections.push(newConnection);
        console.log("Connection created:", newConnection);
        calculateProbabilities();
      } else {
        console.log("Cannot create connection.");
      }
    }
  }

  function deleteConnection(connectionId: string): void {
    setConnections((prevConnections) =>
      prevConnections.filter((connection) => connection.id !== connectionId)
    );
    console.log(`Connection with ID: ${connectionId} has been deleted.`);
    calculateProbabilities();
  }

  function deleteElement(elementId: string): void {
    const isReferencedInConnections = connections.some(
      (connection) =>
        connection.parent === elementId || connection.child === elementId
    );

    if (isReferencedInConnections) {
      alert(
        `Element with ID: ${elementId} is referenced in a connection and cannot be deleted.`
      );
      return;
    }

    setTopEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== elementId)
    );
    setBasicEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== elementId)
    );
    setExternalEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== elementId)
    );
    setOrGates((prevGates) =>
      prevGates.filter((gate) => gate.id !== elementId)
    );
    setAndGates((prevGates) =>
      prevGates.filter((gate) => gate.id !== elementId)
    );
    setConditions((prevConditions) =>
      prevConditions.filter((condition) => condition.id !== elementId)
    );
  }

  const [selectedElement1, setSelectedElement1] = useState("");
  const [selectedElement2, setSelectedElement2] = useState("");
  const [selectedConnection, setSelectedConnection] = useState("");
  const [selectedElement, setSelectedElement] = useState("");

  const handleCreateConnection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedElement1 && selectedElement2) {
      createConnection(selectedElement1, selectedElement2);
      setSelectedElement1("");
      setSelectedElement2("");
    } else {
      alert("Please select two elements to connect.");
    }
  };

  const handleDeleteConnection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedConnection) {
      deleteConnection(selectedConnection);
      setSelectedConnection("");
    } else {
      alert("Please select connection to delete.");
    }
  };

  const handleDeleteElement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedElement) {
      deleteElement(selectedElement);
      setSelectedElement1("");
    } else {
      alert("Please select element to delete.");
    }
  };

  return (
    <div className="app-container">
      <div className="panel">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Probability"
          value={probability}
          onChange={(e) => setProbability(Number(e.target.value))}
        />
        <Menu
          onAddTopEvent={handleAddTopEvent}
          onAddGate={handleAddGate}
          onAddBasicEvent={handleAddBasicEvent}
          onAddExternalEvent={handleAddExternalEvent}
          onAddCondition={handleAddCondition}
        />

        <form onSubmit={handleCreateConnection}>
          <select
            value={selectedElement1}
            onChange={(e) => setSelectedElement1(e.target.value)}
          >
            <option value="" disabled selected>
              Select Element 1
            </option>
            {[
              ...topEvents,
              ...basicEvents,
              ...externalEvents,
              ...orGates,
              ...andGates,
              ...conditions,
            ].map((element) => (
              <option key={element.id} value={element.id}>
                {element.label}
              </option>
            ))}
          </select>

          <select
            value={selectedElement2}
            onChange={(e) => setSelectedElement2(e.target.value)}
          >
            <option value="" disabled selected>
              Select Element 2
            </option>
            {[
              ...topEvents,
              ...basicEvents,
              ...externalEvents,
              ...orGates,
              ...andGates,
              ...conditions,
            ].map((element) => (
              <option key={element.id} value={element.id}>
                {element.label}
              </option>
            ))}
          </select>
          <button type="submit">Create Connection</button>
        </form>

        <form onSubmit={handleDeleteConnection}>
          <select
            value={selectedConnection}
            onChange={(e) => setSelectedConnection(e.target.value)}
          >
            <option value="" disabled selected>
              Select Connection{" "}
            </option>
            {connections.map((connection) => (
              <option key={connection.id} value={connection.id}>
                {connection.parent} {connection.child}
              </option>
            ))}
          </select>

          <button type="submit">Delete Connection</button>
        </form>

        <form onSubmit={handleDeleteElement}>
          <select
            value={selectedConnection}
            onChange={(e) => setSelectedElement(e.target.value)}
          >
            <option value="" disabled selected>
              Select Element
            </option>
            {[
              ...topEvents,
              ...basicEvents,
              ...externalEvents,
              ...orGates,
              ...andGates,
              ...conditions,
            ].map((element) => (
              <option key={element.id} value={element.id}>
                {element.label}
              </option>
            ))}
          </select>

          <button type="submit">Delete Element</button>
        </form>
      </div>
      <div className="diagram-container">
        <h2>Fault Tree Analysis Diagram</h2>
        <svg width="1800" height="800" style={{ border: "2px solid black" }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>
          {topEvents.map((event) => (
            <TopEvent
              key={event.id}
              id={event.id}
              label={event.label}
              probability={event.probability}
              position={event.position}
              onDragEnd={handleDragEnd}
            />
          ))}
          {basicEvents.map((event) => (
            <BasicEvent
              key={event.id}
              id={event.id}
              label={event.label}
              probability={event.probability}
              position={event.position}
              onDragEnd={handleDragEnd}
            />
          ))}
          {externalEvents.map((event) => (
            <ExternalEvent
              key={event.id}
              id={event.id}
              label={event.label}
              probability={event.probability}
              position={event.position}
              onDragEnd={handleDragEnd}
            />
          ))}
          {orGates.map((gate) => (
            <OrGate
              key={gate.id}
              id={gate.id}
              label={gate.label}
              position={gate.position}
              probability={gate.probability}
              onDragEnd={handleDragEnd}
            />
          ))}
          {andGates.map((gate) => (
            <AndGate
              key={gate.id}
              id={gate.id}
              label={gate.label}
              position={gate.position}
              probability={gate.probability}
              onDragEnd={handleDragEnd}
            />
          ))}
          {conditions.map((condition) => (
            <Condition
              key={condition.id}
              {...condition}
              onDragEnd={handleDragEnd}
            />
          ))}
          {connections.map((connection) => {
            var parentPosition = getNodePositionById(connection.parent);
            var childPosition = getNodePositionById(connection.child);
            if (parentPosition && childPosition) {
              return (
                <svg>
                  <Line
                    id={connection.id}
                    ref={lineRef}
                    startPosition={connection.startPosition}
                    endPosition={connection.endPosition}
                    parent={connection.parent}
                    child={connection.child}
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
