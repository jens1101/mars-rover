import { orientations } from '../orientations/orientations.js'

export const MS_DELAY_BETWEEN_ROVER_MOVEMENTS = 400

/**
 * The namespace to use for all SVG element constructions
 * @type {string}
 */
const SVG_NAME_SPACE = 'http://www.w3.org/2000/svg'
/**
 * How thick the grid lines should be
 * @type {number}
 */
const GRID_LINE_THICKNESS = 0.05
/**
 * The rover is represented by an equilateral triangle. This radius determines
 * how large it is
 * @type {number}
 */
const ROVER_ARROW_RADIUS = 0.2
/**
 * The path that will draw a rover arrow.
 * @type {string}
 */
const ROVER_ARROW_PATH =
  `M ${-ROVER_ARROW_RADIUS * Math.sin(2 * Math.PI / 3)}
  ${ROVER_ARROW_RADIUS * Math.cos(2 * Math.PI / 3)}
  L 0 ${ROVER_ARROW_RADIUS}
  L ${-ROVER_ARROW_RADIUS * Math.sin(4 * Math.PI / 3)}
  ${ROVER_ARROW_RADIUS * Math.cos(4 * Math.PI / 3)}`

/**
 * All rover-related data that is needed to accurately draw its path and arrow
 * on the grid.
 * @typedef SceneSvgRenderer~RoverData
 * @property {SVGPathElement} path The element that is used to trace the path
 * of the rover.
 * @property {SVGGElement} arrow The arrow that represents the rover.
 * @property {Orientation} previousOrientation The previous orientation of
 * the rover. This is used to accurately animate the rotation of the rover as
 * it moves on the grid.
 * @property {number} arrowRotation The current rotation of the rover arrow
 * in degrees. This is used to set the CSS rotation of the rover arrow.
 */

/**
 * Renders the plateau and mars rovers' movements on a SVG
 */
export class SceneSvgRenderer {
  /**
   * Creates a new instance of this renderer. This appends all the necessary
   * elements to the SVG to render the scene.
   *
   * **Note** that the SVG is not cleared, any existing elements inside of it
   * will be preserved.
   * @param {SVGElement} svgElement
   */
  constructor (svgElement) {
    /**
     * This scene's SVG element. Everything is rendered inside of this.
     * @type {SVGElement}
     * @private
     */
    this._svgElement = svgElement
    this._svgElement.setAttribute('xmlns', SVG_NAME_SPACE)

    // noinspection JSValidateTypes
    /**
     * Contains all the style declarations of this scene
     * @type {SVGStyleElement}
     */
    const styleElement = document.createElementNS(SVG_NAME_SPACE, 'style')
    styleElement.appendChild(document.createTextNode(`
      .grid-lines {
        fill: transparent;
        stroke: lightgrey;
        stroke-width: ${GRID_LINE_THICKNESS};
        stroke-linecap: square;
      }
      
      .rover-path {
        fill: transparent;
        stroke: black;
        stroke-width: ${GRID_LINE_THICKNESS};
      }
      
      .rover-arrows {
        fill: orange;
        stroke: black;
        stroke-width: ${GRID_LINE_THICKNESS};
        stroke-linecap: square;
      }
      
      .rover-arrow {
        transition: transform ${MS_DELAY_BETWEEN_ROVER_MOVEMENTS / 1000}s;
      }
    `))
    this._svgElement.appendChild(styleElement)

    // noinspection JSValidateTypes
    /**
     * Contains all the grid lines of this scene
     * @type {SVGGElement}
     * @private
     */
    this._gridLines = document.createElementNS(SVG_NAME_SPACE, 'g')
    this._gridLines.classList.add('grid-lines')
    this._svgElement.appendChild(this._gridLines)

    // noinspection JSValidateTypes
    /**
     * Contains all the rovers' paths of this scene
     * @type {SVGGElement}
     * @private
     */
    this._roverPaths = document.createElementNS(SVG_NAME_SPACE, 'g')
    this._roverPaths.classList.add('rover-path')
    this._svgElement.appendChild(this._roverPaths)

    // noinspection JSValidateTypes
    /**
     * Contains all the rovers' arrows of this scene
     * @type {SVGGElement}
     * @private
     */
    this._roverArrows = document.createElementNS(SVG_NAME_SPACE, 'g')
    this._roverArrows.classList.add('rover-arrows')
    this._svgElement.appendChild(this._roverArrows)

    /**
     * Associates a rover instance will all the data that is needed to render
     * it in the current scene.
     * @type {Map<MarsRover, SceneSvgRenderer~RoverData>}
     * @private
     */
    this._roversData = new Map()
  }

