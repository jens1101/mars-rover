// TODO: add rendering to the canvas

import { parseCommands } from './command-parser.js'

const MS_DELAY_BETWEEN_ROVER_MOVEMENTS = 400

// TODO: maybe use an SVG instead of a canvas. This isn't as full of shit and
//  scales much better.

/**
 *
 * @param {HTMLFormElement} commandForm
 * @param {HTMLElement} errorAlert
 */
export function init (commandForm, errorAlert) {
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
      await runCommands(commandTextArea.value)
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
 * @return {Promise<void>}
 */
async function runCommands (commands) {
  const { plateau, allRoversMovements } = parseCommands(commands)

  initGridDisplay(plateau.maxX, plateau.maxY)

  for (const roverMovements of allRoversMovements) {
    let previousPosition = null
    const asyncRoverMovements = iterateOverRoverMovements(roverMovements,
      MS_DELAY_BETWEEN_ROVER_MOVEMENTS)

    for await (const rover of asyncRoverMovements) {
      drawRoverMovement(previousPosition, rover)
      previousPosition = { x: rover.x, y: rover.y }
    }
  }
}

/**
 * @param {number} width
 * @param {number} height
 */
function initGridDisplay (width, height) {
  // TODO: implement
  // TODO: remove the console log
  console.log(`Created plateau ${width} wide and ${height} high`)
}

async function * iterateOverRoverMovements (roverMovements, delay) {
  for (const rover of roverMovements) {
    yield new Promise(resolve => {
      setTimeout(() => resolve(rover), delay)
    })
  }
}

function drawRoverMovement (previousPosition, rover) {
  // TODO: implement
  // TODO: remove the console log
  console.log(`x: ${rover.x} y: ${rover.y} orientation: ${rover.orientation.symbol}`)
}
