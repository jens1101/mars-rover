export class Plateau {
  /**
   * Creates a new plateau on which the mars rovers can navigate. A cartesian
   * coordinate system is used the navigate the plateau.The minimum coordinates
   * are always (0, 0), but the maximum coordinates can be set via the
   * parameters.
   * @param {number} maxX The maximum X value for the plateau
   * @param {number} maxY The maximum Y value for the plateau
   */
  constructor (maxX, maxY) {
    this.minX = 0
    this.minY = 0

    if (maxX <= this.minX) throw new Error()

    this.maxX = maxX
    this.maxY = maxY
  }

  /**
   * Determines whether or not the given coordinates are within this plateau.
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  isInPlateau (x, y) {
    return x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY
  }
}
