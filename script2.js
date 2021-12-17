////////////////////////////////////// Create an incidence matrix
function newIncidenceMatrix(dim) {
  const nlin = Math.sqrt(dim);

  // Zero matrix
  let matrix = [];
  for (let i = 0; i < dim; i += 1) {
    matrix[i] = [];
    for (let j = 0; j < dim; j += 1) {
      matrix[i][j] = 0;
    }
  }
  // for element (0,0)
  matrix[0][1] = 1;
  matrix[0][nlin] = 1;
  // for element (0,nlin-1)
  matrix[nlin - 1][nlin - 2] = 1;
  matrix[nlin - 1][2 * nlin - 1] = 1;
  // for element (nlin-1,0)
  matrix[dim - nlin][dim - 2 * nlin] = 1;
  matrix[dim - nlin][dim - nlin + 1] = 1;
  // for element (nlin-1,nlin-1)
  matrix[dim - 1][dim - 2] = 1;
  matrix[dim - 1][dim - nlin - 1] = 1;

  console.log(matrix[23]);

  for (let i = 1; i < nlin - 1; i += 1) {
    // middle, left side
    matrix[i * nlin][(i - 1)*nlin] = 1;
    matrix[i * nlin][i * nlin + 1] = 1;
    matrix[i * nlin][(i + 1) * nlin] = 1;
    // middle, right side
    matrix[(i + 1) * nlin - 1][i * nlin - 1] = 1;
    matrix[(i + 1) * nlin - 1][(i + 1) * nlin - 2] = 1;
    matrix[(i + 1) * nlin - 1][(i + 1) * nlin - 1 + nlin] = 1;
    // middle, top side
    matrix[i][i - 1] = 1;
    matrix[i][i + 1] = 1;
    matrix[i][i + nlin] = 1;
    // middle, bottom side
    matrix[(nlin - 1) * nlin + i][(nlin - 2) * nlin + i] = 1;
    matrix[(nlin - 1) * nlin + i][(nlin - 1) * nlin + i - 1] = 1;
    matrix[(nlin - 1) * nlin + i][(nlin - 1) * nlin + i + 1] = 1;
    // middle, middle
    for (let j = 1; j < nlin - 1; j += 1) {
      matrix[nlin * i + j][nlin * i + j - nlin] = 1;
      matrix[nlin * i + j][nlin * i + j + nlin] = 1;
      matrix[nlin * i + j][nlin * i + j + 1] = 1;
      matrix[nlin * i + j][nlin * i + j - 1] = 1;
    }
  }
  return matrix;
}

////////////////////////////////////// Remove obstacles
function obstacleAtNode(nodes, matrix) {
  let dim = matrix[0].length;
  let nrmNodes = nodes.length;
  for (let i=0; i<nrmNodes; i+=1) {
    for (let j=0; j<dim; j+=1) {
      matrix[nodes[i]][j] = 0;
      matrix[j][nodes[i]] = 0;
    }
  }
  return matrix;
}

////////////////////////////////////// BFS Algorithm
// indexes of ones in the incidence matrix
function findOnes(array) {
  let indexes = [];
  for (let each = 0; each < array.length; each += 1) {
    if (array[each] === 1) {
      indexes.push(each);
    }
  }
  return indexes;
}

// BFS from https://levelup.gitconnected.com/finding-the-shortest-path-in-javascript-pt-1-breadth-first-search-67ae4653dbec
function alternateBreadthFirstSearch(tree, rootNode, searchValue) {
  // make a queue array
  let queue = [];
  let path = [];
  let aux = new Array(tree.length).fill(-1);
  // populate it with the node that will be the root of your search
  queue.push(rootNode);

  // search the queue until it is empty
  while (queue.length > 0) {
    // assign the top of the queue to variable currentNode
    let currentNode = queue[0];
    path.push(currentNode);
    //console.log("Current node is:" + currentNode);

    // if currentNode is the node we're searching for, break & alert
    if (currentNode === searchValue) {
      return aux;
    }

    // if currentNode has a left child node, add it to the queue.
    let nexts = findOnes(tree[currentNode]);
    for (let i = 0; i < nexts.length; i += 1) {
      if (!path.includes(nexts[i]) && !queue.includes(nexts[i])) {
        queue.push(nexts[i]);
        // update the aux
        if (aux[nexts[i]]===-1) {
          aux[nexts[i]] = currentNode;
        }
      }
    }
    // remove the currentNode from the queue.
    queue.shift();
  }
  console.log("Sorry, no such node found :(");
};

////////////////////////////////////// Shortest path
function reconstructPath(s, e, path) {
  path[s] = -1;
  let newpath = [];
  for (let at = e; at !== -1; at = path[at]){
    newpath.push(at);
  }

  newpath.reverse();

  if (newpath[0]===s) {
    return newpath;
  }
  return [];
}

////////////////////////////////////// Executing
const numberNodes = 25;
let s = 20;
let e = 24;
let r = [17];

let matrix = newIncidenceMatrix(numberNodes);


matrix = obstacleAtNode(r, matrix);
let previous = alternateBreadthFirstSearch(matrix, s, e);

console.log(previous);

let shortestPath = reconstructPath(s, e, previous);

console.log(matrix[20]);

console.log(previous);

console.log(shortestPath);
