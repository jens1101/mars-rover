import { Orientation } from './Orientation.js'

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
