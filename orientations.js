/**
 * All the orientations that are valid for this project. This only includes
 * the main cardinal directions North, South, East, and West.
 *
 * In all of the move functions we assume that a cartesian coordinate system is
 * used.
 *
 * The order of these orientations is important. They are ordered in a clockwise
 * fashion with North being the first orientation. This makes it easy to turn
 * left or right from any given orientation, because you simply get the next
 * or previous entry in the array.
 * @type {Orientation[]}
 */
export const orientations = [
  new Orientation('N', function (x, y) {
    return {
      x: x,
      y: y + 1
    }
  }),
  new Orientation('E', function (x, y) {
    return {
      x: x + 1,
      y: y
    }
  }),
  new Orientation('S', function (x, y) {
    return {
      x: x,
      y: y - 1
    }
  }),
  new Orientation('W', function (x, y) {
    return {
      x: x - 1,
      y: y
    }
  })
]

/**
 * A primitive class to handle cardinal directions
 */
// TODO: I wonder if this class should have a "left" and "right" property.
//  Then getting what is left or right of an orientation will be easier.
class Orientation {
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
