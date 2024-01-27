import { toRawLineArray, toRawTriangleArray } from './shapes'

describe('toRawLineArray', () => {
  it('converts a single-face proto-geometry into pairs of vertices', () => {
    const protoGeometry = {
      vertices: [
        [-1.0, 0.0, 1.0],
        [1.0, 0.0, 1.0],
        [-1.0, 0.0, -1.0]
      ],

      facesByIndex: [[0, 1, 2]]
    }

    // prettier-ignore
    expect(toRawLineArray(protoGeometry)).toEqual([
      -1.0, 0.0, 1.0,
      1.0, 0.0, 1.0, // Vertex 0 to vertex 1
      1.0, 0.0, 1.0,
      -1.0, 0.0, -1.0, // Vertex 1 to vertex 2
      -1.0, 0.0, -1.0,
      -1.0, 0.0, 1.0 // Vertex 2 back to vertex 0
    ])
  })

  it('converts a multi-face proto-geometry into pairs of vertices', () => {
    const protoGeometry = {
      vertices: [
        [-1.0, 0.0, 1.0],
        [1.0, 0.0, 1.0],
        [-1.0, 0.0, -1.0],
        [1.0, 0.0, -1.0],
        [0.0, 1.0, 1.0]
      ],

      facesByIndex: [
        [0, 1, 2],
        [2, 4, 3]
      ]
    }

    // prettier-ignore
    expect(toRawLineArray(protoGeometry)).toEqual([
      -1.0, 0.0, 1.0,
      1.0, 0.0, 1.0, // Vertex 0 to vertex 1
      1.0, 0.0, 1.0,
      -1.0, 0.0, -1.0, // Vertex 1 to vertex 2
      -1.0, 0.0, -1.0,
      -1.0, 0.0, 1.0, // Vertex 2 back to vertex 0
      -1.0, 0.0, -1.0,
      0.0, 1.0, 1.0, // Vertex 2 to vertex 4
      0.0, 1.0, 1.0,
      1.0, 0.0, -1.0, // Vertex 4 to vertex 3
      1.0, 0.0, -1.0,
      -1.0, 0.0, -1.0 // Vertex 3 back to vertex 2
    ])
  })
})

describe('toRawTriangleArray', () => {
  it('converts a single-face proto-geometry into triples of vertices', () => {
    const protoGeometry = {
      vertices: [
        [-1.0, 0.0, 1.0],
        [1.0, 0.0, 1.0],
        [-1.0, 0.0, -1.0]
      ],

      facesByIndex: [[0, 1, 2]]
    }

    // prettier-ignore
    expect(toRawTriangleArray(protoGeometry)).toEqual([
      -1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      -1.0, 0.0, -1.0
    ])
  })

  it('converts a multi-face proto-geometry into triples of vertices', () => {
    const protoGeometry = {
      vertices: [
        [-1.0, 0.0, 1.0],
        [1.0, 0.0, 1.0],
        [-1.0, 0.0, -1.0],
        [1.0, 0.0, -1.0],
        [0.0, 1.0, 1.0]
      ],

      facesByIndex: [
        [0, 1, 2],
        [2, 4, 3]
      ]
    }

    // prettier-ignore
    expect(toRawTriangleArray(protoGeometry)).toEqual([
      -1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      -1.0, 0.0, -1.0, // The first triangle.
      -1.0, 0.0, -1.0,
      0.0, 1.0, 1.0,
      1.0, 0.0, -1.0 // The second triangle.
    ])
  })
})
