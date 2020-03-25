import assert from 'assert'
import { Plateau } from './Plateau.js'

it('Can create a new plateau', () => {
  assert.doesNotThrow(() => new Plateau(1, 1))
})

it('Creating a too small plateau causes an error', () => {
  assert.throws(() => new Plateau(0, 0))
  assert.throws(() => new Plateau(-1, 10))
  assert.throws(() => new Plateau(10, -1))
  assert.throws(() => new Plateau(-1, -1))
})

it('`isInPlateau` works correctly', () => {
  const plateau = new Plateau(5, 5)

  assert.strictEqual(plateau.isInPlateau(3, 3), true)
  assert.strictEqual(plateau.isInPlateau(0, 0), true)
  assert.strictEqual(plateau.isInPlateau(5, 0), true)
  assert.strictEqual(plateau.isInPlateau(0, 5), true)
  assert.strictEqual(plateau.isInPlateau(5, 5), true)

  assert.strictEqual(plateau.isInPlateau(-1, 0), false)
  assert.strictEqual(plateau.isInPlateau(0, -1), false)
  assert.strictEqual(plateau.isInPlateau(-1, -1), false)
  assert.strictEqual(plateau.isInPlateau(0, 6), false)
  assert.strictEqual(plateau.isInPlateau(6, 0), false)
  assert.strictEqual(plateau.isInPlateau(6, 6), false)
  assert.strictEqual(plateau.isInPlateau(-1, 6), false)
})
