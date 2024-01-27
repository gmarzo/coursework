// Class representing a Vexed Scene.

import { getGL, VERTEX_SHADER, FRAGMENT_SHADER, initVertexBuffer, initSimpleShaderProgram } from './glsl-utilities.js'
import { Shape } from './vexed-shapes'
import {
  getRotationMatrix,
  getScaleMatrix,
  getTranslationMatrix,
  getPerspectiveProjectionMatrix,
  getCameraMatrix,
  getOrthographicProjectionMatrix
} from './vexed-matrix'

class Scene {
  constructor(canvas, depth = -4) {
    this.children = []
    this.gl = getGL(canvas)
    if (!this.gl) {
      alert('No WebGL context found...sorry.')
      return
    }

    this.canvas = canvas

    this.rotation = { angle: 0, x: 0.0, y: 1.0, z: 0.0 }
    this.camera = new Camera(this.canvas.width, this.canvas.height)

    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0)
    this.gl.viewport(0, 0, canvas.width, canvas.height)
  }

  addLight(light) {
    if (!(light instanceof PositionalLight)) {
      throw new Error('Cannot add light to scene. Not a valid light. Please try again.')
    }
    this.light = light
  }

  add(shape) {
    if (!(shape instanceof Shape) && !(shape instanceof Group)) {
      throw new Error('Cannot add to scene. Not a valid shape or group')
    }
    this.children.push(shape)
  }

  remove(shape) {
    const index = this.children.indexOf(shape)
    if (index > -1) {
      this.children.splice(index, 1)
    }
  }
  render() {
    const sceneTransformMatrix = getRotationMatrix(
      this.rotation.angle,
      this.rotation.x,
      this.rotation.y,
      this.rotation.z
    )
    Group.applyTransformationsToChildren(sceneTransformMatrix, this)

    const flatShapes = this.flattenChildren(this.children)

    flatShapes.forEach(shape => {
      shape.verticesBuffer = initVertexBuffer(this.gl, shape.wireframe ? shape.lineGeometry : shape.triangleGeometry)
      shape.colorsBuffer = initVertexBuffer(this.gl, shape.wireframe ? shape.wireframeColors : shape.colors)
      shape.normalsBuffer = initVertexBuffer(
        this.gl,
        shape.wireframe
          ? [...shape.normals, ...shape.normals]
          : shape.smoothLighting
          ? shape.smoothNormals
          : shape.normals
      )
    })

    let abort = false
    const shaderProgram = initSimpleShaderProgram(
      this.gl,
      VERTEX_SHADER,
      FRAGMENT_SHADER,

      shader => {
        abort = true
        alert('Shader problem: ' + this.gl.getShaderInfoLog(shader))
      },

      shaderProgram => {
        abort = true
        alert('Could not link shaders...sorry.')
      }
    )

    if (abort) {
      alert('Fatal errors encountered; we cannot continue.')
      return
    }
    this.gl.useProgram(shaderProgram)
    const vertexPosition = this.gl.getAttribLocation(shaderProgram, 'vertexPosition')
    this.gl.enableVertexAttribArray(vertexPosition)
    const vertexColor = this.gl.getAttribLocation(shaderProgram, 'vertexColor')
    this.gl.enableVertexAttribArray(vertexColor)
    const transformedMatrix = this.gl.getUniformLocation(shaderProgram, 'transformedMatrix')
    const projectionMatrix = this.gl.getUniformLocation(shaderProgram, 'projectionMatrix')
    const cameraMatrix = this.gl.getUniformLocation(shaderProgram, 'cameraMatrix')
    const normalVector = this.gl.getAttribLocation(shaderProgram, 'normalVector')
    this.gl.enableVertexAttribArray(normalVector)
    const lightPosition = this.gl.getUniformLocation(shaderProgram, 'lightPosition')
    const isLines = this.gl.getUniformLocation(shaderProgram, 'isLines')

    /*
     * Displays an individual object.
     */
    const drawObject = object => {
      this.gl.uniform3f(
        this.gl.getUniformLocation(shaderProgram, 'color'),
        object.color.r,
        object.color.g,
        object.color.b
      )
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.colorsBuffer)
      this.gl.vertexAttribPointer(vertexColor, 3, this.gl.FLOAT, false, 0, 0)

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.verticesBuffer)
      this.gl.vertexAttribPointer(vertexPosition, 3, this.gl.FLOAT, false, 0, 0)

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.normalsBuffer)
      this.gl.vertexAttribPointer(normalVector, 3, this.gl.FLOAT, false, 0, 0)

      this.gl.uniformMatrix4fv(
        transformedMatrix,
        this.gl.FALSE,
        new Float32Array(object.transformedMatrix.transpose().matrix)
      )
      this.gl.uniformMatrix4fv(
        projectionMatrix,
        this.gl.FALSE,
        new Float32Array(this.camera.getCanvasProjectionMatrix().transpose().matrix)
      )

      this.gl.uniformMatrix4fv(
        cameraMatrix,
        this.gl.FALSE,
        new Float32Array(getCameraMatrix(this.camera.position, this.camera.target, this.camera.up).transpose().matrix)
      )

      this.gl.uniform3f(lightPosition, this.light.position.x, this.light.position.y, this.light.position.z)

      this.gl.uniform1i(isLines, object.wireframe ? 1 : 0)

      const mode = object.wireframe ? this.gl.LINES : this.gl.TRIANGLES
      this.gl.drawArrays(mode, 0, (object.wireframe ? object.lineGeometry.length : object.triangleGeometry.length) / 3)
    }

    /*
     * Displays the scene.
     */
    const drawScene = () => {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
      flatShapes.forEach(drawObject)
      this.gl.flush()
    }
    drawScene()
  }

  flattenChildren(shapes) {
    let flattenedShapes = []
    shapes.forEach(shape => {
      if (shape instanceof Group) {
        if (shape.children?.size !== 0) {
          flattenedShapes.push(...this.flattenChildren(shape.children))
        }
      } else {
        flattenedShapes.push(shape)
      }
    })
    return flattenedShapes
  }
}

