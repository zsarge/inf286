import Board from "./modules/board.mjs";
import GridGame from "./modules/grid_game.mjs";

class ElementaryAnimation extends GridGame {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas, cellsWide = 50, cellsTall = 50, square_size = 10) {
    super(canvas);
    this.SQUARE_SIZE = square_size;
    this.cellsWide = cellsWide;
    this.cellsHigh = cellsTall;
    this.board = new Board(cellsWide, cellsTall);
    this.board.board.fill(0);
  }

  /**
   * @param {number} index  - 0 <= index <= 255
   * @throws {RangeError}
   * @returns {Object} - mapping from a group of three input states to one output state
   */
  #getRule(index) {
    if (index < 0 || index > 255) {
      throw new RangeError("Rule index out of range");
    }
    const inputPatterns = [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ];
    // create array of digits
    const outputs = index
      .toString(2)
      .padStart(8, "0")
      .split("")
      .map((x) => parseInt(x));
    console.assert(outputs.length == inputPatterns.length);
    // mapping is an object that takes something like [1,1,1] and produces either 1 or 0
    const mapping = Object.fromEntries(
      inputPatterns.map((ele, idx) => [ele, outputs[idx]])
    );
    return mapping;
  }

  /**
   * Take in a row, and return the next state according to the provided rule.
   * @param {number[]} board
   * @param {object} rule
   * @returns {number[]} - new board
   */
  #step(board, rule) {
    /** @param {number[]} array */
    const pad = (array) => [0, ...array, 0];
    board = pad(board); // assume zero padded borders
    return board.slice(1, board.length - 1).map((ele, index) => {
      return rule[board.slice(index, index + 3)];
    });
  }

  /**
   * @param {number} row
   * @returns {Array}
   */
  #getRow(row) {
    return new Array(this.cellsWide)
      .fill(0)
      .map((ele, index) => this.board.get(index, row));
  }

  /**
   * @param {number} row
   * @param {number[]} content
   */
  #setRow(row, content) {
    console.assert(content.length == this.cellsWide);
    for (let i = 0; i < this.cellsWide; i++) {
      this.board.set(i, row, content[i]);
    }
  }

  #currentRow = 0;
  /**
   * Draws next row according to rule
   */
  tick() {
    if (this.#currentRow > this.cellsHigh) return; // TODO: clear event listener
    const RULE_NUMBER = 3; // TODO: take as constructor or something
    const row = this.#getRow(this.#currentRow++);
    const newContent = this.#step(row, this.#getRule(RULE_NUMBER));
    this.#setRow(this.#currentRow, newContent);
    this.draw();
  }

  setStartingState() {
    const middle = Math.round(this.cellsWide / 2);
    this.board.set(middle, 0, 1);
    this.draw();
  }

  generate() {
    this.draw();
  }

  /**
   * @param {number} pixelsWide
   * @param {number} pixelsTall
   * @param {number[][]} state
   * @returns {[HTMLCanvasElement, ElementaryAnimation]}
   * @throws {Exception} - Canvas is not supported
   */
  static from(pixelsWide, pixelsTall, state) {
    let element = document.createElement("canvas");
    if (!element.getContext) {
      throw new Error("canvas is not supported");
    }
    if (state.length != pixelsTall || state[0].length != pixelsWide) {
      throw new Error("predefined state must be same as size of grid");
    }
    const elementary = new ElementaryAnimation(
      element,
      pixelsWide,
      pixelsTall,
      30
    );
    elementary.resizeCanvas();
    elementary.generate();
    for (let i = 0; i < pixelsWide; i++) {
      for (let j = 0; j < pixelsTall; j++) {
        elementary.board.set(i, j, state[j][i]);
      }
    }
    return [element, elementary];
  }
}

const [canvas, animation] = ElementaryAnimation.from(3, 2, [
  [0, 0, 1],
  [0, 1, 0],
]);
console.log({ canvas, animation });
animation.generate();
document.getElementById("grids").appendChild(canvas);

const elementaryCanvas = document.getElementById("elementary");

if (elementaryCanvas.getContext) {
  const elementary = new ElementaryAnimation(elementaryCanvas);
  console.log({ elementary });
  elementary.generate();
} else {
  alert(
    "Canvas is not supported. Please try using the latest version of Chrome."
  );
}
