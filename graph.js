//impl of graph as adj lists

export class Graph {

    #graph;
    #vertices;
    #edges;
    #type;

    constructor(){     
         
        this.#graph = [];
        this.#vertices = new Map();
        this.#edges = new Map();
        this.#type = 'directed'; //default type
    }

    addVertex(id,htmlElement) {

        this.#graph.push(new Map());
        this.#vertices.set(id,new Vertex(id,htmlElement));
    }

    addEdge(sourceId,targetId){

        if(this.getNeighbours(sourceId).has(targetId))
            return false;

        const edgeId = `${sourceId.toString()}-${targetId.toString()}`;
        const edgeId2 = `${targetId.toString()}-${sourceId.toString()}`;

        this.getNeighbours(sourceId).set(targetId,this.getVertex(targetId));
        this.#edges.set(edgeId,new Edge(edgeId));

        if(this.#type === 'undirected'){

            this.getNeighbours(targetId).set(sourceId,this.getVertex(sourceId));
            this.#edges.set(edgeId2,new Edge(edgeId2));
        }

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

    getEdges(){

        return this.#edges;
    }

    getSize(){

        return this.#graph.length;
    }

    reset(){

        this.#graph =[];
        this.#vertices.clear();
        this.#edges.clear();
    }

    setType(type){

        this.#type = type;
    }

    getType()
    {
        return this.#type;
    }
    setType(type){

        this.#type = type;
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
        this.vertices = id.split('-');
    }
    setHtmlElement(htmlElement){

        this.htmlElement = htmlElement;
    }
}
