export class GraphNode<T> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }
}

export class Graph<T> {
  private _adjacency = new Map<GraphNode<T>, Set<GraphNode<T>>>();
  private _nodes = new Set<GraphNode<T>>();
  private _directed: boolean;

  constructor(directed = false) {
    this._directed = directed;
  }

  addNode(value: T): GraphNode<T> {
    const node = new GraphNode(value);
    this._nodes.add(node);
    this._adjacency.set(node, new Set());
    return node;
  }

  addEdge(from: GraphNode<T>, to: GraphNode<T>): void {
    if (!this._adjacency.has(from) || !this._adjacency.has(to)) {
      throw new Error("Both nodes must be in the graph");
    }
    this._adjacency.get(from)!.add(to);
    if (!this._directed) {
      this._adjacency.get(to)!.add(from);
    }
  }

  removeEdge(from: GraphNode<T>, to: GraphNode<T>): void {
    this._adjacency.get(from)?.delete(to);
    if (!this._directed) {
      this._adjacency.get(to)?.delete(from);
    }
  }

  removeNode(node: GraphNode<T>): void {
    this._adjacency.delete(node);
    for (const neighbors of this._adjacency.values()) {
      neighbors.delete(node);
    }
    this._nodes.delete(node);
  }

  neighbors(node: GraphNode<T>): Set<GraphNode<T>> {
    return this._adjacency.get(node) ?? new Set();
  }

  hasNode(node: GraphNode<T>): boolean {
    return this._nodes.has(node);
  }

  get nodes(): Iterable<GraphNode<T>> {
    return this._nodes;
  }

  // Example: Breadth-First Search traversal
  *bfs(start: GraphNode<T>): Iterable<GraphNode<T>> {
    const visited = new Set<GraphNode<T>>();
    const queue: GraphNode<T>[] = [start];
    visited.add(start);
    while (queue.length > 0) {
      const node = queue.shift()!;
      yield node;
      for (const neighbor of this.neighbors(node)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }

  // Example: Depth-First Search traversal
  *dfs(start: GraphNode<T>): Iterable<GraphNode<T>> {
    const visited = new Set<GraphNode<T>>();
    function* visit(this: Graph<T>, node: GraphNode<T>): Iterable<GraphNode<T>> {
      if (visited.has(node)) return;
      visited.add(node);
      yield node;
      for (const neighbor of this.neighbors(node)) {
        yield* visit.call(this, neighbor);
      }
    }
    yield* visit.call(this, start);
  }
}
