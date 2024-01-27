import { Matrix } from './vexed-matrix'
import Vector from './vexed-vector'

class Shape {
  constructor(color, geometry, wireframe = false, smoothLighting = false, colors = null) {
    this.color = color
    this.wireframe = wireframe
    if (geometry.length % 3 !== 0) {
      throw new Error('Please enter a valid shape :(')
    }
    this.smoothLighting = smoothLighting
    this.triangleGeometry = geometry
    this.lineGeometry = this.getLineArray(geometry)
    this.normals = this.computeVertexNormals(geometry)
    this.smoothNormals = this.computeSmoothNormals()

    if (colors && colors.length !== geometry.length) {
      throw new Error('Please enter valid colors.')
    }
    if (!colors && !this.wireframe) {
      // If we have a single color, we expand that into an array
      // of the same color over and over.
      colors = []
      for (let i = 0, maxi = this.triangleGeometry.length / 3; i < maxi; i += 1) {
        colors = colors.concat(color.r, color.g, color.b)
      }
    }
    this.colors = colors
    this.wireframeColors = new Array(this.lineGeometry.length / 3).fill([color.r, color.g, color.b]).flat()
    this.position = { x: 0, y: 0, z: 0 }
    this.scale = { x: 1, y: 1, z: 1 }
    this.rotation = { angle: 0, x: 1, y: 1, z: 1 }
    this.transformedMatrix = new Matrix()
  }

  computeVertexNormals(geometry) {
    const result = []

    for (let i = 0; i < geometry.length; i += 9) {
      // Access each vertex of the triangle.
      const p0 = geometry.slice(i, i + 3)
      const p1 = geometry.slice(i + 3, i + 6)
      const p2 = geometry.slice(i + 6, i + 9)

      // Convert each point into a Vector instance so we can use the methods.
      const p0AsVector = new Vector(...p0)
      const p1AsVector = new Vector(...p1)
      const p2AsVector = new Vector(...p2)

      // Perform the actual vector calculation.
      const v1 = p1AsVector.subtract(p0AsVector)
      const v2 = p2AsVector.subtract(p0AsVector)

      // Calculate the normal N.
      const N = v1.cross(v2).unit

      // Push that normal onto the result, one per vertex.
      result.push(N.x, N.y, N.z)
      result.push(N.x, N.y, N.z)
      result.push(N.x, N.y, N.z)
    }

    return result
  }

  computeSmoothNormals() {
    const normObj = {}
    const result = []

    for (let i = 0; i < this.triangleGeometry.length; i += 3) {
      let geometryX = this.triangleGeometry[i]
      let geometryY = this.triangleGeometry[i + 1]
      let geometryZ = this.triangleGeometry[i + 2]

      let normalX = this.normals[i]
      let normalY = this.normals[i + 1]
      let normalZ = this.normals[i + 2]

      if (normObj[[geometryX, geometryY, geometryZ]]) {
        normObj[[geometryX, geometryY, geometryZ]] = normObj[[geometryX, geometryY, geometryZ]].add(
          new Vector(normalX, normalY, normalZ)
        )
      } else {
        normObj[[geometryX, geometryY, geometryZ]] = new Vector(normalX, normalY, normalZ)
      }
    }

    for (let i = 0; i < this.triangleGeometry.length; i += 3) {
      let currVertex = this.triangleGeometry.slice(i, i + 3)
      let currNormal = normObj[currVertex]

      result.push(currNormal.x, currNormal.y, currNormal.z)
    }

    return result
  }

  getLineArray(geometry) {
    const vertices = []
    for (let i = 0; i < geometry.length; i += 3) {
      vertices.push(geometry.slice(i, i + 3))
    }

    const lineVertices = []
    for (let i = 1; i <= vertices.length; i++) {
      if (i % 3 === 0 && i >= 2) {
        lineVertices.push(...vertices[i - 1], ...vertices[i - 3])
      } else {
        lineVertices.push(...vertices[i], ...vertices[i - 1])
      }
    }
    return lineVertices
  }

  setPosition(newX = 0, newY = 0, newZ = 0) {
    this.position = { x: newX, y: newY, z: newZ }
  }
  setScale(scaleX = 1, scaleY = 1, scaleZ = 1) {
    this.scale = { x: scaleX, y: scaleY, z: scaleZ }
  }
  setRotation(newAngle = 0, rotateX = 1, rotateY = 1, rotateZ = 1) {
    this.rotation = { angle: newAngle, x: rotateX, y: rotateY, z: rotateZ }
  }
  setWireframe() {
    this.wireframe = !this.wireframe
  }
}

