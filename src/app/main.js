import { parseCommands } from './command-parser.js'
import {
  MS_DELAY_BETWEEN_ROVER_MOVEMENTS,
  SceneSvgRenderer
} from './SceneSvgRenderer.js'

/**
 * Initialises this application
 * @param {HTMLFormElement} commandForm The form that contains the text area
 * where the user enters commands.
 * @param {HTMLElement} errorAlert An element where errors can be displayed.
 * @param {SVGElement} scene The SVG element in which the scene will be
 * rendered.
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
 * Runs the specified commands. The plateau will be rendered and each rover
 * movement will be executed with a delay between each movement.
 * @param {string} commands The commands to execute
 * @param {SceneSvgRenderer} renderer The renderer that will be used to render
 * the scene.
 * @return {Promise<void>} Resolves once all commands have been executed.
 */
async function runCommands (commands, renderer) {
  const { plateau, allRoversMovements } = parseCommands(commands)

  // Render the plateau
  renderer.drawPlateau(plateau)

  // Render each movement of the rover(s)
  for (const roverMovements of allRoversMovements) {
    const asyncRoverMovements = iterateOverRoverMovements(roverMovements,
      MS_DELAY_BETWEEN_ROVER_MOVEMENTS)

    for await (const rover of asyncRoverMovements) {
      renderer.drawRoverMovement(rover)
    }
  }
}

/**
 * Iterates over the specified rover movements and adds a delay between each
 * movement.
 * @param {Generator<MarsRover>} roverMovements
 * @param {number} delay The delay in milliseconds
 * @return {AsyncGenerator<MarsRover>}
 */
async function * iterateOverRoverMovements (roverMovements, delay) {
  for (const rover of roverMovements) {
    yield new Promise(resolve => {
      setTimeout(() => resolve(rover), delay)
    })
  }
}
