import Board from "./modules/board.mjs";
import GridGame from "./modules/grid_game.mjs";

class ElementaryAnimation extends GridGame {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {number?} cellsWide
   * @param {number?} cellsTall
   * @param {number?} square_size
   * @param {number?} ruleNumber
   * @param {number?} speed
   */
  constructor(
    canvas,
    cellsWide = 50,
    cellsTall = 50,
    square_size = 10,
    ruleNumber = 22,
    speed = 30
  ) {
    super(canvas);
    this.SQUARE_SIZE = square_size;
    this.cellsWide = cellsWide;
    this.cellsHigh = cellsTall;
    this.board = new Board(cellsWide, cellsTall);
    this.RULE_NUMBER = ruleNumber;
    this.SPEED = speed;
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
    if (this.#currentRow > this.cellsHigh) return;
    const row = this.#getRow(this.#currentRow++);
    const newContent = this.#step(row, this.#getRule(this.RULE_NUMBER));
    this.#setRow(this.#currentRow, newContent);
    this.draw();
  }

  setStartingState() {
    this.board.board.fill(0);
    const middle = Math.round(this.cellsWide / 2);
    this.board.set(middle, 0, 1);
    this.#currentRow = 0;
  }

  generate() {
    console.log(`generating rule ${this.RULE_NUMBER}`);
    this.setStartingState();
    this.interval = setInterval(() => {
      if (this.#currentRow <= this.cellsHigh) {
        this.tick();
      } else {
        clearInterval(this.interval);
      }
    }, this.SPEED);
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.board) {
      delete this.board;
    }
  }

  /**
   * @param {number} pixelsWide
   * @param {number} pixelsTall
   * @param {number[][]?} state
   * @param {number?} squareSize
   * @param {number?} speed
   * @returns {[HTMLCanvasElement, ElementaryAnimation]}
   * @throws {Exception} - Canvas is not supported
   */
  static from(
    pixelsWide,
    pixelsTall,
    state = undefined,
    squareSize = 30,
    speed = 40
  ) {
    state ||= Array.from(Array(pixelsTall), () => new Array(pixelsWide));
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
      squareSize,
      undefined,
      speed
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

let animationReference;

export function runAnimation() {
  if (animationReference) animationReference.destroy();

  const size = parseInt(document.getElementById("size-box").value);
  const speed = parseInt(document.getElementById("speed").value);
  console.log({ size, speed });
  const [canvas, animation] = ElementaryAnimation.from(
    size,
    size,
    undefined,
    10,
    speed
  );
  animation.RULE_NUMBER = parseInt(document.getElementById("rule-box").value);
  const container = document.getElementById("animation-container");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(canvas);
  animationReference = animation;
  animation.generate();
}

window.addEventListener("DOMContentLoaded", () => {
  runAnimation();
});
