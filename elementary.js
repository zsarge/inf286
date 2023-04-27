import Board from "./modules/board.mjs";
import GridGame from "./modules/grid_game.mjs";

class ElementaryAnimation extends GridGame {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    super(canvas);
    const h = 50;
    const w = 50;
    this.SQUARE_SIZE = 10;
    this.cellsWide = w;
    this.cellsHigh = h;
    this.board = new Board(w, h);
  }

  generate() {
    this.draw();
  }
}

const elementaryCanvas = document.getElementById("elementary");

if (elementaryCanvas.getContext) {
  const elementary = new ElementaryAnimation(elementaryCanvas);
  elementary.generate();
} else {
  alert(
    "Canvas is not supported. Please try using the latest version of Chrome."
  );
}
