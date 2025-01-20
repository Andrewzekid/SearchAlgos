const cellSize = 50;
const gridWidth = 35;
const gridHeight= 25;
const gridElement = document.getElementById("grid");
console.log(`The grid is ${cellSize * gridWidth}px wide and ${cellSize*gridHeight} px tall!`);

function pause(milliseconds) {
    var dt = new Date();
    while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}







class Grid {
    static cellSize = cellSize;
    constructor(gridWidth,gridHeight){
        this.grid = [];
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        for(let numRows = 0;numRows < gridHeight;numRows++){
            this.grid.push([]);
        }
    }
    static manhattanDistance(a,b){
        //Get the manhattan distance between two coordinates a and b, a and b => object with a x and y property
        return Math.sqrt(Math.pow(b.x-a.x,2),Math.pow(b.y-a.y,2));
    }
    placeNode(x,y){
        let newDiv = document.createElement("div");
        newDiv.id = `${x} ${y}`
        newDiv.style.position = "absolute";
        newDiv.style.left = x + "px";
        newDiv.style.top = y + "px";
        newDiv.style.width = this.cellSize;
        newDiv.style.height= this.cellSize;
    }
    getNodeById(id){
        //given an id in the form of "#xcoord ycoord"
        let xandy = id.split(" "); //split on space
        return getNode(Number(xandy[0])/50,Number(xandy[1]));
    }
    getNode(idx_x,idx_y){
        //Get a node in the grid. idx_x is the column, idx_y is the row
        return this.grid[idx_y][idx_x];
    };
    breadthFirstSearch(startNode,endNode){
        //Run BFS from start node to end node
        let frontier = [];
        let target = endNode.id;

        let counter = 0;
        frontier.push(startNode); //add first node to frontier
        let came_from = {};
        came_from[startNode.id] = "s";
        while (frontier.length !== 0){
            let current = frontier.shift(); //take from the first
            counter++;
            console.log("current node is:",current);
            setTimeout(() => {
                console.log("Changing bg color!");
                current.node.style.backgroundColor += "red";
                },2000+(counter*30)); //set a timeout to run the background color change

            if (current.id == target){
                //backtrack
                break;
            }
            //Find and add neighbors
            for(let next of current.getNeighbors(this)){
                // console.log(next);

                if (!(next.id in came_from)) {
                    frontier.push(next);
                    came_from[next.id] = current;
 
                }
            }

            // for next in grid.getNeighbors(current):


        };
        return came_from;
    };
    static SLD(startNode,endNode) {
        //calculate the straight line distance from startNode to endNode
        return Math.abs((endNode.x - startNode.x)/Grid.cellSize) + Math.abs((endNode.y - startNode.y)/Grid.cellSize);
    }
    depthFirstSearch(startNode,endNode){
        //Run BFS from start node to end node
        let frontier = [];
        let target = endNode.id;

        let counter = 0;
        frontier.push(startNode); //add first node to frontier
        let came_from = {};
        came_from[startNode.id] = "s";
        while (frontier.length !== 0){
            let current = frontier.pop(); //take from the first
            counter++;
            console.log("current node is:",current);
            setTimeout(() => {
                console.log("Changing bg color!");
                current.node.style.backgroundColor += "red";
                },2000+(counter*20)); //set a timeout to run the background color change

            if (current.id == target){
                //backtrack
                break;
            }
            //Find and add neighbors
            for(let next of current.getNeighbors(this)){
                // console.log(next);

                if (!(next.id in came_from)) {
                    frontier.push(next);
                    came_from[next.id] = current;
 
                }
            }

            // for next in grid.getNeighbors(current):


        };
        return came_from;

    };
    backTrack(startNode,targetNode,came_from,mode="id") {
        //backtrack from startNode or targetNode. Takes in argument mode, determining if we should backtrack using id or the object itself.
        const path = [];
        let previous;
        if(mode === "id") {
            while(startNode.id !== targetNode.id) {
                previous = came_from[targetNode.id];
                path.push(previous); //add the previous node to the 
                targetNode = previous;
            };
            return path;
        } else if (mode === "object") {
            console.log(came_from);
            console.log(came_from.has(targetNode),came_from.get(targetNode))
            console.log(targetNode);
            while(startNode !== targetNode && came_from.has(targetNode)) {
                console.log(`Previohs node: ${previous}`);
                previous = came_from.get(targetNode);
                console.log(`New node: ${previous}`);
                path.push(previous); //add the previous node to the 
                targetNode = previous;
                
                
            };
            return path;
        }
       
    
    }
    greedyBestFirstSearch(startNode,endNode) {
        //initialize open and closed lists
        const openList = new PriorityQueue();
        const closedList = new Map();
        let counter = 0;
        let found = false;
        //add startnode into open list
        closedList.set(startNode,null);
        openList.push(startNode);
        let current;
        while (!(openList.isEmpty())){
            current = openList.pop();
            if (current.id === endNode.id){
                found = true;
                break
            }
            //increment counter for changing background purposes
            counter++;
            const nodeToColor = current.node;
            setTimeout(() => {
                console.log("Changing bg color!");
                nodeToColor.style.backgroundColor = "red";
                },2000+(counter*20)); //set a timeout to run the background color change


            for(let next of current.getNeighbors(grid)){
                if(!(closedList.has(next))){
                    //we havent explored next before
                    console.log(`Adding ${next.x} ${next.y} to closedList!`)
                    let priority = Grid.SLD(next,endNode);
                    next.value = priority;
                    openList.push(next);
                    closedList.set(next,current);
                }
            }
        };
        console.log(closedList);
        return found == true ?  this.backTrack(startNode,endNode,closedList,"object") : null;



    }
};

