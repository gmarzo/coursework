const VERTEX_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  attribute vec3 vertexPosition;
  attribute vec3 vertexColor;
  varying vec4 finalVertexColor;
  uniform mat4 projectionMatrix;
  uniform mat4 transformedMatrix;
  uniform mat4 cameraMatrix;

  uniform int isLines;

  attribute vec3 normalVector;
  uniform vec3 lightPosition;

  void main(void) {
    gl_Position = projectionMatrix * cameraMatrix * transformedMatrix * vec4(vertexPosition, 1.0);
    vec4 trans_vertex = cameraMatrix * transformedMatrix * vec4(vertexPosition, 1.0);
    vec3 norm_vector = normalize(mat3(cameraMatrix) * mat3(transformedMatrix) * normalVector);
    vec3 lightVector = normalize(vec3(trans_vertex) - lightPosition);
    float lightContribution = dot(norm_vector, lightVector);

    if (isLines == 1) {
      lightContribution = 1.0;
    }
      
    finalVertexColor = vec4(vertexColor, 0.0) * lightContribution;
  }
`

const FRAGMENT_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif 
  varying vec4 finalVertexColor;


  void main(void) {
    gl_FragColor = vec4(finalVertexColor.rgb, 1.0);
  }
`

/**
 * Returns the WebGL rendering context.
 */
const getGL = canvas => canvas.getContext('webgl')

/**
 * Initializes a vertex buffer for the given array of vertices.
 */
const initVertexBuffer = (gl, vertices) => {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  return buffer
}

/**
 * Sets up a GLSL shader of the given type.
 */
const compileShader = (gl, shaderSource, shaderType, compileError) => {
  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  // Check for an error.
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (compileError) {
      compileError(shader)
    }

    return null
  } else {
    return shader
  }
}

/**
 * Links a GLSL program.
 */
const linkShaderProgram = (gl, vertexShader, fragmentShader) => {
  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  return shaderProgram
}

/**
 * Initializes a simple shader program, using these parameters:
 *
 * - gl: The WebGL context to use.
 * - vertexShaderSource: The vertex shader source code.
 * - fragmentShaderSource: The fragment shader source code.
 *
 * Optional parameters:
 *
 * - compileError: The function to call if a shader does not compile.
 * - linkError: The function to call if the program does not link.
 */
const initSimpleShaderProgram = (gl, vertexShaderSource, fragmentShaderSource, compileError, linkError) => {
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER, compileError)
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER, compileError)

  // If either shader is null, we just bail out.  An error would have
  // been reported to the compileError function.
  if (!vertexShader || !fragmentShader) {
    return null
  }

  // Link the shader program.
  const shaderProgram = linkShaderProgram(gl, vertexShader, fragmentShader)
  if (gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    return shaderProgram
  }

  // If we get here, something must have gone wrong.
  if (linkError) {
    linkError(shaderProgram)
  }
}
export {
  getGL,
  initVertexBuffer,
  compileShader,
  linkShaderProgram,
  initSimpleShaderProgram,
  VERTEX_SHADER,
  FRAGMENT_SHADER
}
