import {terminal} from "./simulator.js"

export const cr = function() { //randomized color gen
    const arr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e',
                'f'];
    let random =  Math.floor(Math.random() * arr.length); 
    return arr[random];
}
async function sleep(ms) {
    return new Promise(res => setTimeout(() => res(), ms))
  }

export const DFS =  async function(source,graph,color) {
  
    terminal.value += `Traveling from Vertex #${source.id}.\n`;
    if(source.visited)
        return;
    source.visited = true;
    source.htmlElement.style.fill = color;
    await sleep(500);
    terminal.value += `Fetching Neighbours..\n`;
    const neighbours =  Array.from(graph.getNeighbours(source.id).values());
   for(let neighbour of neighbours){
      
      if(neighbour.visited)
          continue;
      await sleep(500); 
      terminal.value += `Vertex #${neighbour.id} is selected.\n`
      const currentEdge = document.getElementById(`${source.id.toString()}-${neighbour.id.toString()}`); 
      currentEdge.style.stroke = 'red';
      await sleep(200);
      currentEdge.style.stroke = 'black';
      await sleep(300);
      neighbour.parent = source;
      terminal.value += `Vertex #${neighbour.id} parent's is Vertex #${source.id}.\n`;
      await sleep(500)
      await DFS(neighbour,graph,color);
    }
    
}  

export const BFS = async function(source,graph) { //Dijkstra with 1 weights

   await Dijkstra(source,graph);

}

export const Dijkstra = async function(source,graph) { // need to find impl of min heap
 
    const ExtractMin = (queue) => {
        
        if(queue.length == 0)
            return;
        
        let min = queue[0];
        for(let i=1; i<queue.length; i++){

            if(queue[i].dist < min.dist)
                min = queue[i];
        }

        const index = queue.indexOf(min);
        if (index > -1) 
            queue.splice(index, 1);
        
        return min;
    };

    let vertexQueue = Array.from(graph.getVertices().values());
    source.dist = 0;
    const numOfVertices = vertexQueue.length;
    let s = new Set();
    let colorMap = new Map(); // <dist,color>
    while(s.size!=numOfVertices){
        const u = ExtractMin(vertexQueue);
        s.add(u.id);
        u.htmlElement.style.stroke = 'orange'; //visited mark 
        terminal.value += `Vertex #${u.id} is selected.\n`;
        await sleep(500);

        const neighbours = Array.from(graph.getNeighbours(u.id).values()).filter((n)=>!s.has(n.id));
        if(neighbours.length == 0)
           terminal.value += `No unvisited neighbours exists.\n`
        for(let v of neighbours){

            const edge = graph.getEdge(`${u.id.toString()}-${v.id.toString()}`);
            edge.htmlElement.style.stroke = 'red';
            await sleep(200);
            edge.htmlElement.style.stroke = 'black';
            await sleep(300);

            if(v.dist > u.dist + edge.weight){ //Relax function

                v.dist = u.dist + edge.weight;
                v.parent = u;

                if(!colorMap.has(v.dist))
                     colorMap.set(v.dist,`#${cr()}${cr()}${cr()}`); 
                v.htmlElement.style.fill = colorMap.get(v.dist);

                terminal.value += `Neighbour #${v.id} dist is updated to ${v.dist}.\n`
                await sleep(500);

            }
            else{
                terminal.value += `Relax(${u.id.toString()},${v.id.toString()}) was not performed\n`
                await sleep(200);
            }
        }


    }

}