const parent = (i) => ((i+1)>>>1)-1;
const rightChild = (i) => ((i+1)<<1);
const leftChild = (i) => ((i << 1) + 1);

class PriorityQueue {

    constructor(comparator=(a,b) => {return a.value <= b.value //min heap
    }) {
        this._comparator = comparator;
        this._heap = [];
    }
    size(){
        return this._heap.length;
    }
    isEmpty() {
        return this._heap.length === 0;
    }
    peek() {
        return this._heap[0];
    }
    swap(i,j) {
        //swap element at index i with element at index j
        [this._heap[i],this._heap[j]] = [this._heap[j],this._heap[i]];
    }

    _shiftUp() {
        // Rebalance the binary tree from the bottom up so that it satisfies the invariant property
        let bottomIdx = this.size() - 1;
    
        while (bottomIdx > 0) {
            let parentIdx = parent(bottomIdx);
    
            // Get parent and bottom values
            let parentValue = this._heap[parentIdx];
            let bottomValue = this._heap[bottomIdx];
    
            // If the heap invariant is satisfied, exit
            if (this._comparator(parentValue, bottomValue)) {
                break;
            }
    
            // Swap and continue shifting up
            this.swap(bottomIdx, parentIdx);
            bottomIdx = parentIdx;
        }
    }
    
 _shiftDown() {
    // Rebalance the binary tree from the top down so that it satisfies the invariant property. 
    let topIdx = 0;

    while (true) {
        let left = leftChild(topIdx);
        let right = rightChild(topIdx);

        // Set initial topValue
        let topValue = this._heap[topIdx];
        let leftValue = left < this.size() ? this._heap[left] : undefined; // Check bounds
        let rightValue = right < this.size() ? this._heap[right] : undefined; // Check bounds

        // Determine which child to swap with
        let swapIdx = null;
        if (leftValue !== undefined && !this._comparator(topValue, leftValue)) {
            swapIdx = left;
        }
        if (rightValue !== undefined && 
            (!this._comparator(topValue, rightValue)) && 
            (swapIdx === null || this._comparator(rightValue, this._heap[swapIdx]))) {
            swapIdx = right;
        }

        // If no swap is needed, the heap is balanced
        if (swapIdx === null) {
            break;
        }

        // Swap with the child and continue shifting down
        this.swap(topIdx, swapIdx);
        topIdx = swapIdx;
    }
}
    push(...values) {
        values.forEach(value => {
            this._heap.push(value); //add to last index of heap
            this._shiftUp();
        });
        return this.size();
    }
    pop(){
        let top = 0
        let popped = this.peek();
        let bottom = this.size() -1;
        if(bottom > top) { //ensures that we do not have a situation with only one node in the tree.
            this.swap(bottom,top); //swap bottom and top node
        }
        this._heap.pop(); //remove the bottom element
        this._shiftDown();
        return popped;

    }
    replace(node) {
        const replacedValue = this.peek();
        this._heap[0] = node;
        this._shiftDown();
        return replacedValue;
      }
           
}

