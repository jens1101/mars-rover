/**
 * @typedef {Object} Point
 * @property {number} x The X Coordinate
 * @property {number} y The Y Coordinate
 */

/**
 * For the given X and Y coordinates this calculates the resulting coordinates
 * if we move forward 1 grid point in the current orientation.
 * @callback Orientation~move
 * @param {number} startX The starting X coordinate
 * @param {number} startY The starting Y coordinate
 * @return {Point} The resulting coordinates after moving forward 1 grid
 * point in the current orientation.
 */

/**
 * A primitive class to handle cardinal directions
 */
export class Orientation {
  /**
   * Creates a new orientation
   * @param {string} symbol The symbol for this new orientation
   * @param {Orientation~move} moveFunction The function to assign as the `move`
   * function for this instance.
   * @see {@callback Orientation~move}
   */
  constructor (symbol, moveFunction) {
    this.symbol = symbol
    this.move = moveFunction
  }

  /**
   * Gets what orientation is immediately left of this one.
   * @return {Orientation}
   */
  get left () {
    return this._left
  }

  /**
   * Sets the orientation immediately left of this one.
   * @param {Orientation} orientation
   */
  set left (orientation) {
    this._left = orientation

    // Set the right side of the current left side. This ensures that the 2-way
    // referencing is correct.
    orientation.right = this
  }

  /**
   * Gets what orientation is immediately right of this one.
   * @return {Orientation}
   */
  get right () {
    return this._right
  }

  /**
   * Sets the orientation immediately right of this one.
   * @param {Orientation} orientation
   */
  set right (orientation) {
    this._right = orientation

    // Set the left side of the current right side. This ensures that the 2-way
    // referencing is correct.
    orientation.left = this
  }
}
