import Board from "./modules/board.mjs";
import GridGame from "./modules/grid_game.mjs";

class GameOfLife extends GridGame {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    super(canvas);

    /** @type Board */
    this.board = new Board(this.cellsWide, this.cellsHigh);
    /** @type Board */
    this.nextBoard = new Board(this.cellsWide, this.cellsHigh);
  }

  /**
   * Counts the neighbors at a location
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  #countNeighbors(x, y) {
    let n = 0;
    // dx and dy are deltas from the given (x, y) point,
    // Here is a graph:
    /*
     * (x-1, y-1) | (x, y-1) | (x+1, y-1)
     * (x-1, y  ) | (x, y  ) | (x+1, y  )
     * (x-1, y+1) | (x, y+1) | (x+1, y+1)
     */
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        // make sure we don't count the square we're checking around
        if (x + dx != x || y + dy != y)
          if (this.board.get(x + dx, y + dy) == 1)
            // count alive squares
            n++;
    return n;
  }

  /**
   * Sets the value of the next board, as to not
   * interfere with the logic of the current pass.
   * @param {number} x
   * @param {number} y
   * @param {number} value
   */
  #setNext(x, y, value) {
    this.nextBoard.set(x, y, value);
  }

  /**
   * Applies the rules of Conway's game of life
   * @param {number} x
   * @param {number} y
   */
  #applyRules(x, y) {
    let n = this.#countNeighbors(x, y);

    // Any live cell
    if (this.board.get(x, y) == 1) {
      if (n < 2)
        // with fewer than two live neighbours
        // dies, as if by underpopulation.
        this.#setNext(x, y, 0);
      else if (n > 3)
        // with more than three live neighbours
        // dies, as if by overpopulation.
        this.#setNext(x, y, 0);
      // with two or three live neighbours
      // lives on to the next generation.
      else this.#setNext(x, y, 1);
    } else {
      // Any dead cell with exactly three live neighbours
      // becomes a live cell, as if by reproduction.
      if (n == 3) this.#setNext(x, y, 1);
      else this.#setNext(x, y, 0);
    }
  }

  /**
   * Updates the game state
   */
  tick() {
    // generate next frame
    for (let y = 0; y < this.cellsHigh; y++) {
      for (let x = 0; x < this.cellsWide; x++) {
        this.#applyRules(x, y);
      }
    }

    // swaps the two buffers
    let tmp = this.board;
    this.board = this.nextBoard;
    this.nextBoard = tmp;
  }

  /**
   * callback method to randomize board states in UInt8Array.
   */
  onStart() {
    this.board.board = this.board.board.map(() => 1 * (Math.random() > 0.5));
  }
}

const conwayCanvas = document.getElementById("conway");

if (conwayCanvas.getContext) {
  const conway = new GameOfLife(conwayCanvas);
  conway.startGame();

  const callback = () => {
    // anonymous function needed to maintain the proper `this` context
    conway.resizeCanvas();
  };
  window.addEventListener("resize", callback, true);
} else {
  alert("Canvas is not supported on your system.");
}