class Node {
    static cellSize = Grid.cellSize;
    constructor(x,y,idx_x,idx_y){
        //x and y are the top left corner of the node
        this.x = x;
        this.value = 100000; //used for priority queue
        this.y = y;
        this.isWall = false; //is wall or not
        this.idx_x = idx_x;
        this.idx_y = idx_y;
        this.node = this.placeNode(x,y); //store the div inside of a node class

    }
    placeNode(x,y){
        let newDiv = document.createElement("div");
        //link the id of the node to the new div
        newDiv.id = `${x} ${y}`;
        this.id = newDiv.id;

        newDiv.classList.add("node");
        // newDiv.addEventListener("click",()=>{
        //     newDiv.style.backgroundColor = "hsla(108, 85%, 46%, 0.9);";
        //     grid.moveTo(newDiv.id); //pass in the x and y coordinates of the current node to the moveTo which will initiate the moving process
        // });
        newDiv.style.position = "absolute";
        newDiv.style.left = x + "px";
        newDiv.style.top = y + "px";
        newDiv.style.width = Node.cellSize + "px";
        newDiv.style.height= Node.cellSize + "px";
        //TODO => in grid, add GET NODE BY ID method.
        newDiv.addEventListener("mouseover",(event) => {
            if(event.ctrlKey) {
                //if ctrl key is pressed and something is clicked
                this.node.classList.toggle("wall");
                this.isWall = !(this.isWall); //toggle the iswall
            }
        });

        newDiv.addEventListener("click",(event) => {
            if(event.shiftKey) {
                //if ctrl key is pressed and something is clicked
                this.node.classList.toggle("wall");
                this.isWall = !(this.isWall); //toggle the iswall
            }
        });
        document.getElementById("grid").append(newDiv);
        return newDiv; //return the element for storage
    };

    getNeighbors(grid){
        //Get the neighbors of a node with a certain x and y coordinate
        let idx_x = this.idx_x;
        let idx_y = this.idx_y;
        let neighbors = [];
        outer: for(let i = idx_y -1; i<=idx_y+1 ;i++){
            //Rows

            if(i < 0 || i > grid.gridHeight - 1) { //make sure we do not have a row of -1.
                continue outer;
            }

            inner: for(let j=idx_x-1; j<=idx_x+1; j++){
                //Columns


                if(j < 0 || j > grid.gridWidth - 1 || ((j == idx_x) && (i==idx_y))) { //make sure we do not have a row of -1.
                    continue inner;
                } else {
                    // console.log(`Row:${i} Column:${j}`);
                    if((idx_x % 2 !==0 && idx_y%2==0) || (idx_x%2==0 && idx_y%2!==0)){ //if one is odd and one is even
                        if((j + i) %2 !== 0) {
                            //skip if sum is odd
                            continue inner;
                        };
                       


                    } else {
                        if((j+i) %2==0){
                            continue inner;
                        };

                    }
             
                    let neighbor = grid.getNode(j,i);
                    if (!(neighbor.isWall)){
                        neighbors.push(neighbor);
                    }
                }



            }
        }

        return neighbors;
    };
   
}

let grid = new Grid(gridWidth,gridHeight);

//Main loop to construct the grid
for(let i = 0; i<gridHeight; i++){
    //Rows
    for(let j=0;j<gridWidth; j++){
        //Columns
        let nodex = j*cellSize; //get the center of cell x coord
        let nodey = i*cellSize; //get the center of cell (y coord)
        let node = new Node(nodex,nodey,j,i);
        grid.grid[i].push(node);
    }
}
let cell10 = grid.grid[23][25];
let cell2 = grid.grid[6][6];

cell2.node.style.backgroundColor = "blue";
cell10.node.style.backgroundColor = "green";
const priorityQueue = new PriorityQueue();
let cell5 = grid.grid[3][1];
let cell6 = grid.grid[4][10];
let cell7 = grid.grid[10][5];
cell5.value = 10;
cell6.value = 40;
cell7.value = 60;
priorityQueue.push(cell5,cell6,cell7);

document.addEventListener("keydown",(event)=>{
    console.log(`key: ${event.key} code: ${event.code}`);
    if(event.code == "KeyQ") {
        console.log("Initiating search!");
        setTimeout(() => {
            //mark the end node
            let path = grid.greedyBestFirstSearch(cell10,cell2);
            let counter = 0;
            path.forEach(node => {
                counter++;
                setTimeout(() => {console.log(`${node.x} ${node.y}`);
                node.node.style.backgroundColor = "purple";},6000+(counter*30));
                
            });         
           },3000);
    };
   
})


