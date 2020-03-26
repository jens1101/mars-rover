import { orientations } from '../orientations/orientations.js'

/**
 * A mars rover that roams around a plateau
 */
export class MarsRover {
  /**
   * Creates a new mars rover.
   * @param {Plateau} plateau The plateau on which the rover moves.
   * @param {number} startX The starting X coordinate of the rover.
   * @param {number} startY The starting Y coordinate of the rover.
   * @param {Orientation} orientation The starting orientation of the rover.
   */
  constructor (plateau, startX, startY, orientation) {
    this.plateau = plateau
    this.setPosition(startX, startY)

    this.validOrientations = orientations
    this.setOrientation(orientation)
  }

  /**
   * Sets the position of the rover to the specified X and Y confidantes.
   * @param {number} x
   * @param {number} y
   * @throws {Error} If the specified X and Y coordinates are not in the current
   * plateau.
   */
  setPosition (x, y) {
    if (!this.plateau.isInPlateau(x, y)) {
      throw new Error(`(${x}, ${y}) is not inside the plateau.`)
    }

    this.x = x
    this.y = y
  }

  /**
   * Sets the orientation of this rover to the specified orientation.
   * @param {Orientation} orientation
   * @throws {Error} When the given orientation doesn't belong to the array of
   * allowed orientations.
   */
  setOrientation (orientation) {
    if (!Object.values(this.validOrientations).includes(orientation)) {
      throw new Error(`The given orientation is not valid`)
    }

    this.orientation = orientation
  }

  /**
   * Turns this rover left at a right angle
   * @return {MarsRover} Returns the current mars rover instance for method
   * chaining
   */
  turnLeft () {
    this.orientation = this.orientation.getLeft()

    return this
  }

  /**
   * Turns this rover right at a right angle
   * @return {MarsRover} Returns the current mars rover instance for method
   * chaining
   */
  turnRight () {
    this.orientation = this.orientation.getRight()

    return this
  }

  /**
   * Moves this rover forward one grid point
   * @return {MarsRover} Returns the current mars rover instance for method
   * chaining
   * @throws {Error} When the new coordinates are outside the boundaries of the
   * plateau.
   */
  move () {
    const { x: newX, y: newY } = this.orientation.move(this.x, this.y)

    this.setPosition(newX, newY)

    return this
  }
}
