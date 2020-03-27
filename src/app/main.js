// TODO: add rendering to the canvas

import { parseCommands } from './command-parser.js'

const MS_DELAY_BETWEEN_ROVER_MOVEMENTS = 400

/**
 *
 * @param {HTMLButtonElement} runButton
 * @param {HTMLTextAreaElement} commandTextArea
 * @param {HTMLCanvasElement} canvas
 */
export function bootstrap (runButton, commandTextArea, canvas) {
  runButton.addEventListener('click', async () => {
    // Disable the run button and command text area while the commands are
    // running.
    runButton.disabled = true
    commandTextArea.disabled = true

    try {
      // TODO: catch errors and display them
      await runCommands(commandTextArea.value)
    } finally {
      // Always re-enable the buttons
      runButton.disabled = false
      commandTextArea.disabled = false
    }
  })
}

async function runCommands (commands) {
  const { plateau, allRoversMovements } = parseCommands(commands)

  initGridDisplay(plateau.maxX, plateau.minY)

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

function initGridDisplay (width, height) {
  // TODO: implement
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
