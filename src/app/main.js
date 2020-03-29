import { parseCommands } from './command-parser.js'
import {
  MS_DELAY_BETWEEN_ROVER_MOVEMENTS,
  SceneSvgRenderer
} from './SceneSvgRenderer.js'

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
  const renderer = new SceneSvgRenderer(scene)

  commandForm.addEventListener('submit', async event => {
    event.preventDefault()

    // Disable the run button and command text area while the commands are
    // running.
    runButton.disabled = true
    commandTextArea.disabled = true
    errorAlert.setAttribute('hidden', 'hidden')

    try {
      await runCommands(commandTextArea.value, renderer)
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
 * @param {SceneSvgRenderer} renderer
 * @return {Promise<void>}
 */
async function runCommands (commands, renderer) {
  const { plateau, allRoversMovements } = parseCommands(commands)

  renderer.drawPlateau(plateau)

  for (const roverMovements of allRoversMovements) {
    const asyncRoverMovements = iterateOverRoverMovements(roverMovements,
      MS_DELAY_BETWEEN_ROVER_MOVEMENTS)

    for await (const rover of asyncRoverMovements) {
      renderer.drawRoverMovement(rover)
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
