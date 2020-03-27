/* global it */

import { strict as assert } from 'assert'
import { orientations } from '../orientations/orientations.js'
import { parseCommands } from './command-parser.js'

it('Should parse valid commands', () => {
  const commands = [
    `5 5
    1 2 N
    LMLMLMLMM
    3 3 E
    MMRMMRMRRM`,
    `100 20
    13 10 E
    LLRRLRMRMLRMRMMMLMLR
    9 6 S
    LLRLMRLMLMMLMMRLM
    55 5 N
    MRRLLLLRMLMMLRLRLMLLML
    83 15 S
    RRLMLRLMMLRLMRRR`,
    '1 1',
    `10 5
    1 2 N
    `
  ]

  for (const command of commands) {
    assert.doesNotThrow(() => parseCommands(command))
  }
})

it('Throws for valid commands', () => {
  const commands = [
    // Invalid Plateau construction
    `_ 5
    1 2 N
    LMLMRMLMM`,
    `5 _
    1 2 N
    LMLMRMLMM`,
    `5  5
    1 2 N
    LMLMRMLMM`,
    `0 0
    1 2 N
    LMLMRMLMM`,
    // Invalid rover construction
    `5 5
    N 1 2
    LMLMRMLMM`,
    `5 5
    _ 2 N
    LMLMRMLMM`,
    `5 5
    1 _ N
    LMLMRMLMM`,
    `5 5
    1 2 _
    LMLMRMLMM`,
    `5 5
    6 2 N
    LMLMRMLMM`,
    // Invalid rover movement
    `5 5
    1 2 N
    LMLM_MLMM`,
    `5 5
    1 2 N
    L M L M R M L M M`
  ]

  for (const command of commands) {
    assert.throws(() => parseCommands(command))
  }
})

it('Initialises the plateau with the correct values', () => {
  const { plateau } = parseCommands('10 5')

  assert.equal(plateau.maxX, 10)
  assert.equal(plateau.maxY, 5)
})

it('Initialises the rover with the correct values', () => {
  const commands =
    `10 5
    6 2 N
    `
  const { allRoversMovements: [roverMovements] } = parseCommands(commands)
  const { value: rover } = roverMovements.next()

  assert.equal(rover.x, 6)
  assert.equal(rover.y, 2)
  assert.equal(rover.orientation, orientations.north)
})

it('The rovers movements are correct', () => {
  const commands =
    `10 5
    6 2 N
    MLMRRM`
  const { allRoversMovements: [roverMovements] } = parseCommands(commands)
  const { value: rover } = roverMovements.next()

  roverMovements.next()
  assert.equal(rover.x, 6)
  assert.equal(rover.y, 3)
  assert.equal(rover.orientation, orientations.north)

  roverMovements.next()
  assert.equal(rover.x, 6)
  assert.equal(rover.y, 3)
  assert.equal(rover.orientation, orientations.west)

  roverMovements.next()
  assert.equal(rover.x, 5)
  assert.equal(rover.y, 3)
  assert.equal(rover.orientation, orientations.west)

  roverMovements.next()
  assert.equal(rover.x, 5)
  assert.equal(rover.y, 3)
  assert.equal(rover.orientation, orientations.north)

  roverMovements.next()
  assert.equal(rover.x, 5)
  assert.equal(rover.y, 3)
  assert.equal(rover.orientation, orientations.east)

  roverMovements.next()
  assert.equal(rover.x, 6)
  assert.equal(rover.y, 3)
  assert.equal(rover.orientation, orientations.east)

  assert.equal(roverMovements.next().done, true)
})
