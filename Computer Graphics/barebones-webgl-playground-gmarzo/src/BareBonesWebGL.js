import { useEffect, useRef } from 'react'

import { getGL, initVertexBuffer, initSimpleShaderProgram } from './glsl-utilities'
import { icosahedron, toRawLineArray } from './shapes'

// New language alert! The ultimate bare-bones GLSL shaders.
const VERTEX_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  attribute vec3 vertexPosition;

  void main(void) {
    gl_Position = vec4(vertexPosition, 1.0);
  }
`

const FRAGMENT_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec3 color;

  void main(void) {
    gl_FragColor = vec4(color, 1.0);
  }
`

/**
 * If you don’t know React well, don’t worry about the trappings. Just focus on the code inside
 * the useEffect hook.
 */
const BareBonesWebGL = props => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    // Grab the WebGL rendering context.
    const gl = getGL(canvas)
    if (!gl) {
      alert('No WebGL context found...sorry.')

      // No WebGL, no use going on...
      return
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.viewport(0, 0, canvas.width, canvas.height)

    // This variable stores 3D model information. We inline it for now but will want to separate it later.
    // Think of these as proto-meshes, with no distinct geometry nor material.
    const objectsToDraw = [
      // Calibration: x, y, and z axis indicators.
      {
        color: { r: 0.5, g: 0, b: 0 },
        vertices: [1.0, 0.0, 0.0, 0.9, 0.1, 0.0, 1.0, 0.0, 0.0, 0.9, -0.1, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0],
        mode: gl.LINES
      },

      {
        color: { r: 0, g: 0.5, b: 0 },
        vertices: [0.0, 1.0, 0.0, -0.1, 0.9, 0.0, 0.0, 1.0, 0.0, 0.1, 0.9, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0],
        mode: gl.LINES
      },

      {
        color: { r: 0, g: 0, b: 0.5 },
        vertices: [0.0, 0.0, 1.0, 0.0, 0.1, 0.9, 0.0, 0.0, 1.0, 0.0, -0.1, 0.9, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0],
        mode: gl.LINES
      },

      // Three solid triangles.
      {
        color: { r: 1.0, g: 0, b: 1.0 },
        vertices: [0.0, 0.0, 0.0, 0.5, 0.0, -0.75, 0.0, 0.5, 0.0],
        mode: gl.TRIANGLES
      },

      {
        color: { r: 1.0, g: 1.0, b: 0 },
        vertices: [0.25, 0.0, -0.5, 0.75, 0.0, -0.5, 0.25, 0.5, -0.5],
        mode: gl.TRIANGLES
      },

      {
        color: { r: 0.0, g: 1.0, b: 1.0 },
        vertices: [-0.25, 0.0, 0.5, 0.5, 0.0, 0.5, -0.25, 0.5, 0.5],
        mode: gl.TRIANGLES
      },

      // A quadrilateral.
      {
        color: { r: 0.5, g: 0.5, b: 0.5 },
        vertices: [-1.0, -1.0, 0.75, -1.0, -0.1, -1.0, -0.1, -0.1, -1.0, -0.1, -1.0, 0.75],
        mode: gl.LINE_LOOP
      },

      // Shape library demonstration.
      {
        color: { r: 1, g: 0.5, b: 0 },
        vertices: toRawLineArray(icosahedron()),
        mode: gl.LINES
      }
    ]

    // Pass the vertices to WebGL.
    objectsToDraw.forEach(objectToDraw => {
      objectToDraw.verticesBuffer = initVertexBuffer(gl, objectToDraw.vertices)
    })

    // Initialize the shaders.
    let abort = false
    const shaderProgram = initSimpleShaderProgram(
      gl,
      VERTEX_SHADER,
      FRAGMENT_SHADER,

      // Very cursory error-checking here...
      shader => {
        abort = true
        alert('Shader problem: ' + gl.getShaderInfoLog(shader))
      },

      // Another simplistic error check: we don't even access the faulty
      // shader program.
      shaderProgram => {
        abort = true
        alert('Could not link shaders...sorry.')
      }
    )

    // If the abort variable is true here, we can't continue.
    if (abort) {
      alert('Fatal errors encountered; we cannot continue.')
      return
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram)

    // Hold on to the important variables within the shaders.
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'vertexPosition')
    gl.enableVertexAttribArray(vertexPosition)

    /*
     * Displays an individual object.
     */
    const drawObject = object => {
      gl.uniform3f(gl.getUniformLocation(shaderProgram, 'color'), object.color.r, object.color.g, object.color.b)
      gl.bindBuffer(gl.ARRAY_BUFFER, object.verticesBuffer)
      gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0)
      gl.drawArrays(object.mode, 0, object.vertices.length / 3)
    }

    /*
     * Displays the scene.
     */
    const drawScene = () => {
      // Clear the display.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      // Display the objects.
      objectsToDraw.forEach(drawObject)

      // All done.
      gl.flush()
    }

    // ...and finally, do the initial display.
    drawScene()
  }, [canvasRef])

  return (
    <article>
      {/* The canvas is square because the default WebGL space is a cube. */}
      <canvas width="512" height="512" ref={canvasRef}>
        Your favorite update-your-browser message here.
      </canvas>
    </article>
  )
}

export default BareBonesWebGL
