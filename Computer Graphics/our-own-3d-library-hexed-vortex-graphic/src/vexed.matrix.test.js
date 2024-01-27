import { deepEqual, throws } from 'assert/strict'
// import {describe, expect, test} from '@jest/globals';
import {
  Matrix,
  getOrthographicProjectionMatrix,
  getPerspectiveProjectionMatrix,
  getRotationMatrix,
  getScaleMatrix,
  getTranslationMatrix
} from '../src/vexed-matrix'

describe('The new Matrix', () => {
  it('initializes to the identity matrix', () => {
    const matrix = new Matrix()
    deepEqual(matrix.matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  })

  it('throws on an invalid matrix entry', () => {
    const invalidMatrix = () => {
      const matrix = new Matrix([])
    }
    expect(invalidMatrix).toThrow(Error)
  })

  it('generates rows correctly', () => {
    const matrix = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    deepEqual(matrix.rows, [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16]
    ])
  })

  it('generates columns correctly', () => {
    const mat = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    deepEqual(mat.cols, [
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15],
      [4, 8, 12, 16]
    ])
  })
})

describe('Matrix multiplication', () => {
  it('throws when other is not a matrix or a number', () => {
    const defaultMatrix = new Matrix()
    const translatedByOneMatrix = new Set()
    const invalidMultiplication = () => {
      defaultMatrix.multiply(translatedByOneMatrix)
    }
    expect(invalidMultiplication).toThrow(Error)
  })
  it('multiplies a matrix by a number', () => {
    const defaultMatrix = new Matrix()
    deepEqual(defaultMatrix.multiply(2).matrix, new Matrix([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2]).matrix)
  })
  it('multiplies a matrix by matrix', () => {
    const defaultMatrix = new Matrix()
    const translatedByOneMatrix = new Matrix([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2])
    deepEqual(
      defaultMatrix.multiply(translatedByOneMatrix).matrix,
      new Matrix([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2]).matrix
    )
  })
})

describe('Matrix transposition/conversion to GLSL', () => {
  it('works with the identity matrix', () => {
    const matrix = new Matrix()
    deepEqual(matrix.transpose().matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  })
  it('works with a custom matrix', () => {
    const matrix = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    deepEqual(matrix.transpose().matrix, [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16])
  })
})

describe('The transformation matrices', () => {
  it('works to get the translation matrix', () => {
    const matrix = getTranslationMatrix(1, 1, 0)
    deepEqual(matrix.matrix, [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1])
  })
  it('works to get the default translation matrix', () => {
    const matrix = getTranslationMatrix()
    deepEqual(matrix.matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  })
  it('works to get the scale matrix', () => {
    const matrix = getScaleMatrix(2, 2, 2)
    deepEqual(matrix.matrix, [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1])
  })
  it('works to get the default scale matrix', () => {
    const matrix = getScaleMatrix()
    deepEqual(matrix.matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  })
  it('works to throw rotation error', () => {
    const invalidRotation = () => {
      const matrix = getRotationMatrix(90, 0, 0, 0)
    }
    expect(invalidRotation).toThrow(Error)
  })
  // Due to rounding issues in JS, 1/3 and 1 / 3 - 1 / Math.sqrt(3) don't seem to be rounding in the same place at the end
  it('works to get the rotation matrix', () => {
    const matrix = getRotationMatrix(90, 1, 1, 1)
    deepEqual(matrix.matrix, [
      0.3333333333333334,
      -0.24401693585629247,
      1 / 3 + 1 / Math.sqrt(3),
      0,
      1 / 3 + 1 / Math.sqrt(3),
      0.3333333333333334,
      -0.24401693585629247,
      0,
      -0.24401693585629247,
      1 / 3 + 1 / Math.sqrt(3),
      0.3333333333333334,
      0,
      0,
      0,
      0,
      1
    ])
  })

  it('works to get the default rotation matrix', () => {
    const matrix = getRotationMatrix()
    deepEqual(matrix.matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  })

  it('works to get the perspective projection matrix', () => {
    const matrix = getPerspectiveProjectionMatrix(5, 10, 5, -5, 5, -5)
    deepEqual(matrix.matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -3, -20, 0, 0, -1, 0])
  })
  // Maya
  it('works to get the orthographic matrix', () => {
    const matrix = getOrthographicProjectionMatrix(5, 10, 10, -10, 5, -5)
    deepEqual(matrix.matrix, [2 / 20, 0, 0, -0, 0, 2 / 10, 0, -0, 0, 0, -2 / 5, -3, 0, 0, 0, 1])
  })
  // Jen - square
  it('works to get the orthographic matrix 2', () => {
    const matrix = getOrthographicProjectionMatrix(10, 20, 20, -20, 20, -20)
    // prettier-ignore
    deepEqual(matrix.matrix, [2 / 40, 0, 0, -0/40, 
                                    0, 2 / 40, 0, -(0/40), 
                                    0, 0, -2 / 10, -(30/10), 
                                    0, 0, 0, 1])
  })
  // Garrett - rectangle
  it('works to get the orthographic matrix 3', () => {
    const matrix = getOrthographicProjectionMatrix(10, 20, 10, -10, 10, -10)
    // prettier-ignore
    deepEqual(matrix.matrix, [2 / 20, 0, 0, -(0/20), 
                                0, 2 / 20, 0, -(0/20), 
                                0, 0, -2 /10, -(30/10), 
                                0, 0, 0, 1])
  })
})
