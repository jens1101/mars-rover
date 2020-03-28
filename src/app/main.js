// TODO: add rendering to the canvas

import { parseCommands } from './command-parser.js'
import {
  MS_DELAY_BETWEEN_ROVER_MOVEMENTS,
  SceneSvgRenderer
} from './SceneSvgRenderer.js'

// TODO: maybe use an SVG instead of a canvas. This isn't as full of shit and
//  scales much better.

/**
 *
 * @param {HTMLFormElement} commandForm
 * @param {HTMLElement} errorAlert
 * @param {SVGElement} scene
 */
export function init (commandForm, errorAlert, scene) {
  // noinspection JSUnresolvedVariable
  const runButton = commandForm.run
  // noinspection JSUnresolvedVariable
  const commandTextArea = commandForm.commands

  commandForm.addEventListener('submit', async event => {
    event.preventDefault()

    // Disable the run button and command text area while the commands are
    // running.
    runButton.disabled = true
    commandTextArea.disabled = true
    errorAlert.setAttribute('hidden', 'hidden')

    try {
      await runCommands(commandTextArea.value, scene)
    } catch (error) {
      errorAlert.textContent = error.message
      errorAlert.removeAttribute('hidden')
    } finally {
      // Always re-enable the buttons
      runButton.disabled = false
      commandTextArea.disabled = false
    }
  })
}

/**
 * @param {string} commands
 * @param {SVGElement} scene
 * @return {Promise<void>}
 */
async function runCommands (commands, scene) {
  // Clear the contents of the SVG
  while (scene.firstChild) {
    scene.firstChild.remove()
  }

  const { plateau, allRoversMovements } = parseCommands(commands)

  const sceneSvgRenderer = new SceneSvgRenderer(scene, plateau)
  sceneSvgRenderer.drawPlateau()

  for (const roverMovements of allRoversMovements) {
    const asyncRoverMovements = iterateOverRoverMovements(roverMovements,
      MS_DELAY_BETWEEN_ROVER_MOVEMENTS)

    for await (const rover of asyncRoverMovements) {
      sceneSvgRenderer.drawRoverMovement(rover)
    }
  }
}

async function * iterateOverRoverMovements (roverMovements, delay) {
  for (const rover of roverMovements) {
    yield new Promise(resolve => {
      setTimeout(() => resolve(rover), delay)
    })
  }
}