class Sphere extends Shape {
  constructor(
    color,
    radius = 1,
    widthSegments = 32,
    heightSegments = 16,
    wireframe = false,
    smooth = false,
    colors = null
  ) {
    const center = {
      x: 0,
      y: 0,
      z: 0
    }
    const vertices = Sphere.generateVertices(center, radius, widthSegments, heightSegments)
    super(color, vertices, wireframe, smooth, colors)
  }

  static generateVertices(center, radius, widthSegments, heightSegments) {
    const TOP_POINT = [center.x, center.y + radius, center.z]
    const BOT_POINT = [center.x, center.y - radius, center.z]
    const HEIGHT_RINGS = []
    const RING_POINTS = []
    const TRIANGLES = []

    // mark out y-values for height "rings"
    const ANGLE_DELTA = Math.PI / heightSegments
    for (let i = Math.PI / 2 - ANGLE_DELTA; i >= 0; i -= ANGLE_DELTA) {
      const y = Math.sin(i) * radius
      HEIGHT_RINGS.push(center.y + y)
      HEIGHT_RINGS.push(center.y - y)
    }
    HEIGHT_RINGS.sort((a, b) => a - b)

    const UNIQUE_RINGS = [...new Set(HEIGHT_RINGS)]

    // draw out points along each individual ring
    UNIQUE_RINGS.forEach(y => {
      let points = []
      const chordDist = y - center.y
      const ringRadius = Math.sqrt(radius ** 2 - chordDist ** 2)

      for (let i = 0; i < widthSegments; i++) {
        let angle = (2 * Math.PI * i) / widthSegments
        let x = ringRadius * Math.cos(angle) + center.x
        let z = ringRadius * Math.sin(angle) + center.z
        points.push([x, y, z])
      }

      RING_POINTS.push(points)
    })

    // draw triangles between the rings
    for (let i = 0; i < RING_POINTS.length; i++) {
      // lowest ring to bottom point
      if (i === 0) {
        for (let j = 1; j <= widthSegments; j++) {
          if (j === widthSegments) {
            TRIANGLES.push(...RING_POINTS[i][j - 1], ...BOT_POINT, ...RING_POINTS[i][0])
          } else {
            TRIANGLES.push(...RING_POINTS[i][j - 1], ...BOT_POINT, ...RING_POINTS[i][j])
          }
        }
      }

      // highest ring to top point
      else if (i === RING_POINTS.length - 1) {
        for (let j = 1; j <= widthSegments; j++) {
          if (j === widthSegments) {
            TRIANGLES.push(...RING_POINTS[i][j - 1], ...RING_POINTS[i][0], ...TOP_POINT)
            TRIANGLES.push(...RING_POINTS[i][j - 1], ...RING_POINTS[i - 1][j - 1], ...RING_POINTS[i - 1][0])
            TRIANGLES.push(...RING_POINTS[i][j - 1], ...RING_POINTS[i - 1][0], ...RING_POINTS[i][0])
          } else {
            TRIANGLES.push(...RING_POINTS[i][j - 1], ...RING_POINTS[i][j], ...TOP_POINT)
            TRIANGLES.push(...RING_POINTS[i][j - 1], ...RING_POINTS[i - 1][j - 1], ...RING_POINTS[i - 1][j])
            TRIANGLES.push(...RING_POINTS[i][j], ...RING_POINTS[i][j - 1], ...RING_POINTS[i - 1][j])
          }
        }
      }

      // ring to ring
      else {
        for (let j = 1; j <= widthSegments; j++) {
          let ring = RING_POINTS[i]
          let lower_ring = RING_POINTS[i - 1]

          if (j === widthSegments) {
            TRIANGLES.push(...ring[j - 1], ...lower_ring[j - 1], ...lower_ring[0])
            TRIANGLES.push(...ring[j - 1], ...lower_ring[0], ...ring[0])
          } else {
            TRIANGLES.push(...ring[j - 1], ...lower_ring[j - 1], ...lower_ring[j])
            TRIANGLES.push(...ring[j], ...ring[j - 1], ...lower_ring[j])
          }
        }
      }
    }
    return TRIANGLES
  }
}