  /**
   * Sets and draws the given plateau.
   * @param {Plateau} plateau
   */
  drawPlateau (plateau) {
    /**
     * The plateau on which the rovers move
     * @type {Plateau}
     * @private
     */
    this._plateau = plateau

    const minX = this._plateau.minX
    const minY = this._plateau.minY
    const maxX = this._plateau.maxX
    const maxY = this._plateau.maxY

    this.clear()

    // Set the new view box. We add a bit extra on the sides so that the
    // grid lines and rover arrows around the edges are not cut off
    const viewBoxPadding = ROVER_ARROW_RADIUS + GRID_LINE_THICKNESS / 2
    this._svgElement.setAttribute('viewBox',
      `${minX - viewBoxPadding} ${minY - viewBoxPadding} 
      ${maxX + viewBoxPadding * 2} ${maxY + viewBoxPadding * 2}`)

    // Add the grid lines
    for (let x = minX; x <= maxX; x++) {
      const gridLine = document.createElementNS(SVG_NAME_SPACE, 'path')
      gridLine.setAttribute('d', `M ${x} ${minY} V ${maxY}`)
      this._gridLines.appendChild(gridLine)
    }
    for (let y = minY; y <= maxY; y++) {
      const gridLine = document.createElementNS(SVG_NAME_SPACE, 'path')
      gridLine.setAttribute('d', `M ${minX} ${y} H ${maxX}`)
      this._gridLines.appendChild(gridLine)
    }
  }

  /**
   * This empties all the top-level groups of the current SVG. This effectively
   * blanks the scene, but doesn't clear everything from the SVG.
   */
  clear () {
    while (this._gridLines.firstChild) {
      this._gridLines.firstChild.remove()
    }
    while (this._roverPaths.firstChild) {
      this._roverPaths.firstChild.remove()
    }
    while (this._roverArrows.firstChild) {
      this._roverArrows.firstChild.remove()
    }
  }

  /**
   * Renders the specified rover in this scene. If the rover is already in the
   * scene then it's movements and orientation will be updated. If not then it
   * will be added to the scene.
   * @param {MarsRover} rover The rover to add or update in the scene.
   */
  drawRoverMovement (rover) {
    // We define the X and Y values of the rover on this SVG. The rover uses
    // cartesian coordinates, therefore we need to adjust the Y value to fit
    // screen coordinates.
    const x = rover.x
    const y = this._plateau.maxY - rover.y

    // If the rover doesn't exist in the scene yet then add it.
    if (!this._roversData.has(rover)) {
      const path = document.createElementNS(SVG_NAME_SPACE, 'path')
      path.setAttribute('d', `M ${x} ${y}`)
      this._roverPaths.appendChild(path)

      // The arrow is drawn around the origin and is then translated and rotated
      // to its correct position and orientation.
      //
      // The actual arrow path is inside a group element. We do this so that we
      // can animate the rotation of the arrow without animating its translation
      const arrow = document.createElementNS(SVG_NAME_SPACE, 'g')
      const arrowPath = document.createElementNS(SVG_NAME_SPACE, 'path')
      arrowPath.classList.add('rover-arrow')
      arrowPath.setAttribute('d', ROVER_ARROW_PATH)
      arrow.appendChild(arrowPath)
      this._roverArrows.appendChild(arrow)

      // Initialise the rotation of the arrow
      let arrowRotation
      switch (rover.orientation) {
        case orientations.north:
          arrowRotation = 180
          break
        case orientations.east:
          arrowRotation = 270
          break
        case orientations.south:
          arrowRotation = 0
          break
        case orientations.west:
          arrowRotation = 90
          break
      }

      // noinspection JSCheckFunctionSignatures
      this._roversData.set(rover, {
        path,
        arrow,
        previousOrientation: rover.orientation,
        arrowRotation
      })
    }

    const roverData = this._roversData.get(rover)

    // Update the path of the rover. If the rover was just added to the scene
    // then this has no effect.
    roverData.path.setAttribute('d',
      `${roverData.path.getAttribute('d')} L ${x} ${y}`)

    // Update the rotation of the rover arrow. Add 90 degrees if it turned
    // right, and subtract 90 degrees if it turned left.
    if (rover.orientation === roverData.previousOrientation.getLeft()) {
      roverData.arrowRotation -= 90
    } else if (rover.orientation === roverData.previousOrientation.getRight()) {
      roverData.arrowRotation += 90
    }

    // Apply the transforms
    roverData.arrow.style.transform = `translate(${x}px, ${y}px)`
    // noinspection JSUnresolvedVariable
    roverData.arrow.firstChild.style.transform = `rotate(${roverData.arrowRotation}deg)`

    // Update the previous orientation
    roverData.previousOrientation = rover.orientation
  }
}
