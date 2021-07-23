//impl of graph as adj lists

export class Graph {

    #graph;
    #vertices;
    #edges;

    constructor(){     
         
        this.#graph = [];
        this.#vertices = new Map();
        this.#edges = new Map();
    }

    addVertex(id,htmlElement) {

        this.#graph.push(new Map());
        this.#vertices.set(id,new Vertex(id,htmlElement));
    }

    addEdge(sourceId,targetId){

        if(this.getNeighbours(sourceId).has(targetId))
            return false;
        this.getNeighbours(sourceId).set(targetId,this.getVertex(targetId));
        const edgeId = `${sourceId.toString()}-${targetId.toString()}`;
        this.#edges.set(edgeId,new Edge(edgeId));
        return true;
    }

    getNeighbours(vertexId){

        return this.#graph[vertexId]; 
    }

    getVertex(id){

        return this.#vertices.get(id);
    }

    getEdge(id){

        return this.#edges.get(id);
    }

    getVertices(){

        return this.#vertices;
    }

    getSize(){

        return this.#graph.length;
    }
}
//impl of vertex

export class Vertex {

    constructor(id,htmlElement){
        this.id = id;
        this.visited = false;
        this.parent = null;
        this.htmlElement = htmlElement;
        this.dist = Number.MAX_SAFE_INTEGER;
    }
}

//impl of edge

export class Edge {

    constructor(id){
        this.id = id;
        this.weight = 1;
    }
    setHtmlElement(htmlElement){

        this.htmlElement = htmlElement;
    }
}
