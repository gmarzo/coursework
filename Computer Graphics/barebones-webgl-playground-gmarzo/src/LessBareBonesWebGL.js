import { useState, useEffect, useRef } from 'react'

import { getGL, initVertexBuffer, initSimpleShaderProgram } from './glsl-utilities'
import { icosahedron, toRawLineArray } from './shapes'

// Slightly-leveled-up GLSL shaders.
const VERTEX_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  attribute vec3 vertexPosition;

  // Note this new additional output.
  attribute vec3 vertexColor;
  varying vec4 finalVertexColor;
  uniform mat4 rotationMatrix;

  void main(void) {
    gl_Position = rotationMatrix * vec4(vertexPosition, 1.0);
    finalVertexColor = vec4(vertexColor, 1.0);
  }
`

const FRAGMENT_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec4 finalVertexColor;

  void main(void) {
    // We vary the color based on the fragment's z coordinate,
    // which, at this point, ranges from 0 (near) to 1 (far).
    // Note the ".rgb" subselector.
    gl_FragColor = vec4((1.0 - gl_FragCoord.z) * finalVertexColor.rgb, 1.0);
  }
`

/**
 * This code does not really belong here: it should live
 * in a separate library of matrix and transformation
 * functions.  It is here only to show you how matrices
 * can be used with GLSL.
 *
 * Based on the original glRotate reference:
 *     https://www.khronos.org/registry/OpenGL-Refpages/es1.1/xhtml/glRotate.xml
 */
const getRotationMatrix = (angle, x, y, z) => {
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
  return [
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
  ]
}

/**
 * If you don’t know React well, don’t worry about the trappings. Just focus on the code inside
 * the useEffect hook.
 */
const LessBareBonesWebGL = props => {
  const [universe, setUniverse] = useState(null)
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

    // Build the objects to display.
    const objectsToDraw = [
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

      {
        vertices: [0.0, 0.0, 0.0, 0.5, 0.0, -0.75, 0.0, 0.5, 0.0],
        colors: [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0],
        mode: gl.TRIANGLES
      },

      {
        color: { r: 0.0, g: 1.0, b: 0 },
        vertices: [0.25, 0.0, -0.5, 0.75, 0.0, -0.5, 0.25, 0.5, -0.5],
        mode: gl.TRIANGLES
      },

      {
        color: { r: 0.0, g: 0.0, b: 1.0 },
        vertices: [-0.25, 0.0, 0.5, 0.5, 0.0, 0.5, -0.25, 0.5, 0.5],
        mode: gl.TRIANGLES
      },

      {
        color: { r: 0.0, g: 0.0, b: 1.0 },
        vertices: [-1.0, -1.0, 0.75, -1.0, -0.1, -1.0, -0.1, -0.1, -1.0, -0.1, -1.0, 0.75],
        mode: gl.LINE_LOOP
      },

      {
        color: { r: 0.0, g: 0.5, b: 0.0 },
        vertices: toRawLineArray(icosahedron()),
        mode: gl.LINES
      }
    ]

    // Pass the vertices to WebGL.
    objectsToDraw.forEach(objectToDraw => {
      objectToDraw.verticesBuffer = initVertexBuffer(gl, objectToDraw.vertices)

      if (!objectToDraw.colors) {
        // If we have a single color, we expand that into an array
        // of the same color over and over.
        objectToDraw.colors = []
        for (let i = 0, maxi = objectToDraw.vertices.length / 3; i < maxi; i += 1) {
          objectToDraw.colors = objectToDraw.colors.concat(
            objectToDraw.color.r,
            objectToDraw.color.g,
            objectToDraw.color.b
          )
        }
      }

      objectToDraw.colorsBuffer = initVertexBuffer(gl, objectToDraw.colors)
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
    const vertexColor = gl.getAttribLocation(shaderProgram, 'vertexColor')
    gl.enableVertexAttribArray(vertexColor)
    const rotationMatrix = gl.getUniformLocation(shaderProgram, 'rotationMatrix')

    /*
     * Displays an individual object.
     */
    const drawObject = object => {
      // Set the varying colors.
      gl.bindBuffer(gl.ARRAY_BUFFER, object.colorsBuffer)
      gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0)

      // Set the varying vertex coordinates.
      gl.bindBuffer(gl.ARRAY_BUFFER, object.verticesBuffer)
      gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0)
      gl.drawArrays(object.mode, 0, object.vertices.length / 3)
    }

    /*
     * Displays the scene.
     */
    let currentRotation = 0.0

    const drawScene = () => {
      // Clear the display.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      // Set up the rotation matrix.
      gl.uniformMatrix4fv(rotationMatrix, gl.FALSE, new Float32Array(getRotationMatrix(currentRotation, 0, 1, 0)))

      // Display the objects.
      objectsToDraw.forEach(drawObject)

      // All done.
      gl.flush()
    }

    /*
     * Animates the scene.
     */
    let animationActive = false
    let previousTimestamp = null

    const FRAMES_PER_SECOND = 60
    const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND

    const DEGREES_PER_MILLISECOND = 0.033
    const FULL_CIRCLE = 360.0

    const advanceScene = timestamp => {
      // Check if the user has turned things off.
      if (!animationActive) {
        return
      }

      // Initialize the timestamp.
      if (!previousTimestamp) {
        previousTimestamp = timestamp
        window.requestAnimationFrame(advanceScene)
        return
      }

      // Check if it's time to advance.
      var progress = timestamp - previousTimestamp
      if (progress < MILLISECONDS_PER_FRAME) {
        // Do nothing if it's too soon.
        window.requestAnimationFrame(advanceScene)
        return
      }

      // All clear.
      currentRotation += DEGREES_PER_MILLISECOND * progress
      drawScene()

      if (currentRotation >= FULL_CIRCLE) {
        currentRotation -= FULL_CIRCLE
      }

      // Request the next frame.
      previousTimestamp = timestamp
      window.requestAnimationFrame(advanceScene)
    }

    // Draw the initial scene.
    drawScene()

    setUniverse({
      toggleRotation: () => {
        animationActive = !animationActive
        if (animationActive) {
          previousTimestamp = null
          window.requestAnimationFrame(advanceScene)
        }
      }
    })
  }, [canvasRef])

  // Set up the rotation toggle: clicking on the canvas does it.
  const handleCanvasClick = event => universe.toggleRotation()

  return (
    <article>
      {/* Yes, still square. */}
      <canvas width="512" height="512" ref={canvasRef} onClick={universe && handleCanvasClick}>
        Your favorite update-your-browser message here.
      </canvas>
    </article>
  )
}

export default LessBareBonesWebGL
