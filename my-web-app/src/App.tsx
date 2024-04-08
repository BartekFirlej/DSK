import React, { useState, useRef, useEffect } from "react";
import Menu from "./Menu";
import ExternalEvent from "./ExternalEvent";
import TopEvent from "./TopEvent";
import BasicEvent from "./BasicEvent";
import OrGate from "./OrGate";
import AndGate from "./AndGate";
import Condition from "./Condition";
import Line, { LineProps, LineRef } from "./Line";
import FTANode from "./FTANode";
import "./App.css";

const App: React.FC = () => {
  const lineRef = useRef<LineRef>(null);
  const [allNodes, setAllNodes] = useState<FTANode[]>([]);

  const [connections, setConnections] = useState<
    Array<{
      id: string;
      parent: string;
      child: string;
      startPosition: { x: number; y: number };
      endPosition: { x: number; y: number };
      children?: FTANode[];
    }>
  >([]);

  const [name, setName] = useState("");
  const [probability, setProbability] = useState(0);

  const handleAddTopEvent = () => {
    if (name) {
      const newTopEvent = {
        id: "event" + (allNodes.length + 1),
        label: name,
        position: { x: 350, y: 50 + allNodes.length * 60 },
        probability: 0,
        type: "topEvent" as "topEvent",
      };
      setAllNodes([...allNodes, newTopEvent]);
    } else {
      alert("No name value.");
    }
  };

  const handleAddGate = (gateType: "AND" | "OR" | "NOT") => {
    if (gateType === "OR") {
      const newGate = {
        id: `orGate${allNodes.length + 1}`,
        label: `OR${allNodes.length + 1}`,
        type: "orGate" as "orGate",
        position: { x: 200 + allNodes.length * 100, y: 300 },
        probability: 0,
      };
      setAllNodes([...allNodes, newGate]);
    } else if (gateType === "AND") {
      const newGate = {
        id: `andGate${allNodes.length + 1}`,
        label: `AND${allNodes.length + 1}`,
        type: "andGate" as "andGate",
        position: { x: 100 + allNodes.length * 100, y: 200 },
        probability: 0,
      };
      setAllNodes([...allNodes, newGate]);
    }
  };

  const handleAddBasicEvent = () => {
    if (name && probability > 0 && probability <= 1) {
      const newEvent = {
        id: `basicEvent${allNodes.length + 1}`,
        label: name,
        type: "basicEvent" as "basicEvent",
        position: { x: 150 + allNodes.length * 100, y: 200 },
        probability: probability,
      };
      setAllNodes([...allNodes, newEvent]);
    } else {
      alert("No name or wrong probability value.");
    }
  };

  const handleAddExternalEvent = () => {
    if (name && probability > 0 && probability <= 1) {
      const newEvent = {
        id: `externalEvent${allNodes.length + 1}`,
        label: name,
        type: "externalEvent" as "externalEvent",
        position: { x: 100 + allNodes.length * 100, y: 300 },
        probability: probability,
      };
      setAllNodes([...allNodes, newEvent]);
    } else {
      alert("No name or wrong probability value.");
    }
    console.log(allNodes);
  };

  const handleAddCondition = () => {
    const newCondition = {
      id: `condition${allNodes.length + 1}`,
      label: "New Condition",
      type: "condition" as "condition",
      probability: 0,
      position: { x: 50 + allNodes.length * 150, y: 200 },
    };
    setAllNodes([...allNodes, newCondition]);
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
  
    const updatedAllNodes = allNodes.map((event) =>
      event.id === id ? { ...event, position: newPosition } : event
    );
  
    setAllNodes(updatedAllNodes);
  };
  

  const getNodePositionById = (id: string) => {
    var element = allNodes.find((element) => element.id === id);
    return element ? element.position : null;
  };

  const getNodeProbabilityById = (id: string) => {
    var element = allNodes.find((element) => element.id === id);
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

    const topEventIds = allNodes
      .filter((event) => event.type === "topEvent")
      .map((event) => event.id);
    if (topEventIds.includes(fromId)) {
      const isChildConnectionExists = connections.some(
        (conn) => conn.parent === fromId
      );
      if (isChildConnectionExists) {
        alert("A top event already has connection.");
        return false;
      }
    }

    const isChildTopEvent = allNodes.some(
      (event) => event.type == "topEvent" && event.id === toId
    );
    if (isChildTopEvent) {
      alert("A top event cannot be a child in any connection.");
      return false;
    }
    return true;
  }

  function calculateProbabilities() {
    /* setOrGates((orGates) =>
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
    ); */
  }

  function getChildProbability(childId: string) {
    const child = allNodes.find((element) => element.id === childId);
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
        setConnections([...connections, newConnection]);
        console.log("Connection created:", newConnection);
        console.log(allNodes);
        calculateProbabilities();

        /*const updatedTopEvents = allNodes.map((event) => {
          if (event.id === fromId) {
            const updatedChildren = event.children ? [...event.children] : [];
            updatedChildren.push({
              id: toId,
              label: "", // You might want to find the child node to get its label and other properties
              probability: 0, // Same here, get actual data from the child node
              type: "", // Determine based on the child node
              position: childPosition,
              children: [], // Initially, children are likely to be empty
            });
            return { ...event, children: updatedChildren };
          }
          return event;
        });

        const { nodeMap, rootNodes } = constructFTATree();

        rootNodes.forEach((root) => console.log("Root node ID:", root.id));*/
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

    allNodes.filter((event) => event.id !== elementId);

    /* setTopEvents((prevEvents) =>
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
    ); */
  }

  const constructFTATree = () => {
    const nodeMap = new Map<string, FTANode>(
      allNodes.map((node) => [node.id, { ...node, children: [] }])
    );

    connections.forEach(({ parent, child }) => {
      const parentNode = nodeMap.get(parent);
      const childNode = nodeMap.get(child);
      if (parentNode && childNode) {
        parentNode.children = [...(parentNode.children || []), childNode];
      }
    });

    const rootNodes = allNodes.filter(
      ({ id }) => !connections.some(({ child }) => child === id)
    );
    rootNodes.forEach((root) => traverseTree(root));
    return { nodeMap, rootNodes };
  };

  // Recursive function to traverse the tree from a given node
  function traverseTree(node: FTANode): void {
    // Perform the action on the current node
    //console.log(
      //`Visiting node ${node.id}: ${node.label}, Type: ${node.type}, Probability: ${node.probability}, Children: ${node.children}`
    //);

    // Recursively visit each child node
    node.children?.forEach((child) => traverseTree(child));
  }

  const { nodeMap, rootNodes } = constructFTATree();

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
            {allNodes.map((element) => (
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
            {allNodes.map((element) => (
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
              {allNodes.find(node => node.id === connection.parent)?.label} <p>---&gt;</p> {allNodes.find(node => node.id === connection.child)?.label}
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
            {allNodes.map((element) => (
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
        <svg width="99%" height="800" style={{ border: "2px solid black" }}>
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
          {allNodes.map((node) => {
            switch (node.type) {
              case "topEvent":
                return (
                  <TopEvent
                    key={node.id}
                    id={node.id}
                    label={node.label}
                    probability={node.probability}
                    position={node.position}
                    type={node.type}
                    onDragEnd={handleDragEnd}
                  />
                );
              case "basicEvent":
                return (
                  <BasicEvent
                    key={node.id}
                    id={node.id}
                    label={node.label}
                    probability={node.probability}
                    position={node.position}
                    type={node.type}
                    onDragEnd={handleDragEnd}
                  />
                );
              case "externalEvent":
                return (
                  <ExternalEvent
                    key={node.id}
                    id={node.id}
                    label={node.label}
                    probability={node.probability}
                    position={node.position}
                    type={node.type}
                    onDragEnd={handleDragEnd}
                  />
                );
              case "orGate":
                return (
                  <OrGate
                    key={node.id}
                    id={node.id}
                    label={node.label}
                    position={node.position}
                    probability={node.probability}
                    type={node.type}
                    onDragEnd={handleDragEnd}
                  />
                );
              case "andGate":
                return (
                  <AndGate
                    key={node.id}
                    id={node.id}
                    label={node.label}
                    position={node.position}
                    probability={node.probability}
                    type={node.type}
                    onDragEnd={handleDragEnd}
                  />
                );
              case "condition":
                return (
                  <Condition
                    key={node.id}
                    {...node}
                    onDragEnd={handleDragEnd}
                  />
                );
              default:
                console.warn(`Unknown node type: ${node.type}`);
                return null;
            }
          })}

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
