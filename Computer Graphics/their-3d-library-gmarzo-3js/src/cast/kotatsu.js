import { BufferGeometry, BufferAttribute, BoxGeometry, MeshPhongMaterial, Mesh, Group, TextureLoader } from 'three'

// Wood texture image from: https://www.istockphoto.com/photos/wood-grain-table-top
import tabletop from '../textures/tabletop-texture.jpeg'

// Floral pattern image from: https://www.istockphoto.com/photo/fabric-with-flower-pattern-useful-for-texture-beautiful-antique-vintage-blue-floral-gm1161089914-318029566
import clothTexture from '../textures/blue-cloth.jpeg'

// prettier-ignore
const BASE_VERTICES = [
  [2.5, 0, 2.5],    // 0 Front right top corner
  [2.5, 0, -2.5],   // 1 Back right top corner
  [-2.5, 0, -2.5],  // 2 Back left top corner
  [-2.5, 0, 2.5],   // 3 Front left top corner
  [3, -1.5, 3],   // 4 Front right bottom corner
  [3, -1.5, -3],  // 5 Back right bottom corner
  [-3, -1.5, -3], // 6 Back left bottom corner
  [-3, -1.5, 3],  // 7 Front left bottom corner
]

// prettier-ignore
const COLORS = [
  [0.5, 0.0, 0.5] // 0 Purple
]

// prettier-ignore
const UV = [
  [0.2, 0.7], // 0
  [0.2, 1], // 1
  [0.8, 0.7], // 2
  [0.8, 1], // 3
]

const createClothGeometry = () => {
  const geometry = new BufferGeometry()

  // prettier-ignore
  const vertices = new Float32Array([
    ...BASE_VERTICES[3], ...BASE_VERTICES[4], ...BASE_VERTICES[0],
    ...BASE_VERTICES[3], ...BASE_VERTICES[7], ...BASE_VERTICES[4],
    ...BASE_VERTICES[0], ...BASE_VERTICES[4], ...BASE_VERTICES[5],
    ...BASE_VERTICES[0], ...BASE_VERTICES[5], ...BASE_VERTICES[1],
    ...BASE_VERTICES[1], ...BASE_VERTICES[5], ...BASE_VERTICES[6],
    ...BASE_VERTICES[1], ...BASE_VERTICES[6], ...BASE_VERTICES[2],
    ...BASE_VERTICES[2], ...BASE_VERTICES[6], ...BASE_VERTICES[7],
    ...BASE_VERTICES[2], ...BASE_VERTICES[7], ...BASE_VERTICES[3]
  ])

  geometry.setAttribute('position', new BufferAttribute(vertices, 3))

  // prettier-ignore
  const colors = new Float32Array([
    ...COLORS[0], ...COLORS[0], ...COLORS[0],
    ...COLORS[0], ...COLORS[0], ...COLORS[0],
    ...COLORS[0], ...COLORS[0], ...COLORS[0],
    ...COLORS[0], ...COLORS[0], ...COLORS[0],
    ...COLORS[0], ...COLORS[0], ...COLORS[0],
    ...COLORS[0], ...COLORS[0], ...COLORS[0],
    ...COLORS[0], ...COLORS[0], ...COLORS[0],
    ...COLORS[0], ...COLORS[0], ...COLORS[0]
  ])

  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  // prettier-ignore
  const uv = new Float32Array([
    ...UV[1], ...UV[2], ...UV[3],
    ...UV[1], ...UV[0], ...UV[2], 
    ...UV[1], ...UV[0], ...UV[2],
    ...UV[1], ...UV[2], ...UV[3], 
    ...UV[1], ...UV[0], ...UV[2],
    ...UV[1], ...UV[2], ...UV[3],
    ...UV[1], ...UV[0], ...UV[2],
    ...UV[1], ...UV[2], ...UV[3]
  ])

  geometry.setAttribute('uv', new BufferAttribute(uv, 2))
  geometry.computeVertexNormals()
  return geometry
}

class Kotatsu {
  constructor() {
    const textureLoader = new TextureLoader()

    const tabletopGeometry = new BoxGeometry(5, 0.2, 5)
    const tabletopMaterial = new MeshPhongMaterial({ map: textureLoader.load(tabletop) })
    const tableTopMesh = new Mesh(tabletopGeometry, tabletopMaterial)

    const clothGeometry = createClothGeometry()
    const clothMaterial = new MeshPhongMaterial({ map: textureLoader.load(clothTexture), side: 2 })
    const clothMesh = new Mesh(clothGeometry, clothMaterial)

    this.group = new Group()
    this.group.add(tableTopMesh)
    this.group.add(clothMesh)
  }
}

export default Kotatsu
