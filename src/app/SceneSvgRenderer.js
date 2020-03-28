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
   * @param {Plateau} plateau
   */
  constructor (svgElement, plateau) {
    /** @type {SVGElement} */
    this._svgElement = svgElement
    this._svgElement.setAttribute('xmlns', SVG_NAME_SPACE)

    /** @type {Plateau} */
    this._plateau = plateau

    /**
     * @type {Map<MarsRover, {path: SVGPathElement, arrow: SVGPathElement}>}
     */
    this._roversData = new Map()
  }

  drawPlateau () {
    const minX = this._plateau.minX
    const minY = this._plateau.minY
    const maxX = this._plateau.maxX
    const maxY = this._plateau.maxY

    // Set the new view box. We add a bit extra on the sides so that the
    // grid lines around the edges can render properly
    const viewBoxPadding = ROVER_ARROW_RADIUS + GRID_LINE_THICKNESS / 2
    this._svgElement.setAttribute('viewBox',
      `${minX - viewBoxPadding} ${minY - viewBoxPadding} 
      ${maxX + viewBoxPadding * 2} ${maxY + viewBoxPadding * 2}`)

    const gridLines = document.createElementNS(SVG_NAME_SPACE, 'g')
    gridLines.setAttribute('fill', 'transparent')
    gridLines.setAttribute('stroke', 'lightgrey')
    gridLines.setAttribute('stroke-width', `${GRID_LINE_THICKNESS}`)
    gridLines.setAttribute('stroke-linecap', 'square')

    // Add grid lines
    for (let x = minX; x <= maxX; x++) {
      const gridLine = document.createElementNS(SVG_NAME_SPACE, 'path')
      gridLine.setAttribute('d', `M ${x} ${minY} V ${maxY}`)
      gridLines.appendChild(gridLine)
    }
    for (let y = minY; y <= maxY; y++) {
      const gridLine = document.createElementNS(SVG_NAME_SPACE, 'path')
      gridLine.setAttribute('d', `M ${minX} ${y} H ${maxX}`)
      gridLines.appendChild(gridLine)
    }

    // Append the grid lines to the SVG
    this._svgElement.appendChild(gridLines)
  }

  /**
   *
   * @param {MarsRover} rover
   */
  drawRoverMovement (rover) {
    const x = rover.x
    const y = rover.plateau.maxY - rover.y

    if (!this._roversData.has(rover)) {
      // TODO: we can use SVG groups to make this shorter
      const path = document.createElementNS(SVG_NAME_SPACE, 'path')
      path.setAttribute('d', `M ${x} ${y}`)
      path.setAttribute('fill', 'transparent')
      path.setAttribute('stroke', 'black')
      path.setAttribute('stroke-width', `${GRID_LINE_THICKNESS}`)
      path.setAttribute('stroke-linecap', 'round')

      const arrow = document.createElementNS(SVG_NAME_SPACE, 'path')
      arrow.setAttribute('d', ROVER_ARROW_PATH)
      arrow.setAttribute('fill', 'orange')
      arrow.setAttribute('stroke', 'black')
      arrow.setAttribute('stroke-width', `${GRID_LINE_THICKNESS}`)

      this._roversData.set(rover, { path, arrow })
      this._svgElement.appendChild(path)
      this._svgElement.appendChild(arrow)
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