class Box extends Shape {
  constructor(color = { r: 0, g: 0, b: 0, a: 0 }, wireframe = false, smooth = false, colors = null) {
    const vertices = Box.generateVertices()
    super(color, vertices, wireframe, smooth, colors)
  }

  static generateVertices() {
    const VERTICES = [
      [0.5, 0.5, 0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [-0.5, 0.5, -0.5],
      [0.5, -0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5]
    ]

    // prettier-ignore
    const TRIANGLES = new Float32Array([
        ...VERTICES[3], ...VERTICES[6], ...VERTICES[1],
        ...VERTICES[6], ...VERTICES[7], ...VERTICES[1],
        ...VERTICES[7], ...VERTICES[4], ...VERTICES[1],
        ...VERTICES[1], ...VERTICES[4], ...VERTICES[0],
        ...VERTICES[4], ...VERTICES[5], ...VERTICES[0],
        ...VERTICES[5], ...VERTICES[2], ...VERTICES[0],
        ...VERTICES[5], ...VERTICES[6], ...VERTICES[3],
        ...VERTICES[2], ...VERTICES[5], ...VERTICES[3],
        ...VERTICES[2], ...VERTICES[3], ...VERTICES[0],
        ...VERTICES[3], ...VERTICES[1], ...VERTICES[0],
        ...VERTICES[5], ...VERTICES[7], ...VERTICES[6],
        ...VERTICES[5], ...VERTICES[4], ...VERTICES[7]
      ])

    return TRIANGLES
  }
}

class Cylinder extends Shape {
  constructor(
    color = { r: 0, g: 255, b: 0 },
    segments = 3,
    topRadius = 1,
    bottomRadius = 1,
    height = 1,
    wireframe = false,
    smooth = false,
    colors = null
  ) {
    const center = {
      x: 0,
      y: 0,
      z: 0
    }
    const vertices = Cylinder.generateVertices(center, segments, topRadius, bottomRadius, height)
    super(color, vertices, wireframe, smooth, colors)
  }

  static generateVertices(center, segments, topRadius, bottomRadius, height) {
    const CIRCLE_CENTERS = []
    const TOP_POINTS = []
    const BOTTOM_POINTS = []

    const TOP_TRIANGLES = []
    const BOTTOM_TRIANGLES = []
    const SIDE_TRIANGLES = []

    // generate top and bottom points
    CIRCLE_CENTERS.push([center.x, center.y + height / 2, center.z])
    CIRCLE_CENTERS.push([center.x, center.y - height / 2, center.z])

    // generate circle points
    for (let i = 0; i < segments; i++) {
      let angle = (2 * Math.PI * i) / segments
      let topX = topRadius * Math.cos(angle) + center.x
      let topZ = topRadius * Math.sin(angle) + center.z
      let bottomX = bottomRadius * Math.cos(angle) + center.x
      let bottomZ = bottomRadius * Math.sin(angle) + center.y
      TOP_POINTS.push([topX, center.y + height / 2, topZ])
      BOTTOM_POINTS.push([bottomX, center.y - height / 2, bottomZ])
    }

    // generate top and bottom triangles
    for (let i = 1; i < segments + 1; i++) {
      if (i === segments) {
        TOP_TRIANGLES.push(...CIRCLE_CENTERS[0], ...TOP_POINTS[i - 1], ...TOP_POINTS[0])
        BOTTOM_TRIANGLES.push(...CIRCLE_CENTERS[1], ...BOTTOM_POINTS[0], ...BOTTOM_POINTS[i - 1])
      } else {
        TOP_TRIANGLES.push(...CIRCLE_CENTERS[0], ...TOP_POINTS[i - 1], ...TOP_POINTS[i])
        BOTTOM_TRIANGLES.push(...CIRCLE_CENTERS[1], ...BOTTOM_POINTS[i], ...BOTTOM_POINTS[i - 1])
      }
    }

    //generate side triangles
    for (let i = 1; i <= segments; i++) {
      if (i === segments) {
        SIDE_TRIANGLES.push(...BOTTOM_POINTS[i - 1], ...BOTTOM_POINTS[0], ...TOP_POINTS[i - 1])
        SIDE_TRIANGLES.push(...TOP_POINTS[i - 1],  ...BOTTOM_POINTS[0], ...TOP_POINTS[0])
      } else {
        SIDE_TRIANGLES.push(...BOTTOM_POINTS[i - 1], ...BOTTOM_POINTS[i], ...TOP_POINTS[i - 1])
        SIDE_TRIANGLES.push(...TOP_POINTS[i - 1], ...BOTTOM_POINTS[i], ...TOP_POINTS[i])
      }
    }

    return [...TOP_TRIANGLES, ...BOTTOM_TRIANGLES, ...SIDE_TRIANGLES]
  }
}

class Extrude extends Shape {
  // prettier-ignore
  constructor(color = { r: 0, g: 0, b: 0, a: 0 }, shape = [ 
      // right triangle
      0.5, -0.5,  
      0.5, 0.5, 
      -0.5, 0.5, 
      // left triangle
      -0.5, 0.5, 
      -0.5, -0.5, 
      0.5, -0.5,
    ], depth = 1, wireframe = false, smooth = false, colors = null) {
      const vertices = Extrude.generateExtrude(shape, depth)
      super(color, vertices, wireframe, smooth, colors)
    }

