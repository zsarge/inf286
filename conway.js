document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("conway");
  console.log(canvas);
  /** @type CanvasRenderingContext2D */
  const ctx = canvas.getContext("2d");
  console.log(ctx);

  canvas.width = 500;
  canvas.height = 500;

  ctx.fillStyle = "black";
  ctx.fillRect(100, 100, 250, 250);
});
