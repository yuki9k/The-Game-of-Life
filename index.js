"use strict";

const two = new Two({ fullscreen: true, type: Two.Types.canvas }).appendTo(
  document.body,
);
const CELL_SIZE = 8;
const GRID_WIDTH = Math.floor(two.width / CELL_SIZE);
const GRID_HEIGHT = Math.floor(two.height / CELL_SIZE);

const grid = Array.from({ length: GRID_WIDTH }, (_, x) =>
  Array.from({ length: GRID_HEIGHT }, (_, y) => {
    const rect = two.makeRectangle(
      CELL_SIZE / 2 + CELL_SIZE * x,
      CELL_SIZE / 2 + CELL_SIZE * y,
      CELL_SIZE,
      CELL_SIZE,
    );
    rect.x = x;
    rect.y = y;
    rect.isAlive = Math.random() < 0.5;
    rect.willBeAlive = rect.isAlive;
    rect.fill = rect.isAlive ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)";
    rect.stroke = "none";
    return rect;
  }),
);

let cTick = 0;
const TICKS_PER_UPDATE = 1; // Lower = faster simulation

for (let i = 0; i <= GRID_WIDTH; i++) {
  const x = i * CELL_SIZE;
  const line = two.makeLine(x, 0, x, CELL_SIZE * GRID_HEIGHT);
  line.stroke = "rgba(0,0,0,0.25)";
}
for (let j = 0; j <= GRID_HEIGHT; j++) {
  const y = j * CELL_SIZE;
  const line = two.makeLine(0, y, CELL_SIZE * GRID_WIDTH, y);
  line.stroke = "rgba(0,0,0,0.25)";
}

function getAliveNeighborCount(x, y) {
  const offsets = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];

  let alive = 0;
  for (const [dx, dy] of offsets) {
    const nx = x + dx;
    const ny = y + dy;

    if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
      if (grid[nx][ny].isAlive) {
        alive++;
      }
    }
  }
  return alive;
}

function update() {
  cTick++;
  if (cTick % TICKS_PER_UPDATE !== 0) return;

  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      const rect = grid[x][y];
      const aliveNeighbors = getAliveNeighborCount(rect.x, rect.y);

      if (rect.isAlive) {
        rect.willBeAlive = aliveNeighbors === 2 || aliveNeighbors === 3;
      } else {
        rect.willBeAlive = aliveNeighbors === 3;
      }
    }
  }

  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      const rect = grid[x][y];
      if (rect.isAlive === rect.willBeAlive) continue;
      rect.isAlive = rect.willBeAlive;
      rect.fill = rect.isAlive ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)";
    }
  }
}

two.bind("update", update);
two.play();
