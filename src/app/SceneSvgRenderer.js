const SVG_NAME_SPACE = 'http://www.w3.org/2000/svg'

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

    /** @type {SVGGElement} */
    this._sceneGroup = document.createElementNS(SVG_NAME_SPACE, 'g')
    this._svgElement.appendChild(this._sceneGroup)

    /** @type {Plateau} */
    this._plateau = plateau

    /**
     * @type {Map<MarsRover, Point[]>}
     */
    this._roversData = new Map()
  }

  drawPlateau () {
    const minX = this._plateau.minX
    const minY = this._plateau.minY
    const maxX = this._plateau.maxX
    const maxY = this._plateau.maxY

    // Set the new view box
    this._svgElement.setAttribute('viewBox', `${minX} ${minY} ${maxX} ${maxY}`)

    // Effectively convert the scene's coordinate system to cartesian
    this._sceneGroup.setAttribute('transform',
      `translate(0, ${maxY}) scale(1, -1)`)

    const gridLineGroup = document.createElementNS(SVG_NAME_SPACE, 'g')
    gridLineGroup.setAttribute('fill', 'transparent')
    gridLineGroup.setAttribute('stroke', 'lightgrey')
    gridLineGroup.setAttribute('stroke-width', '0.1')

    // Add grid lines
    for (let x = minX; x <= maxX; x++) {
      const gridLine = document.createElementNS(SVG_NAME_SPACE, 'path')
      gridLine.setAttribute('d', `M ${x} ${minY} V ${maxY}`)
      gridLineGroup.appendChild(gridLine)
    }
    for (let y = minY; y <= maxY; y++) {
      const gridLine = document.createElementNS(SVG_NAME_SPACE, 'path')
      gridLine.setAttribute('d', `M ${minX} ${y} H ${maxX}`)
      gridLineGroup.appendChild(gridLine)
    }

    this._sceneGroup.appendChild(gridLineGroup)
  }

  drawRoverMovement (rover) {
    // TODO: implement
    // TODO: remove the console log
    console.log(`x: ${rover.x} y: ${rover.y} orientation: ${rover.orientation.symbol}`)
  }
}