  static generateExtrude(vertices, depth) {
    if (depth < 0) {
      throw new Error('Depth must be a positive')
    }
    if (vertices.length % 2 !== 0) {
      throw new Error('Must enter a valid number of vertices. Must be a 2D shape.')
    }
    const frontShape = []
    const backShape = []
    for (let i = 0; i < vertices.length; i += 2) {
      frontShape.push(vertices.slice(i, i + 2))
      backShape.push(vertices.slice(i, i + 2))
    }
    const depth1 = depth / 2
    frontShape.forEach(array => array.push(depth1))
    backShape.forEach(array => array.push(-depth1))

    const sides = []
    for (let i = 1; i < frontShape.length + 1; i++) {
      if (i === frontShape.length) {
        sides.push(...frontShape[0], ...backShape[0], ...backShape[i - 1])
        sides.push(...frontShape[i - 1], ...frontShape[0], ...backShape[i - 1])
        continue
      }
      sides.push(...frontShape[i], ...backShape[i], ...frontShape[i - 1])
      sides.push(...frontShape[i - 1], ...backShape[i], ...backShape[i - 1])
    }
    const extrude = [...frontShape.flat(), ...backShape.flat(), ...sides]
    return extrude
  }
}

class Lathe extends Shape {
  constructor(color, twoDimPoints, widthSegments = 16, wireframe = false, smooth = false, colors = null) {
    const vertices = Lathe.generateVertices(twoDimPoints, widthSegments)
    super(color, vertices, wireframe, smooth, colors)
  }

  static generateVertices(points, widthSegments) {
    if (points.length % 2 !== 0) {
      throw new Error("Hey matey, that's not a valid lathe shape you've given me!")
    }
    const ALL_RING_POINTS = []
    for (let i = 0; i < points.length - 1; i += 2) {
      let startX = points[i]
      let startY = points[i + 1]
      let ring_points = []
      const ringRadius = Math.abs(startX)

      for (let i = 0; i < widthSegments; i++) {
        let angle = (2 * Math.PI * i) / widthSegments
        let x = ringRadius * Math.cos(angle)
        let z = ringRadius * Math.sin(angle)

        ring_points.push([x, startY, z])
      }

      ALL_RING_POINTS.push(ring_points)
    }

    const TRIANGLES = []
    for (let i = 1; i < ALL_RING_POINTS.length; i++) {
      let ring = ALL_RING_POINTS[i]
      let lower_ring = ALL_RING_POINTS[i - 1]
      for (let j = 1; j <= widthSegments; j++) {
        if (j === widthSegments) {
          TRIANGLES.push(...ring[j - 1], ...lower_ring[0], ...lower_ring[j - 1])
          TRIANGLES.push(...ring[j - 1], ...ring[0], ...lower_ring[0])
        } else {
          TRIANGLES.push(...ring[j - 1], ...lower_ring[j], ...lower_ring[j - 1])
          TRIANGLES.push(...ring[j], ...lower_ring[j], ...ring[j - 1])
        }
      }
    }
    return TRIANGLES
  }
}

export { Shape, Sphere, Box, Cylinder, Extrude, Lathe }
