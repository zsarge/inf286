export default class Board {
  /**
   * Create a 2d interface for a Uint8 array
   * @param {number} cellsWide
   * @param {number} cellsHigh
   */
  constructor(cellsWide, cellsHigh) {
    if (!cellsHigh || !cellsWide)
      throw "Must have both cell width and cell height";
    /** @type number */
    this.width = cellsWide;
    /** @type number */
    this.height = cellsHigh;
    /** @type Uint8Array */
    this.board = new Uint8Array(cellsWide * cellsHigh).fill(0);
    // TODO: Could I optimize this even more by bitmasking into binary fields?
    // Would that just spend more CPU to save memory?
    // TODO: How does this affect cache locality?
  }

  /**
   * Get value at a position
   * @param {number} x
   * @param {number} y
   * @returns {number} (Uint8)
   */
  get(x, y) {
    // wrap board like a tourus
    if (y < 0) y = this.height + y;
    if (x < 0) x = this.width + x;
    if (y >= this.height) y = this.height - y;
    if (x >= this.width) x = this.width - x;

    return this.board[y * this.width + x];
  }

  /**
   * Set content at position
   * @param {number} x
   * @param {number} y
   * @param {number} value (valid Uint8)
   */
  set(x, y, value) {
    this.board[y * this.width + x] = value;
  }
}
