const width = '100%';
const height = '100%';

const svg = document.querySelector('#svg');
svg.setAttribute('width', width);
svg.setAttribute('height', height);

const svgDoc = svg.contentDocument;

const svgns = "http://www.w3.org/2000/svg";

class Drawer {
  
    drawEdge = function (id, x1, y1, x2, y2, color) {
        let newLine = document.createElementNS(svgns, 'line');
        
        if (!id) {
            id = "edge-" + Math.round(Math.random() * 1000);
        }
        
        if(!color){
          color = 'black';
        }

        newLine.setAttribute('id', id);
        
        newLine.setAttribute('x1', x1);
        newLine.setAttribute('y1', y1);
        newLine.setAttribute('x2', x2);
        newLine.setAttribute('y2', y2);
        
        newLine.setAttribute("stroke", color);
        newLine.setAttribute("stroke-width", "3px");
        newLine.setAttribute("fill", color);
        
        if(this.isDirectional){
        
          const arrowId = 'arrow-' + id;
          newLine.setAttribute("marker-end", 'url(#' + arrowId + ')');

          let defs = document.createElementNS(svgns, 'defs');

          let orient = "auto";

          defs.innerHTML = `<marker id="` + arrowId + `" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="` + orient + `" markerUnits="strokeWidth">
                              <path d="M0,0 L0,6 L9,3 z" fill="` + color + `" />
                            </marker>`;

          svg.append(defs);

        }
        
        svg.append(newLine);
    };
    
    drawNode = function (node) {
        let circle = document.createElementNS(svgns, 'circle');
        
        if (!node.id) {
            node.id = "node-" + Math.round(Math.random() * 1000);
        }

        circle.setAttribute('id', node.id);        
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', node.r || 30 );
        
        circle.setAttribute("stroke", node.color || 'black');
        circle.setAttribute("stroke-width", "3");
        circle.setAttribute("fill", node.color || 'green');

        svg.appendChild(circle);
    };
    
    drawGraph = function (graph) {
        let self = this;
        this.isDirectional = graph.isDirectional;
        
        graph.nodes.forEach(function(item, i, arr) {
            self.drawNode(item);
        });
        
        graph.edges.forEach(function(item, i, arr) {
            console.log("item", item);
            
            let from = document.getElementById(item.from);
            let to = document.getElementById(item.to);
            
            console.log("from", from);
            console.log("to", to);
            
            const fromCX = parseInt(from.getAttribute('cx'));
            const fromCY = parseInt(from.getAttribute('cy'));
            
            const toCX = parseInt(to.getAttribute('cx'));
            const toCY = parseInt(to.getAttribute('cy'));
            
            self.drawEdge(item.id, fromCX, fromCY, toCX, toCY, item.color);
        });
    };
};

class Graph {

    constructor(nodes, edges, isDirectional) {
      this.nodes = nodes;
      this.edges = edges;
      this.isDirectional = isDirectional;
    }
};

const nodes = [
        {id: "node-1", x: 100, y: 100},
        {id: "node-2", x: 400, y: 100},
        {id: "node-3", x: 250, y: 250}
    ];
    
const edges = [
        {id: "edge-1", from: "node-1", to: "node-2"},
        {id: "edge-2", from: "node-1", to: "node-3"},
        {id: "edge-3", from: "node-2", to: "node-3"},
    ];
    
const isDirectional = true;    

let graph = new Graph(nodes, edges, isDirectional);

let drawer = new Drawer();

drawer.drawGraph(graph);

let selected = null;

document.addEventListener("click", onSelect, false);
document.querySelector('#delete').addEventListener('click', deleteItem);
document.querySelector('#create-node').addEventListener('click', createNode);

function onSelect(e) {
  if (e.target !== e.currentTarget) {
    let clickedItemId = e.target.id;
    
    if (clickedItemId.includes('node-') || clickedItemId.includes('edge-') ) {
        let element = document.getElementById(clickedItemId);
        let currentStroke = element.getAttribute('stroke');
        let edgeMarker = document.getElementById('arrow-' + clickedItemId);
        
        if (element && element !== selected) {
            if (selected) {
              selected.setAttribute("stroke", currentStroke);
              let edgeMarkerSelected = document.getElementById('arrow-' + selected.getAttribute('id'));
              if (edgeMarkerSelected) {
                edgeMarkerSelected.firstElementChild.setAttribute("fill", currentStroke);
              }
            }
            
            selected = element;            
            selected.setAttribute("stroke", "red");
            
            if (edgeMarker) {
              edgeMarker.firstElementChild.setAttribute("fill", "red");
            }
            
        } 
    } else if (selected) {
        selected.setAttribute("stroke", currentStroke);
        selected = null;
    }
  }
  e.stopPropagation();
}

function deleteItem() {
    if (selected) {
        selected.remove();
    }
}

function createNode() {
    let node = {
        x: Math.random() * document.body.clientWidth, 
        y: Math.random() * document.body.clientHeight
    };
    
    drawer.drawNode(node);
}