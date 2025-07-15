import { describe, it, assert } from "vitest";
import { Graph, GraphNode } from "../../src/collections/graph.js";

describe("Graph", () => {
  it("should add nodes and edges (undirected)", () => {
    const graph = new Graph<number>();
    const a = graph.addNode(1);
    const b = graph.addNode(2);
    const c = graph.addNode(3);

    graph.addEdge(a, b);
    graph.addEdge(b, c);

    assert.strictEqual(graph.hasNode(a), true);
    assert.strictEqual(graph.hasNode(b), true);
    assert.strictEqual(graph.hasNode(c), true);

    assert.deepStrictEqual(Array.from(graph.neighbors(a)), [b]);
    assert.deepStrictEqual(Array.from(graph.neighbors(b)).sort((x, y) => x.value - y.value), [a, c]);
    assert.deepStrictEqual(Array.from(graph.neighbors(c)), [b]);
  });

  it("should add edges only if nodes exist", () => {
    const graph = new Graph<number>();
    const a = graph.addNode(1);
    const b = new GraphNode(2);
    assert.throws(() => graph.addEdge(a, b));
  });

  it("should remove edges", () => {
    const graph = new Graph<number>();
    const a = graph.addNode(1);
    const b = graph.addNode(2);
    graph.addEdge(a, b);
    graph.removeEdge(a, b);
    assert.deepStrictEqual(Array.from(graph.neighbors(a)), []);
    assert.deepStrictEqual(Array.from(graph.neighbors(b)), []);
  });

  it("should remove nodes", () => {
    const graph = new Graph<number>();
    const a = graph.addNode(1);
    const b = graph.addNode(2);
    graph.addEdge(a, b);
    graph.removeNode(a);
    assert.strictEqual(graph.hasNode(a), false);
    assert.deepStrictEqual(Array.from(graph.neighbors(b)), []);
  });

  it("should traverse with BFS", () => {
    const graph = new Graph<number>();
    const a = graph.addNode(1);
    const b = graph.addNode(2);
    const c = graph.addNode(3);
    const d = graph.addNode(4);
    graph.addEdge(a, b);
    graph.addEdge(b, c);
    graph.addEdge(c, d);

    const bfsOrder = Array.from(graph.bfs(a)).map(n => n.value);
    assert.deepStrictEqual(bfsOrder, [1, 2, 3, 4]);
  });

  it("should traverse with DFS", () => {
    const graph = new Graph<number>();
    const a = graph.addNode(1);
    const b = graph.addNode(2);
    const c = graph.addNode(3);
    const d = graph.addNode(4);
    graph.addEdge(a, b);
    graph.addEdge(b, c);
    graph.addEdge(c, d);

    const dfsOrder = Array.from(graph.dfs(a)).map(n => n.value);
    // DFS order may vary, but for this structure, it should be [1,2,3,4]
    assert.deepStrictEqual(dfsOrder, [1, 2, 3, 4]);
  });

  it("should support directed graphs", () => {
    const graph = new Graph<number>(true);
    const a = graph.addNode(1);
    const b = graph.addNode(2);
    graph.addEdge(a, b);
    assert.deepStrictEqual(Array.from(graph.neighbors(a)), [b]);
    assert.deepStrictEqual(Array.from(graph.neighbors(b)), []);
  });
});