class PositionalLight {
  constructor(color = { r: 1.0, g: 1.0, b: 1.0 }, intensity = 1.0) {
    this.color = color
    this.intensity = intensity
    this.position = { x: 0, y: 0, z: 0 }
  }

  set(newX, newY, newZ) {
    this.position = { x: newX, y: newY, z: newZ }
  }
}

class Camera {
  constructor(canvasWidth = 1, canvasHeight = 1, position = { x: 0, y: 0, z: -4 }, 
              target = { x: 0, y: 0, z: 0 }, up = { x: 0, y: 1, z: 0 }, orthographicProjection = false) {
    this.position = position
    this.target = target
    this.up = up
    this.orthographicProjection = orthographicProjection

    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    this.L = -2 * (canvasWidth / canvasHeight)
    this.R = 2 * (canvasWidth / canvasHeight)
    this.B = -2
    this.T = 2
    this.N = 2
    this.F = 100
    this.canvasProjectionMatrix = this.getCanvasProjectionMatrix()
  }

  getCanvasProjectionMatrix() {
    this.L = -2 * (this.canvasWidth / this.canvasHeight)
    this.R = 2 * (this.canvasWidth / this.canvasHeight)
    return this.orthographicProjection ? getOrthographicProjectionMatrix(this.N, this.F, this.R, this.L, this.T, this.B)
     : getPerspectiveProjectionMatrix(this.N, this.F, this.R, this.L, this.T, this.B)
  }

  setPosition(newX, newY, newZ) {
    this.position = { x: newX, y: newY, z: newZ }
  }

  setTarget(newX, newY, newZ) {
    this.target = { x: newX, y: newY, z: newZ }
  }
}

class Group {
  constructor() {
    this.children = new Set()
    this.position = { x: 0, y: 0, z: 0 }
    this.scale = { x: 1, y: 1, z: 1 }
    this.rotation = { angle: 0, x: 1, y: 1, z: 1 }
  }
  add(shape) {
    this.children.add(shape)
  }
  remove(shape) {
    this.children.delete(shape)
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

  setWireframe(selectedShape) {
    if (selectedShape instanceof Shape) {
      selectedShape.wireframe = !selectedShape.wireframe
    } else if (selectedShape instanceof Group) {
      selectedShape.children.forEach(kid => this.setWireframe(kid))
    }
  }

  static applyTransformationsToChildren(matrix, child) {
    const translationMatrix = getTranslationMatrix(
      child.position?.x ?? 0,
      child.position?.y ?? 0,
      child.position?.z ?? 0
    )
    const scaleMatrix = getScaleMatrix(child.scale?.x ?? 1, child.scale?.y ?? 1, child.scale?.z ?? 1)
    const rotationMatrix = getRotationMatrix(child.rotation.angle, child.rotation.x, child.rotation.y, child.rotation.z)

    const transformedMatrix = matrix.multiply(translationMatrix).multiply(rotationMatrix).multiply(scaleMatrix)

    if (child instanceof Shape) {
      child.transformedMatrix = transformedMatrix
      return
    }
    child.children.forEach(kid => Group.applyTransformationsToChildren(transformedMatrix, kid))
  }
}

export { Scene, Group, PositionalLight, Camera }
