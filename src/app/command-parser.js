import { MarsRover } from '../mars-rover/MarsRover.js'
import { orientations } from '../orientations/orientations.js'
import { Plateau } from '../plateau/Plateau.js'

/**
 * A map that associates a rover movement command with a movement function
 * @type {Map<string, function(MarsRover)>}
 */
const roverPossibleMovementInstructions = new Map([
  ['M', (rover) => { rover.move() }],
  ['L', (rover) => { rover.turnLeft() }],
  ['R', (rover) => { rover.turnRight() }]
])

/**
 * Parses the specified string of commands into instructions for creating a
 * plateau, spawning mars rovers on it, and moving each one.
 * @param {string} commands A set of commands that creates a plateau, spawns
 * an arbitrary number of mars rovers, and moves each one.
 * @example Example commands that creates a 5x5 plateau and spawns 2 rovers
 * ```
 * 5 5
 * 1 2 N
 * LMLMLMLMM
 * 3 3 E
 * MMRMMRMRRM
 * ```
 * @return {{plateau: Plateau, allRoversMovements: Generator<MarsRover>[]}}
 * @throws {Error} When an incorrect number of commands is given.
 * @see {@link roverMovementIterator} The iterator function that is responsible
 * for generating the rover movements.
 */
export function parseCommands (commands) {
  const commandLines = commands.split('\n').map(line => line.trim())

  // Throw an error if an invalid number of commands has been given.
  if ((commandLines.length - 1) % 2 !== 0) {
    throw new Error('Invalid number of commands. The 1st command line is for ' +
      'plateau initialisation and then each subsequent set of 2 lines is for ' +
      'initialisation and movement of each rover.')
  }

  // Create the plateau based on the first command
  const plateau = parsePlateauCommands(commandLines.shift())

  // For every two lines following we want to create a rover and its movement
  // iterator.
  const allRoversMovements = []
  while (commandLines.length > 0) {
    allRoversMovements.push(parseRoverCommands(plateau,
      ...commandLines.splice(0, 2)))
  }

  return { plateau, allRoversMovements }
}

/**
 * Creates a plateau from the string of commands
 * @param {string} command The plateau creation command. The expected format
 * is: `[maxX] [maxY]` both of these must be numbers and separated by a space.
 * @return {Plateau}
 * @throws {Error} If the maximum X value is invalid
 * @throws {Error} If the maximum Y value is invalid
 */
function parsePlateauCommands (command) {
  const [maxX, maxY] = command.split(' ', 2)
    .map(character => parseInt(character))

  if (isNaN(maxX)) throw new Error('The specified maximum X value is invalid')

  if (isNaN(maxY)) throw new Error('The specified maximum Y value is invalid')

  return new Plateau(maxX, maxY)
}

/**
 * Parses the specified commands to create a new rover object and an iterator
 * that will execute the next movement each time it's `next` method is called.
 * @param {Plateau} plateau The plateau on which the rover will be spawned.
 * @param {string} initCommand A string that specifies on which coordinates the
 * rover will spawn and with which orientation. The expected format is:
 * `[startX] [startY] [orientation]` where startX and start Y are coordinate
 * integers within the bounds of the plateau and the orientation must be a
 * symbol from one of the orientations in the `orientations` object. All of
 * these instructions must be separated by a space.
 * @param {string} movementCommand A string of one or movement characters. No
 * spaces should separate these characters. Each character must be a key in the
 * `roverMovementIterator` map, otherwise an error will be thrown.
 * @return {Generator<MarsRover>}
 * @throws {Error} When invalid starting coordinates were given
 * @throws {Error} When an invalid start orientation was given
 * @throws {Error} When an invalid movement instruction was given
 * @see {@link orientations} All the possible starting orientations for the
 * rover.
 * @see {@link roverMovementIterator} All the possible movement commands that
 * can be issued.
 */
function parseRoverCommands (plateau, initCommand, movementCommand) {
  const initInstructions = initCommand.split(' ')

  // Get the starting X and Y coordinates
  const [startX, startY] = initInstructions.splice(0, 2)
    .map(character => parseInt(character))
  if (isNaN(startX)) throw new Error('The specified start X value is invalid')
  if (isNaN(startY)) throw new Error('The specified start Y value is invalid')

  // Get the starting orientation
  const orientation = Object.values(orientations)
    .find(orientation => orientation.symbol === initInstructions[0])
  if (!orientation) {
    throw new Error(`"${initInstructions[0]}" is an invalid orientation`)
  }

  // Validate all the movement instructions
  const movementInstructions = movementCommand.split('')
  movementInstructions.forEach(instruction => {
    if (!roverPossibleMovementInstructions.has(instruction)) {
      throw new Error(`"${instruction}" is an invalid rover movement`)
    }
  })

  // Create the new rover object
  const rover = new MarsRover(plateau, startX, startY, orientation)

  // Create a new iterator of all the rover movements
  return roverMovementIterator(rover, movementInstructions)
}

/**
 * An iterator that loops through the list of movement instructions for the
 * rover, yielding the rover object after each instruction was applied.
 * @param {MarsRover} rover The rover object to which the movements will be
 * applied
 * @param {string[]} movementInstructions All the movement instructions that
 * will be applied to the specified rover. Each instruction must be a key in
 * the `roverPossibleMovementInstructions` map, otherwise this function will
 * fail.
 * @yields {MarsRover} The first yield gets the rover as it was spawned.
 * Thereafter we yield the rover object after applying each movement
 * instruction.
 * @returns {Generator<MarsRover>}
 */
function * roverMovementIterator (rover, movementInstructions) {
  // First yield the initial position of the rover
  yield rover

  // Now go through each instruction, execute it, and then yield the rover
  // object after the execution.
  for (const instruction of movementInstructions) {
    roverPossibleMovementInstructions.get(instruction)(rover)
    yield rover
  }
}
