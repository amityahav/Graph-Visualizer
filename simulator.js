
import { Graph , Vertex } from "./graph.js"
import { DFS, BFS, cr } from "./Algorithms.js"


//global variables
let graph = new Graph();
const board = document.getElementById("board");
const resetBtn = document.getElementById("reset");
export const terminal = document.getElementById("terminal");
let activeBtn = null; 

//..DFS
const dfsBtn = document.getElementById("dfs");
//..BFS
const bfsBtn = document.getElementById("bfs");

const launchBtn = document.getElementById("launch");
const textBox = document.getElementById("textBox");

let from = {x: -1, y: -1, id: -1};



function idGenerator() {

    let count = 0;
    return () => count++;
}
const makeFreshId = idGenerator();

const graphReset = function() {

    const vertices = Array.from(graph.getVertices().values());

    vertices.forEach((vertex) => {

        vertex.parent = null;
        vertex.visited = false;
        vertex.dist = Number.MAX_SAFE_INTEGER;
        vertex.htmlElement.style.fill = 'red';
        vertex.htmlElement.style.stroke = 'black';
    });
}

//Event handlers

board.addEventListener('click',function(e) {
    //console.log(graph);
    if(e.target!=board) return;

    let id = makeFreshId();

    board.insertAdjacentHTML('afterbegin',`<g> <circle id=${id.toString()} class="vertex" cx=${e.clientX-230} cy=${e.clientY} r="20"></circle> 
    <text fill="white" x=${e.clientX-230} y=${e.clientY} font-size="20" text-anchor="middle" alignment-baseline="central">${id.toString()}</text> </g>`);
    const vertex = document.querySelector('.vertex');
    graph.addVertex(id,vertex);

    vertex.addEventListener('click',function(e) {

        const vertex_x = e.path[0].attributes[2].nodeValue;
        const vertex_y = e.path[0].attributes[3].nodeValue;

        if(from.id === id){ 
            vertex.classList.toggle("clicked");
            from.id = -1;
            return; // cant select the same v as src and target
        }
        if(from.id != -1){ // from is already selected
            if(!graph.addEdge(from.id,id)) {// return if edge already exists
                document.getElementById(from.id.toString()).classList.toggle("clicked");
                from.id = -1;
                return;
            }

            const edgeId = `${from.id.toString()}-${id.toString()}`;
            board.insertAdjacentHTML('afterbegin',
            `<line id=${edgeId} x1=${from.x} y1=${from.y} x2=${vertex_x} y2=${vertex_y} stroke="black" stroke-width ="3" marker-end="url(#arrowhead)"/>`)
            graph.getEdge(edgeId).setHtmlElement(document.getElementById(edgeId));
            document.getElementById(from.id.toString()).classList.toggle("clicked");
            from.id = -1;
       
        }else{ // select the source vertex
          from.id = id;
          from.x = vertex_x
          from.y = vertex_y
          vertex.classList.toggle("clicked");
        }
    });
});

dfsBtn.addEventListener('click',function(e){

    document.getElementById("txtLaunch").removeAttribute("hidden");
    if(activeBtn!=null)
        activeBtn.classList.toggle("active");
    activeBtn = e.target; 
    activeBtn.classList.toggle("active");
});

bfsBtn.addEventListener('click',function(e){

    document.getElementById("txtLaunch").removeAttribute("hidden");
    if(activeBtn!=null)
        activeBtn.classList.toggle("active");
    activeBtn = e.target; 
    activeBtn.classList.toggle("active");

});

launchBtn.addEventListener('click', async function(e){

    if(!Number.isInteger(+textBox.value) || +textBox.value >= graph.getSize() || +textBox.value < 0)
       return;
    
    const source = graph.getVertex(+textBox.value);
    const color = `#${cr()}${cr()}${cr()}`;
    terminal.value = '';
    switch(activeBtn.id){
        case 'dfs':
            await DFS(source,graph,color);
            break;
        case 'bfs':
            await BFS(source,graph);
            break;
        
        default:
             
    }
    terminal.value += `Done.\n` 
});

resetBtn.addEventListener('click',() => {graphReset();terminal.visited='';});

