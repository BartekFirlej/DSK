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
import Graph from "./Graph";
import "./App.css";

const App: React.FC = () => {
  const lineRef = useRef<LineRef>(null);
  const [allNodes, setAllNodes] = useState<FTANode[]>([]);
  const allNodesMap: Map<string, FTANode> = new Map();

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
      const hasTopEvent = allNodes.some((node) => node.type === "topEvent");

      if (hasTopEvent) {
        alert("Istnieje węzeł typu topEvent.");
        return;
      }
      const newTopEvent = {
        id: "event" + (allNodes.length + 1),
        label: name,
        position: { x: 350, y: 50 + allNodes.length * 60 },
        probability: 0,
        type: "topEvent" as "topEvent",
        children: [],
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
        children: [],
      };
      setAllNodes([...allNodes, newGate]);
    } else if (gateType === "AND") {
      const newGate = {
        id: `andGate${allNodes.length + 1}`,
        label: `AND${allNodes.length + 1}`,
        type: "andGate" as "andGate",
        position: { x: 100 + allNodes.length * 100, y: 200 },
        probability: 0,
        children: [],
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
        children: [],
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
        children: [],
      };
      setAllNodes([...allNodes, newEvent]);
    } else {
      alert("No name or wrong probability value.");
    }
    console.log(allNodes);
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

  function getChildProbability(childId: string) {
    const child = allNodes.find((element) => element.id === childId);
    return child?.probability;
  }

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

  function findLongestPathLength(): number {
    const graph: { [parent: string]: string[] } = {};
    connections.forEach(({ parent, child }) => {
      if (graph[parent]) {
        graph[parent].push(child);
      } else {
        graph[parent] = [child];
      }
    });

    function dfs(
      node: string,
      visited: Set<string>,
      currentLength: number
    ): number {
      visited.add(node);
      let maxLength = currentLength;
      const neighbors = graph[node] || [];
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          maxLength = Math.max(
            maxLength,
            dfs(neighbor, new Set(visited), currentLength + 1)
          );
        }
      });
      return maxLength;
    }

    let maxPathLength = 0;
    Object.keys(graph).forEach((node) => {
      maxPathLength = Math.max(maxPathLength, dfs(node, new Set<string>(), 1));
    });

    return maxPathLength;
  }

  const findMCSForTopEvent = (): string[][] => {
    const graph = new Map<string, string[]>();
    connections.forEach(({ parent, child }) => {
      if (!graph.has(parent)) {
        graph.set(parent, []);
      }
      graph.get(parent)?.push(child);
    });

    const dfs = (nodeId: string): string[][] => {
      const node = allNodes.find((node) => node.id === nodeId);
      if (!node) {
        return [];
      }
      if (node.type === "basicEvent") {
        return [[node.label]];
      }

      const childrenIds = graph.get(nodeId) || [];
      let mcsPaths: string[][] = [];

      if (node.type === "andGate") {
        mcsPaths = childrenIds.reduce<string[][]>((acc, childId, index) => {
          const childMCS = dfs(childId);
          return index === 0
            ? childMCS
            : acc.flatMap((accPath) =>
                childMCS.map((path) => [...accPath, ...path])
              );
        }, []);
      } else {
        childrenIds.forEach((childId) => {
          mcsPaths.push(...dfs(childId));
        });
      }

      return mcsPaths;
    };

    const topEventNode = allNodes.find((node) => node.type === "topEvent");
    if (!topEventNode) {
      console.warn("No topEvent node found in the given allNodes array.");
      return [];
    }

    return dfs(topEventNode.id);
  };

  const handleFindMCSForTopEvent = (): void => {
    const mcsResults = findMCSForTopEvent();
    const mcsResultsString = mcsResults
      .map((path, index) => `${index + 1}: ${path.join(", ")}`)
      .join("\n");
    const mcsOutputElement = document.getElementById(
      "MCS"
    ) as HTMLTextAreaElement;
    if (mcsOutputElement) {
      mcsOutputElement.value = mcsResultsString;
    }
  };

  const findFailurePaths = (): string[][] => {
    const graph = new Map<string, string[]>();

    connections.forEach(({ parent, child }) => {
      if (!graph.has(parent)) {
        graph.set(parent, []);
      }
      graph.get(parent)?.push(child);
    });

    const dfs = (nodeId: string, path: string[] = []): string[][] => {
      const node = allNodes.find((n) => n.id === nodeId);
      if (!node) return [];

      // Tworzymy opis aktualnego węzła na potrzeby ścieżki
      let nodeDescription =
        node.type === "basicEvent" ? node.label : `${node.type}${node.id}`;

      // Dołączamy opis węzła do ścieżki
      const newPath = [...path, nodeDescription];

      if (node.type === "basicEvent" || node.type ==="externalEvent") {
        // Jeśli to zdarzenie bazowe, zwracamy ścieżkę zawierającą tylko ten węzeł
        return [newPath];
      }

      const childrenIds = graph.get(nodeId) || [];
      let paths: string[][] = [];

      if (node.type === "andGate" || node.type === "orGate" || node.type === "topEvent") {
        // Dla bramek AND i OR, kontynuujemy przeszukiwanie dla każdego dziecka
        childrenIds.forEach((childId) => {
          const childPaths = dfs(childId, newPath);
          paths.push(...childPaths);
        });

        // Jeśli bramka nie ma dzieci, zwracamy aktualną ścieżkę
        if (childrenIds.length === 0) {
          return [newPath];
        }
      } else {
        console.warn(`Unsupported node type: ${node.type}`);
      }

      return paths;
    };

    // Znajdowanie topEvent i rozpoczęcie przeszukiwania od jego dzieci
    const topEventNode = allNodes.find((n) => n.type === "topEvent");
    if (!topEventNode) {
      console.warn("No topEvent node found in the given allNodes array.");
      return [];
    }

    return dfs(topEventNode.id);
  };

  const handleFindFailurePaths = (): void => {
    const failurePaths = findFailurePaths();
    const outputElement = document.getElementById(
      "MTS"
    ) as HTMLTextAreaElement | null;
    if (outputElement) {
      console.log(failurePaths)
      const formattedPaths = failurePaths
        .map((path) => path.join(" -> "))
        .join("\n");
      outputElement.value = formattedPaths;
    } else {
      console.warn("Output element not found");
    }
  };

  function handleCalculateProbabilities() {
    var depth = findLongestPathLength();
    for (let i = 0; i < depth; i++) {
      setAllNodes((currentAllNodes) =>
        currentAllNodes.map((node) => {
          const childConnections = connections.filter(
            (conn) => conn.parent === node.id
          );
          let probability = node.probability;
          if (node.type === "orGate") {
            probability =
              1 -
              childConnections.reduce((acc, conn) => {
                const childProbability = getChildProbability(conn.child) || 0;
                return acc * (1 - childProbability);
              }, 1);
          } else if (node.type === "andGate") {
            probability = childConnections.reduce((acc, conn) => {
              const childProbability = getChildProbability(conn.child) || 1;
              return acc * childProbability;
            }, 1);
          } else if (node.type === "topEvent") {
            const childConnection = childConnections[0];
            if (childConnection) {
              probability = getChildProbability(childConnection.child) || 0;
            }
          }
          return { ...node, probability };
        })
      );
    }
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

    setAllNodes((prevAllNodes) =>
      prevAllNodes.filter((node) => node.id !== elementId)
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
                {allNodes.find((node) => node.id === connection.parent)?.label}{" "}
                <p>---&gt;</p>{" "}
                {allNodes.find((node) => node.id === connection.child)?.label}
              </option>
            ))}
          </select>

          <button type="submit">Delete Connection</button>
        </form>

        <form onSubmit={handleDeleteElement}>
          <select
            value={selectedElement}
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

        <button onClick={handleCalculateProbabilities}>
          Calculate Probabilities
        </button>

        <button onClick={handleFindMCSForTopEvent}>Calculate MCS</button>

        <button onClick={handleFindFailurePaths}>
          Calculate Failure Paths
        </button>
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
      <div className="panel">
        <h2>Minimal Cut Sets</h2>
        <textarea
          id="MCS"
          rows={20}
          cols={80}
          placeholder="Enter text here..."
        ></textarea>
      </div>
      <div className="panel">
        <h2>Failure Paths</h2>
        <textarea
          id="MTS"
          rows={20}
          cols={80}
          placeholder="Enter text here..."
        ></textarea>
      </div>
    </div>
  );
};
export default App;
