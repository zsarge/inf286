class ConwaysGameOfLife {
  /**
   * @param { HTMLCanvasElement } canvas
   */
  constructor(canvas) {
    /** @type HTMLCanvasElement */
    this.canvas = canvas;
    /** @type CanvasRenderingContext2D */
    this.context = this.canvas.getContext("2d");

    /** @const {number} */
    this.SQUARE_SIZE = 50; // size of cell in pixels
  }

  drawASquare() {
    let [x, y] = [0, 0];
    this.context.fillStyle = "white";
    this.context.fillRect(
      x * this.SQUARE_SIZE,
      y * this.SQUARE_SIZE,
      this.SQUARE_SIZE,
      this.SQUARE_SIZE
    );

    this.context.strokeStyle = "white";
    this.context.strokeRect(
      x * this.SQUARE_SIZE,
      y * this.SQUARE_SIZE,
      this.SQUARE_SIZE,
      this.SQUARE_SIZE
    );
    console.log("square drawn");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("conway");

  let conway = new ConwaysGameOfLife(canvas);
  conway.drawASquare();
});
