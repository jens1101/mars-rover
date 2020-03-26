import { strict as assert } from 'assert'
import { Orientation } from '../orientations/Orientation.js'
import { orientations } from '../orientations/orientations.js'
import { Plateau } from '../plateau/Plateau.js'
import { MarsRover } from './MarsRover.js'

const defaultPlateau = new Plateau(5, 5)

it('Can create a new mars rover', () => {
  assert.doesNotThrow(() =>
    new MarsRover(defaultPlateau, 0, 0, orientations.north))
})

it('Crating a mars rover out of bounds throws an error', () => {
  assert.throws(() => new MarsRover(defaultPlateau, -1, 0, orientations.north))
  assert.throws(() => new MarsRover(defaultPlateau, 0, -1, orientations.north))
  assert.throws(() => new MarsRover(defaultPlateau, -1, -1, orientations.north))
  assert.throws(() => new MarsRover(defaultPlateau, 6, 0, orientations.north))
  assert.throws(() => new MarsRover(defaultPlateau, 0, 6, orientations.north))
  assert.throws(() => new MarsRover(defaultPlateau, 6, 0, orientations.north))
  assert.throws(() => new MarsRover(defaultPlateau, -1, 6, orientations.north))
  assert.throws(() => new MarsRover(defaultPlateau, 6, 3, orientations.north))
})

it('Using invalid directions throw errors', () => {
  const myNorth = new Orientation('N', (x, y) => ({ x: x, y: y + 1 }))

  assert.throws(() => new MarsRover(defaultPlateau, 6, 3, myNorth))
  assert.throws(() => {
    const rover = new MarsRover(defaultPlateau, 0, 0, orientations.north)
    rover.setOrientation(myNorth)
  })
})

it('Turning left and right should work intuitively', () => {
  const rover = new MarsRover(defaultPlateau, 0, 0, orientations.north)

  assert.doesNotThrow(() => rover.turnLeft())
  assert.doesNotThrow(() => rover.turnLeft().turnLeft().turnLeft().turnLeft())
  assert.doesNotThrow(() => rover.turnLeft().turnRight().turnLeft().turnRight())
  assert.doesNotThrow(() => rover.turnRight())
  assert.doesNotThrow(() =>
    rover.turnRight().turnRight().turnRight().turnRight())

  rover.setOrientation(orientations.north)
  assert.equal(rover.turnLeft().orientation, orientations.west)

  rover.setOrientation(orientations.north)
  assert.equal(rover.turnLeft().turnLeft().orientation, orientations.south)

  rover.setOrientation(orientations.north)
  assert.equal(rover.turnLeft().turnLeft().turnLeft().turnLeft().orientation,
    orientations.north)

  rover.setOrientation(orientations.north)
  assert.equal(rover.turnRight().orientation, orientations.east)

  rover.setOrientation(orientations.north)
  assert.equal(rover.turnRight().turnRight().orientation, orientations.south)
})
