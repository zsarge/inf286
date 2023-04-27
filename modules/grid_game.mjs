export default class GridGame {
  static COLOR_ENABLED = "black";
  static COLOR_DISABLED = "white";

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    /** @type HTMLCanvasElement */
    this.canvas = canvas;
    this.resizeCanvas();
    /** @type CanvasRenderingContext2D */
    this.ctx = canvas.getContext("2d");

    const parent = this.canvas.parentElement;
    if (parent) {
      const width = parent.clientWidth;
      if (width < 500) {
        /** @const {number} */
        this.SQUARE_SIZE = 9;
      } else {
        /** @const {number} */
        this.SQUARE_SIZE = 15;
      }
    }

    /** @type number */
    this.cellsWide = Math.ceil(this.canvas.width / this.SQUARE_SIZE);
    /** @type number */
    this.cellsHigh = Math.ceil(this.canvas.height / this.SQUARE_SIZE);
  }

  /**
   * Draws the board to the canvas context
   */
  draw() {
    for (let y = 0; y < this.cellsHigh; y++) {
      for (let x = 0; x < this.cellsWide; x++) {
        this.ctx.fillStyle = this.board.get(x, y)
          ? GridGame.COLOR_ENABLED
          : GridGame.COLOR_DISABLED;
        this.ctx.fillRect(
          x * this.SQUARE_SIZE,
          y * this.SQUARE_SIZE,
          this.SQUARE_SIZE,
          this.SQUARE_SIZE
        );

        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(
          x * this.SQUARE_SIZE,
          y * this.SQUARE_SIZE,
          this.SQUARE_SIZE,
          this.SQUARE_SIZE
        );
      }
    }
  }

  /**
   * Resizes the canvas element to fit the window
   */
  resizeCanvas() {
    const ele = this.canvas.parentElement;
    let height, width;
    if (ele) {
      height = ele.clientHeight;
      width = ele.clientWidth;
    } else {
      height = this.cellsHigh * this.SQUARE_SIZE;
      width = this.cellsWide * this.SQUARE_SIZE;
    }

    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  tick() {
    throw new Exception("GridGame subclass should implement tick function");
  }

  /**
   * sets up event listener after calling onStart hook
   */
  startGame() {
    if (this.onStart) this.onStart();
    this.draw();

    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
    this.gameInterval = setInterval(() => {
      this.tick();
      this.draw();
    }, 100);
  }
}
