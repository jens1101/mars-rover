import { Orientation } from './Orientation.js'

/**
 * @type {Orientation}
 */
const north = new Orientation('N', (x, y) => ({ x: x, y: y + 1 }))

/**
 * @type {Orientation}
 */
const east = new Orientation('E', (x, y) => ({ x: x + 1, y: y }))

/**
 * @type {Orientation}
 */
const south = new Orientation('S', (x, y) => ({ x: x, y: y - 1 }))

/**
 * @type {Orientation}
 */
const west = new Orientation('W', (x, y) => ({ x: x - 1, y: y }))

// Assigning what is left and right from each orientation. We only assign the
// right sides, because that setter will automatically set the left side of the
// assigned orientation. We could have also only assigned left sides; the end
// effect would have been the same.
north.setRight(east)
east.setRight(south)
south.setRight(west)
west.setRight(north)

/**
 * All the orientations that are valid for this project. This only includes
 * the main cardinal directions North, South, East, and West.
 *
 * In all of the move functions we assume that a cartesian coordinate system is
 * used.
 * @namespace
 */
export const orientations = { north, east, west, south }
