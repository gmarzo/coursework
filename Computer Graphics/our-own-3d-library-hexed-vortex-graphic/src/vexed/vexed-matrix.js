import Vector from "./vexed-vector"

class Matrix {
  // prettier-ignore
  constructor(matrix = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]) {
      if (matrix.length !== 16) {
        throw new Error('Invalid matrix size, matey')
      }
      this.matrix = matrix 
      // prettier-ignore
      this.rows = [
        [this.matrix[0], this.matrix[1], this.matrix[2], this.matrix[3]],
        [this.matrix[4], this.matrix[5], this.matrix[6], this.matrix[7]],
        [this.matrix[8], this.matrix[9], this.matrix[10], this.matrix[11]],
        [this.matrix[12], this.matrix[13], this.matrix[14], this.matrix[15]]
      ]
      // prettier-ignore
      this.cols = [
        [this.matrix[0], this.matrix[4], this.matrix[8], this.matrix[12]],
        [this.matrix[1], this.matrix[5], this.matrix[9], this.matrix[13]],
        [this.matrix[2], this.matrix[6], this.matrix[10], this.matrix[14]],
        [this.matrix[3], this.matrix[7], this.matrix[11], this.matrix[15]]
      ]
    }
  multiply(other) {
    const newMatrix = []
    // Matrix * <invalid_value> case
    if (!(other instanceof Matrix || typeof other === 'number')) {
      throw new Error('Invalid multiplication matey')
    }
    // Matrix * Number case
    if (typeof other === 'number') {
      this.matrix.forEach(num => newMatrix.push(num * other))
      return new Matrix(newMatrix)
    }
    // Matrix * Matrix case
    else {
      for (let i = 0; i < this.rows.length; i++) {
        for (let j = 0; j < other.cols.length; j++) {
          let result = 0
          for (let k = 0; k < other.cols[j].length; k++) {
            result += this.rows[i][k] * other.cols[j][k]
          }
          newMatrix.push(result)
        }
      }
      return new Matrix(newMatrix)
    }
  }

  transpose() {
    //prettier-ignore
    return new Matrix([
        this.matrix[0], this.matrix[4], this.matrix[8], this.matrix[12],
        this.matrix[1], this.matrix[5], this.matrix[9], this.matrix[13],
        this.matrix[2], this.matrix[6], this.matrix[10], this.matrix[14],
        this.matrix[3], this.matrix[7], this.matrix[11], this.matrix[15]
      ])
  }
}

const getTranslationMatrix = (x = 0, y = 0, z = 0) => {
  // prettier-ignore
  return new Matrix([1, 0, 0, x,  
                     0, 1, 0, y,
                     0, 0, 1, z, 
                     0, 0, 0, 1])
}

const getScaleMatrix = (x = 1, y = 1, z = 1) => {
  //prettier-ignore
  return new Matrix([x, 0, 0, 0, 
                    0, y, 0, 0,  
                    0, 0, z, 0,  
                    0, 0, 0, 1])
}

//Copy-pasted from in-class code
const getRotationMatrix = (angle = 0, x = 1, y = 1, z = 1) => {
  if (x === 0 && y === 0 && z === 0) {
    throw new Error('Cannot rotate. Pick new vector axis - not all points can be zero.')
  }
  // In production code, this function should be associated
  // with a matrix object with associated functions.
  const axisLength = Math.sqrt(x * x + y * y + z * z)
  const s = Math.sin((angle * Math.PI) / 180.0)
  const c = Math.cos((angle * Math.PI) / 180.0)
  const oneMinusC = 1.0 - c

  // Normalize the axis vector of rotation.
  x /= axisLength
  y /= axisLength
  z /= axisLength

  // Now we can calculate the other terms.
  // "2" for "squared."
  const x2 = x * x
  const y2 = y * y
  const z2 = z * z
  const xy = x * y
  const yz = y * z
  const xz = x * z
  const xs = x * s
  const ys = y * s
  const zs = z * s

  // GL expects its matrices in column major order.
  return new Matrix([
    x2 * oneMinusC + c,
    xy * oneMinusC + zs,
    xz * oneMinusC - ys,
    0.0,

    xy * oneMinusC - zs,
    y2 * oneMinusC + c,
    yz * oneMinusC + xs,
    0.0,

    xz * oneMinusC + ys,
    yz * oneMinusC - xs,
    z2 * oneMinusC + c,
    0.0,

    0.0,
    0.0,
    0.0,
    1.0
  ]).transpose()
}

const getPerspectiveProjectionMatrix = (N, F, R, L, T, B) => {
  //prettier-ignore
  return new Matrix([(2*N)/(R-L), 0,(R+L)/(R-L),0,
                     0, (2*N)/(T-B), (T+B)/(T-B), 0,
                     0, 0, -(F+N)/(F-N), (-2*N*F)/(F-N),
                     0, 0, -1, 0])
}

const getOrthographicProjectionMatrix = (N, F, R, L, T, B) => {
  //prettier-ignore
  return new Matrix([2/(R-L), 0, 0, -(R+L)/(R-L),
                     0, 2/(T-B), 0, -(T+B)/(T-B),
                     0, 0, -2/(F-N), -(F+N)/(F-N),
                     0, 0, 0, 1])
}

const getCameraMatrix = (cameraPosition, cameraTarget, upVector) => {
  const cameraPosVector = new Vector(cameraPosition.x, cameraPosition.y, cameraPosition.z)
  const targetToCameraVector = new Vector(cameraTarget.x, cameraTarget.y, cameraTarget.z).subtract(cameraPosVector)
  const up = new Vector(upVector.x, upVector.y, upVector.z)
  const ze = (cameraPosVector.subtract(targetToCameraVector)).unit
  const ye = (up.subtract((up.projection(ze)))).unit
  const xe = ye.cross(ze).unit
  //prettier-ignore
  return new Matrix([xe.x, xe.y, xe.z, - (cameraPosVector.dot(xe)),
                     ye.x, ye.y, ye.z, - (cameraPosVector.dot(ye)),
                     ze.x, ze.y, ze.z, - (cameraPosVector.dot(ze)), 
                        0,    0,    0,    1])
}

export {
  Matrix,
  getPerspectiveProjectionMatrix,
  getRotationMatrix,
  getScaleMatrix,
  getTranslationMatrix,
  getOrthographicProjectionMatrix,
  getCameraMatrix
}
