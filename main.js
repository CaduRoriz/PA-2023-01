let gridSize = 10;
let rows = gridSize;
let cols = gridSize;
// var grid = [];
/* `var grid = [];` is initializing an empty array called `grid`. This array will be used to store the
state of the grid, where each element represents a cell in the grid. The array will be populated
with values later on as the user interacts with the grid. */
// let graph = [];
let playerPosition = null;
let goalPosition = null;
let wallsPositions = [];
let selectedObject = null;
var showModal = false;
//Dom elements
var playerBtn;
var wallBtn;
var goalBtn;
var closeModal;
var modalText;
var modal;

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("canvas-container");
  playerBtn = select("#player-btn");
  wallBtn = select("#wall-btn");
  goalBtn = select("#goal-btn");
  closeModal = select("#close-modal");
  modalText = select("#modal-text");
  modal = select("#modal-container");
  dfsBtn = select("#dfs");
  bfsBtn = select("#bfs");
  canvas.mouseClicked(clickGrid);
  playerBtn.mouseClicked(() => (selectedObject = "player"));
  wallBtn.mouseClicked(() => (selectedObject = "wall"));
  goalBtn.mouseClicked(() => (selectedObject = "goal"));
  dfsBtn.mouseClicked(() => {
    if (canEdit && playerPosition !== null) {
      canEdit = false;
      cleanGrid();
      graph = createGraph(gridSize, wallsPositions);
      dfs(graph, playerPosition, goalPosition);
    } else {
      cleanGrid();
      canEdit = true;
    }
  });
  bfsBtn.mouseClicked(() => {
    if (canEdit && playerPosition !== null) {
      canEdit = false;
      cleanGrid();
      graph = createGraph(gridSize, wallsPositions);
      bfs(graph, playerPosition, goalPosition);
    } else {
      cleanGrid();
      canEdit = true;
    }
  });
  closeModal.mouseClicked(() => {
    modal.hide();
  });
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
    }
  }
}

function draw() {
  background(220);
  drawGrid();
}

function cleanGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 4) {
        grid[i][j] = 0;
      }
    }
  }
}

function clickGrid() {
  if (!canEdit) {
    return;
  }
  cleanGrid();
  let cellWidth = width / cols;
  let cellHeight = height / rows;
  let col = floor(mouseX / cellWidth);
  let row = floor(mouseY / cellHeight);
  if (!selectedObject) {
    modalText.html("É necessário selecionar um objeto para inserir");
    modal.show();
  }
  let position = row * 10 + col;
  let tileColor = updateObjectPosition(position, selectedObject);
  if (tileColor === -1) {
    modalText.html("Objeto não pode ser colocado");
    modal.show();
    return;
  }
  grid[row][col] = tileColor;
}

function updateObjectPosition(position, object) {
  if (object !== "player" && !!playerPosition && playerPosition === position) {
    return -1;
  }

  if (object !== "goal" && !!goalPosition && goalPosition === position) {
    return -1;
  }

  if (
    object !== "wall" &&
    wallsPositions.length > 0 &&
    wallsPositions.some((i) => i === position)
  ) {
    return -1;
  }

  if (object === "player") {
    if (playerPosition === null) {
      playerPosition = position;
      return 2;
    }
    if (playerPosition !== position) {
      let [x, y] = playerPosition.toString().split("").map(Number);
      if (y === undefined) {
        [y, x] = [x, 0];
      }
      grid[x][y] = 0;
      playerPosition = position;

      return 2;
    }
    playerPosition = null;
    return 0;
  }

  if (object === "goal") {
    if (goalPosition === null) {
      goalPosition = position;
      return 3;
    }
    if (goalPosition !== position) {
      let [x, y] = goalPosition.toString().split("").map(Number);
      if (y === undefined) {
        [y, x] = [x, 0];
      }
      grid[x][y] = 0;
      goalPosition = position;
      return 3;
    }
    goalPosition = null;
    return 0;
  }

  if (object === "wall") {
    let wall = wallsPositions.find((i) => i === position);
    if (wall !== undefined) {
      wallsPositions = wallsPositions.filter((i) => i !== position);
      return 0;
    }
    wallsPositions.push(position);
    return 1;
  }

  if (object === "path") {
    return 4;
  }

  return 0;
}
