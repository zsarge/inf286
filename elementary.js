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

    // this.#startingState = [[4], [2], [1]];
  }

  /**
   *
   * @param {*} x
   * @param {number} ruleNumber
   */
  #step(x, ruleNumber) {
    console.log(x, ruleNumber);
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
    // TODO: map state
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

// const elementaryCanvas = document.getElementById("elementary");

// if (elementaryCanvas.getContext) {
//   const elementary = new ElementaryAnimation(elementaryCanvas);
//   elementary.generate();
// } else {
//   alert(
//     "Canvas is not supported. Please try using the latest version of Chrome."
//   );
// }
