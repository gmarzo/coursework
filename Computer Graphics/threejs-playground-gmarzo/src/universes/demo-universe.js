/**
 * The scene-manager module serves as an entry point to all scene-related activities, from initialization
 * to access to objects to anything else.
 *
 * The starter version of the scene manager is adapted from the introductory code provided by three.js.
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  MeshPhongMaterial,
  Mesh,
  TorusGeometry
} from 'three'

import Garnet from '../cast/garnet'

const DEFAULT_ROTATION_RATE = 0.01

const createDemoUniverse = ({ fieldOfView, width, height, nearPlane, farPlane }) => {
  const scene = new Scene()
  const camera = new PerspectiveCamera(fieldOfView, width / height, nearPlane, farPlane)

  // Adding an "on-the-fly" object

  const material = new MeshPhongMaterial({ color: 0x00dead })
  const geometry = new TorusGeometry(1.5, 0.1, 12, 48)
  const donut = new Mesh(geometry, material)
  scene.add(donut)

  // const ringMaterial = new MeshPhongMaterial({ color: 'purple' })
  // const ringGeometry = new TorusGeometry(1, 0.1, 12, 48)
  // const ring = new Mesh(ringGeometry, ringMaterial)
  // scene.add(ring)

  // donut.position.z = -3.0

  // Adding light

  const lightColor = 0xffffff
  const lightIntensity = 1
  const light = new DirectionalLight(lightColor, lightIntensity)
  light.position.set(-1, 2, 4)
  scene.add(light)

  const renderer = new WebGLRenderer()
  renderer.setSize(width, height)

  const garnet = new Garnet(0x00ff00)
  scene.add(garnet.mesh)

  // Turning is a universe-specific behavior: you can decide what these can be.
  let turning = true
  let cyclingColor = false
  const turn = () => {
    turning = true
  }

  const stop = () => {
    turning = false
  }

  const animate = () => {
    window.requestAnimationFrame(animate)

    if (turning) {
      garnet.mesh.rotation.x += DEFAULT_ROTATION_RATE
      garnet.mesh.rotation.y += DEFAULT_ROTATION_RATE

      donut.rotation.x += DEFAULT_ROTATION_RATE * 1.5
      donut.rotation.y += DEFAULT_ROTATION_RATE * 1.5
    }

    // if (cyclingColor) {
    //   if (garnet.mesh.material.color.getHex() === 0xffffff) {
    //     garnet.mesh.material.color.setHex(0x000000)
    //   } else {
    //     garnet.mesh.material.color.add(new Color(0x010101))
    //   }
    // }

    if (cyclingColor) {
      garnet.mesh.material.color.setHex(Math.random() * 0xffffff)
    }

    // garnet.rotateGem()

    renderer.render(scene, camera)
  }

  const cycleColor = () => {
    cyclingColor = true
  }

  const holdColor = () => {
    cyclingColor = false
  }

  return {
    camera,
    renderer,
    animate,
    turn,
    stop,
    cycleColor,
    holdColor,
    cast: {
      garnet,
      donut
    }
  }
}

export { createDemoUniverse }
