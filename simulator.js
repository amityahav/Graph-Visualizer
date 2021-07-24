
import { Graph , Vertex } from "./graph.js"
import { DFS, BFS, cr, Dijkstra } from "./Algorithms.js"


//global variables
let graph = new Graph();
const board = document.getElementById("board");
const resetBtn = document.getElementById("reset");
export const terminal = document.getElementById("terminal");
const directed = document.querySelector(".directed");
const undirected = document.querySelector(".undirected");
const weightEnabled = ['prim','kruskal','dijkstra','maxflow'];

//..DFS
const dfsBtn = document.getElementById("dfs");
//..BFS
const bfsBtn = document.getElementById("bfs");
//..Dijkstra
const dijkstraBtn = document.getElementById("dijkstra");

const launchBtn = document.getElementById("launch");
const textBox = document.getElementById("textBox");

let from = {x: -1, y: -1, id: -1};
let activeBtn = dfsBtn; 
let count = 0;

function idGenerator() {

    return () => count++;
}
const makeFreshId = idGenerator();

const graphReset = function(type) {

    count=0;

    while (board.lastChild) 
        board.removeChild(board.lastChild);
        
        graph.reset();

    if(type === 'directed')
        board.insertAdjacentHTML("afterbegin",`<defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                refX="15" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" />
                </marker>
            </defs>`);
}
const btnInit = function(e) {

    document.getElementById("txtLaunch").removeAttribute("hidden");
    activeBtn.classList.toggle("active");
    activeBtn = e.target; 
    activeBtn.classList.toggle("active");
    graphReset(graph.getType());
}
//Event handlers

board.addEventListener('click',function(e) {

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
            const edgeId2 = `${id.toString()}-${from.id.toString()}`;
            const edge = graph.getEdge(edgeId);
            const edge2 = graph.getEdge(edgeId2);

            if(weightEnabled.includes(activeBtn.id)){
                edge.weight = +prompt("Enter a positive weight:");
                if(edge2 != undefined)
                    edge2.weight = edge.weight;
                board.insertAdjacentHTML('afterbegin',
                `<g> <line id=${edgeId} x1=${from.x} y1=${from.y} x2=${vertex_x} y2=${vertex_y} stroke="black" stroke-width ="3" marker-end="url(#arrowhead)"/>
                <text fill="red" x=${((+from.x)+(+vertex_x))/2} y=${((+from.y)+(+vertex_y))/2} font-size="35" text-anchor="middle" alignment-baseline="central">${edge.weight}</text> </g>`)
            }
            else
                board.insertAdjacentHTML('afterbegin',
                `<line id=${edgeId} x1=${from.x} y1=${from.y} x2=${vertex_x} y2=${vertex_y} stroke="black" stroke-width ="3" marker-end="url(#arrowhead)"/>`);

            edge.setHtmlElement(document.getElementById(edgeId));
            if(edge2 != undefined)
                edge2.setHtmlElement(document.getElementById(edgeId));
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

    btnInit(e);
});

bfsBtn.addEventListener('click',function(e){

    btnInit(e);

});

dijkstraBtn.addEventListener('click',function(e){

    btnInit(e);   
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
        case 'dijkstra':
            await Dijkstra(source,graph);
            break;
        
        default:
             
    }
    terminal.value += `Done.\n` 
});

resetBtn.addEventListener('click',() => {
    graphReset(graph.getType());
    terminal.value='';
});

undirected.addEventListener('click', ()=> {

    graph.setType("undirected");
    graphReset(graph.getType());
    terminal.value='';
});

directed.addEventListener('click',()=>{

    graph.setType("directed");
    graphReset(graph.getType());
    terminal.value='';
});