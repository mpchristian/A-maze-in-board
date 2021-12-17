const element1 = document.querySelector('#smallBlack');
element1.style.backgroundColor = 'black';

const element2 = document.querySelector('#smallRed');
element2.style.backgroundColor = 'red';


// Selecting the black as default
function defaultSelected() {
  const firstColor = document.querySelector('.color');
  firstColor.classList.add('selected');
}

// Create pixels board
function createBoard(dimensionBoard) { // Remove the board
  defaultSelected();
  const firstBoard = document.querySelector('#pixel-board');
  firstBoard.remove();
  const fatherBoard = document.querySelector('#fatherBoard');

  const newBoard = document.createElement('div'); // Creating a new one
  newBoard.id = 'pixel-board';
  fatherBoard.appendChild(newBoard);

  newBoard.style.width = `${(dimensionBoard * 42)}px`; // Configuring it
  newBoard.style.height = newBoard.style.width;
  newBoard.style.margin = '0 auto';

  function createLine(dimention, counter) {
    for (let index = 1; index <= dimention; index += 1) {
      const element = document.createElement('div');
      element.id = `${counter}`;
      element.className = 'pixel';
      newBoard.appendChild(element);
      counter += 1;
    }
    return counter;
  }

  let counter = 0;
  for (let line = 1; line <= dimensionBoard; line += 1) {
    counter = createLine(dimensionBoard, counter);
  }

  selectColor()

  // Event for pinting the pixels
  const allPixels = document.querySelectorAll('.pixel');

  for (const eachPixel of allPixels) {
    eachPixel.addEventListener('click', function () {
      const selectedColor = document.querySelector('.selected');

      if (eachPixel.style.backgroundColor !== selectedColor.style.backgroundColor) {
        eachPixel.style.backgroundColor = selectedColor.style.backgroundColor;
        eachPixel.classList.add(selectedColor.style.backgroundColor);
      } else {
        eachPixel.style.backgroundColor = '';
        eachPixel.classList.remove(selectedColor.style.backgroundColor);
      }
    });
  }

  // Event for cleaning the board
  cleanAll(allPixels);

  // Event for finding the path
  findPath(dimensionBoard);
}

// Event for cleaning the board
function cleanAll(allPixels) {
  const cleanButton = document.querySelector('#clear-board');
  cleanButton.addEventListener('click', function () {
    for (const eachPixel of allPixels) {
      eachPixel.style.backgroundColor = '';
      eachPixel.className = 'pixel';
    }
    defaultSelected();
  });
}


const dimensionDefault = 5;
createBoard(dimensionDefault);

// Event for selecting a color
selectColor()

function selectColor() {
  const allColors = document.querySelectorAll('.color');

  for (const eachColor of allColors) {
    eachColor.addEventListener('click', function () {
      const lastSelected = document.querySelector('.selected');
      lastSelected.classList.remove('selected');
      eachColor.classList.add('selected');
      console.log(eachColor.style.backgroundColor);
    });
  }
}


// Event for resizing the board when clicking on VQV
function resizing() {
  const vqvButton = document.querySelector('#generate-board');

  vqvButton.addEventListener('click', function () {
    let newDimention = document.querySelector('#board-size').value;

    if (newDimention !== '') {

      if (newDimention < 5) {
        newDimention = 5;
        document.querySelector('#board-size').value = 5;
      }

      if (newDimention > 50) {
        newDimention = 50;
        document.querySelector('#board-size').value = 50;
      }
      createBoard(newDimention);
    } else {
      alert('Board inválido!');
    }
  });
}

resizing();


// Event for pinting the path
function findPath(dimensionBoard) {
  let pathButton = document.querySelector('#path');
  pathButton.addEventListener('click', function () {
    // Collect source and end nodes
    let blackPixels = document.querySelectorAll('.black');
    let sourceNode = parseInt(blackPixels[0].id);
    let endNode = parseInt(blackPixels[1].id);

    // Collect obstacles nodes
    let redPixels = document.querySelectorAll('.red');
    let obstacles = [];
    for (let i = 0; i < redPixels.length; i += 1) {
      obstacles[i] = redPixels[i].id;
    }

    // Calculating shortest path
    let matrix = newIncidenceMatrix(dimensionBoard ** 2);
    matrix = obstacleAtNode(obstacles, matrix);
    let previous = alternateBreadthFirstSearch(matrix, sourceNode, endNode);
    let shortestPath = reconstructPath(sourceNode, endNode, previous);
    shortestPath.shift();
    shortestPath.pop();
    pintNodes(shortestPath);
  });
}



function pintNodes(path) {

  let pixelPath = document.querySelectorAll('.path');
  for (let i = 0; i < pixelPath.length; i += 1) {
    pixelPath[i].classList.remove('path');
  }

  for (let i = 0; i < path.length; i += 1) {
    let pixelPath = document.getElementById(path[i]);
    pixelPath.classList.add('path');
  }
}














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

  for (let i = 1; i < nlin - 1; i += 1) {
    // middle, left side
    matrix[i * nlin][(i - 1) * nlin] = 1;
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
  for (let i = 0; i < nrmNodes; i += 1) {
    for (let j = 0; j < dim; j += 1) {
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
  let aux = new Array(tree.length).fill(0);
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
        if (aux[nexts[i]] === 0) {
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
  for (let at = e; at !== -1; at = path[at]) {
    newpath.push(at);
  }

  newpath.reverse();

  if (newpath[0] === s) {
    return newpath;
  }
  return [];
}