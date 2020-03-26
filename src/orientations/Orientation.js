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
  getLeft () {
    return this._left
  }

  /**
   * Sets the orientation immediately left of this one.
   * @param {Orientation} orientation
   */
  setLeft (orientation) {
    // If the current orientation left of this one is equal to the given one
    // then do nothing. This avoids a stack overflow.
    if (this._left === orientation) {
      return
    }

    this._left = orientation

    // Set the right side of the current left side. This ensures that the 2-way
    // referencing is correct. This could cause a stack overflow, that is why
    // the above condition is in place
    orientation.setRight(this)
  }

  /**
   * Gets what orientation is immediately right of this one.
   * @return {Orientation}
   */
  getRight () {
    return this._right
  }

  /**
   * Sets the orientation immediately right of this one.
   * @param {Orientation} orientation
   */
  setRight (orientation) {
    // If the current orientation right of this one is equal to the given one
    // then do nothing. This avoids a stack overflow.
    if (this._right === orientation) {
      return
    }

    this._right = orientation

    // Set the left side of the current right side. This ensures that the 2-way
    // referencing is correct. This could cause a stack overflow, that is why
    // the above condition is in place
    orientation.setLeft(this)
  }
}
