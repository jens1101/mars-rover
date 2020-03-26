/* global it */

import { strict as assert } from 'assert'
import { Orientation } from './Orientation.js'
import { orientations } from './orientations.js'

it('Can create an orientation', () => {
  assert.doesNotThrow(() => new Orientation('N', (x, y) => ({
    x: x,
    y: y + 1
  })))

  // No actual parameter checking is done, so this should succeed
  // noinspection JSCheckFunctionSignatures
  assert.doesNotThrow(() => new Orientation())
})

it('Orientations are correctly ordered', () => {
  assert.equal(orientations.north.getRight(), orientations.east)
  assert.equal(orientations.east.getRight(), orientations.south)
  assert.equal(orientations.south.getRight(), orientations.west)
  assert.equal(orientations.west.getRight(), orientations.north)

  assert.equal(orientations.north.getLeft(), orientations.west)
  assert.equal(orientations.west.getLeft(), orientations.south)
  assert.equal(orientations.south.getLeft(), orientations.east)
  assert.equal(orientations.east.getLeft(), orientations.north)
})

it('Orientations form a nice cycle', () => {
  assert.equal(orientations.north.getLeft().getLeft().getLeft().getLeft(),
    orientations.north)

  assert.equal(orientations.north.getRight().getRight().getRight().getRight(),
    orientations.north)
})
