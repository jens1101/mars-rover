import { orientations } from '../orientations/orientations.js'

export const MS_DELAY_BETWEEN_ROVER_MOVEMENTS = 400

const SVG_NAME_SPACE = 'http://www.w3.org/2000/svg'
const GRID_LINE_THICKNESS = 0.05
const ROVER_ARROW_RADIUS = 0.2
const ROVER_ARROW_PATH = `M 0 ${ROVER_ARROW_RADIUS}
  L ${-ROVER_ARROW_RADIUS * Math.sin(2 * Math.PI / 3)}
  ${ROVER_ARROW_RADIUS * Math.cos(2 * Math.PI / 3)}
  L ${-ROVER_ARROW_RADIUS * Math.sin(4 * Math.PI / 3)}
  ${ROVER_ARROW_RADIUS * Math.cos(4 * Math.PI / 3)} Z`

// TODO: use CSS instead of attributes
// TODO: use transitions for animations

export class SceneSvgRenderer {
  /**
   *
   * @param {SVGElement} svgElement
   */
  constructor (svgElement) {
    /** @type {SVGElement} */
    this._svgElement = svgElement
    this._svgElement.setAttribute('xmlns', SVG_NAME_SPACE)

    this._gridLines = document.createElementNS(SVG_NAME_SPACE, 'g')
    this._gridLines.setAttribute('fill', 'transparent')
    this._gridLines.setAttribute('stroke', 'lightgrey')
    this._gridLines.setAttribute('stroke-width', `${GRID_LINE_THICKNESS}`)
    this._gridLines.setAttribute('stroke-linecap', 'square')
    this._svgElement.appendChild(this._gridLines)

    this._roverPaths = document.createElementNS(SVG_NAME_SPACE, 'g')
    this._roverPaths.setAttribute('fill', 'transparent')
    this._roverPaths.setAttribute('stroke', 'black')
    this._roverPaths.setAttribute('stroke-width', `${GRID_LINE_THICKNESS}`)
    this._roverPaths.setAttribute('stroke-linecap', 'round')
    this._svgElement.appendChild(this._roverPaths)

    this._roverArrows = document.createElementNS(SVG_NAME_SPACE, 'g')
    this._roverArrows.setAttribute('fill', 'orange')
    this._roverArrows.setAttribute('stroke', 'black')
    this._roverArrows.setAttribute('stroke-width', `${GRID_LINE_THICKNESS}`)
    this._svgElement.appendChild(this._roverArrows)

    /**
     * @type {Map<MarsRover, {path: SVGPathElement, arrow: SVGPathElement}>}
     */
    this._roversData = new Map()
  }

  setPlateau (plateau) {
    /** @type {Plateau} */
    this._plateau = plateau
  }

  drawPlateau () {
    const minX = this._plateau.minX
    const minY = this._plateau.minY
    const maxX = this._plateau.maxX
    const maxY = this._plateau.maxY

    this.clear()

    // Set the new view box. We add a bit extra on the sides so that the
    // grid lines around the edges can render properly
    const viewBoxPadding = ROVER_ARROW_RADIUS + GRID_LINE_THICKNESS / 2
    this._svgElement.setAttribute('viewBox',
      `${minX - viewBoxPadding} ${minY - viewBoxPadding} 
      ${maxX + viewBoxPadding * 2} ${maxY + viewBoxPadding * 2}`)

    // Add grid lines
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
   *
   * @param {MarsRover} rover
   */
  drawRoverMovement (rover) {
    const x = rover.x
    const y = this._plateau.maxY - rover.y

    if (!this._roversData.has(rover)) {
      const path = document.createElementNS(SVG_NAME_SPACE, 'path')
      path.setAttribute('d', `M ${x} ${y}`)
      this._roverPaths.appendChild(path)

      const arrow = document.createElementNS(SVG_NAME_SPACE, 'path')
      arrow.setAttribute('d', ROVER_ARROW_PATH)
      this._roverArrows.appendChild(arrow)

      this._roversData.set(rover, { path, arrow })
    }

    const { path, arrow } = this._roversData.get(rover)
    path.setAttribute('d', path.getAttribute('d') + ` L ${x} ${y}`)

    let rotation
    switch (rover.orientation) {
      case orientations.north:
        rotation = 180
        break
      case orientations.east:
        rotation = 270
        break
      case orientations.south:
        rotation = 0
        break
      case orientations.west:
        rotation = 90
        break
    }

    arrow.setAttribute('transform', `translate(${x} ${y}) rotate(${rotation})`)
  }
}
