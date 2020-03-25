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

// TODO: I wonder if this class should have a "left" and "right" property.
//  Then getting what is left or right of an orientation will be easier.
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
}
