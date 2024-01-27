import { BufferGeometry, BufferAttribute, MeshPhongMaterial, Mesh, Group } from 'three'
const SQRT_3 = Math.sqrt(3)
// prettier-ignore
const BASE_VERTICES = [
  [1, 1, 0], // 0: Right side
  [-1, 1, 0], // 1: Left side
  [1 / 2, 1, SQRT_3 / 2], // 2: Front Right
  [-1 / 2, 1, SQRT_3 / 2], // 3: Front Left
  [1 / 2, 1, -SQRT_3 / 2], // 4: Back Right
  [-1 / 2, 1, -SQRT_3 / 2], // 5: Back Left

  [1, -1.5, 0], // 6: Right side
  [-1, -1.5, 0], // 7: Left side
  [1 / 2, -1.5, SQRT_3 / 2], // 8: Front Right
  [-1 / 2, -1.5, SQRT_3 / 2], // 9: Front Left
  [1 / 2, -1.5, -SQRT_3 / 2], // 10: Back Right
  [-1 / 2, -1.5, -SQRT_3 / 2] // 11: Back Left
]

const COLORS = [[1, 1, 1]]

const createTeacupGeometry = () => {
  const geometry = new BufferGeometry()

  const vertices = new Float32Array([
    ...BASE_VERTICES[0],
    ...BASE_VERTICES[1],
    ...BASE_VERTICES[2],
    ...BASE_VERTICES[3],
    ...BASE_VERTICES[4],
    ...BASE_VERTICES[5],
    ...BASE_VERTICES[6],
    ...BASE_VERTICES[7],
    ...BASE_VERTICES[8],
    ...BASE_VERTICES[9],
    ...BASE_VERTICES[10],
    ...BASE_VERTICES[11]
  ])

  geometry.setAttribute('position', new BufferAttribute(vertices, 3))

  // prettier-ignore
  const colors = new Float32Array([
      ...COLORS[0],
      ...COLORS[0],
      ...COLORS[0],
      ...COLORS[0],
      ...COLORS[0],
      ...COLORS[0],
      ...COLORS[0],
      ...COLORS[0],
      ...COLORS[0],
      ...COLORS[0],
      ...COLORS[0],
      ...COLORS[0],
    ])

  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  // prettier-ignore
  geometry.setIndex([
      3, 8, 2,
      3, 9, 8,
      2, 8, 6,
      2, 6, 0,
      0, 6, 10,
      0, 10, 4,
      4, 10, 11,
      4, 11, 5,
      5, 11, 7,
      5, 7, 1,
      1, 7, 9,
      1, 9, 3,
      3, 9, 8,
      3, 8, 2,
      2, 8, 6,
      2, 6, 0,
      0, 6, 10,
      0, 10, 4,
      11, 7, 9,
      10, 8, 6,
      11, 9, 8,
      11, 8, 10
    ])

  geometry.computeVertexNormals()
  return geometry
}

class Teacup {
  constructor() {
    const cupGeometry = createTeacupGeometry()
    const cupMaterial = new MeshPhongMaterial({ vertexColors: true, side: 2 })
    const cupMesh = new Mesh(cupGeometry, cupMaterial)

    this.group = new Group()
    this.group.add(cupMesh)
  }
}

export default Teacup
