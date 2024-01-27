/**
 * The scene-manager module serves as an entry point to all scene-related activities, from initialization
 * to access to objects to anything else.
 *
 * The starter version of the scene manager is adapted from the introductory code provided by three.js.
 */
import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight } from 'three'

//import Garnet from '../cast/garnet'
import Kotatsu from '../cast/kotatsu'
import Teapot from '../cast/teapot'
import Teacup from '../cast/teacup'
import Teadrop from '../cast/teadrop'
import Liquid from '../cast/liquid'
import Steam from '../cast/steam'
//import Peridot from '../cast/peridot'
//import Spire from '../cast/spire'

//const DEFAULT_ROTATION_RATE = 0.01
const TEADROP_GRAVITY = 0.05

const createDemoUniverse = ({ fieldOfView, width, height, nearPlane, farPlane }) => {
  const scene = new Scene()
  const camera = new PerspectiveCamera(fieldOfView, width / height, nearPlane, farPlane)

  const renderer = new WebGLRenderer()
  renderer.setSize(width, height)

  scene.add(new AmbientLight('white', 0.5))

  const directionalLight = new DirectionalLight('white', 1)
  directionalLight.position.set(-1.5, 1, 2)
  directionalLight.target.position.set(0, 0, 0)
  scene.add(directionalLight)
  scene.add(directionalLight.target)

  // const garnet = new Garnet('gray')
  // scene.add(garnet.mesh)

  // const peridot = new Peridot()
  // scene.add(peridot.group)

  // const spire = new Spire()

  const kotatsu = new Kotatsu()
  scene.add(kotatsu.group)

  const teapot = new Teapot()
  scene.add(teapot.group)
  teapot.group.scale.set(0.4, 0.5, 0.4)
  teapot.group.position.set(1, 0, 1)
  teapot.group.rotation.y = (Math.PI * 3) / 4

  const teacup = new Teacup()
  scene.add(teacup.group)
  teacup.group.position.y = 0.9
  teacup.group.position.x = -1.5
  teacup.group.scale.set(0.5, 0.5, 0.5)

  const liquid = new Liquid()
  scene.add(liquid.mesh)
  liquid.mesh.position.set(-1.5, 0.2, 0)
  liquid.mesh.scale.set(0.5, 0.5, 0.5)
  liquid.mesh.rotation.x = (Math.PI * 3) / 2

  const teadrop = new Teadrop()
  // scene.add(teadrop.mesh)
  teadrop.mesh.position.set(-1.5, 2.5, 0)

  const steam = new Steam()
  scene.add(steam.mesh)
  steam.mesh.position.set(-1.5, 1.3, 0)
  steam.mesh.rotation.x = (Math.PI * 3) / 2
  steam.rise()

  let teadropPresent = false

  const animate = () => {
    window.requestAnimationFrame(animate)

    if (teapot.pouring && !liquid.isFull) {
      if (!teadropPresent) {
        scene.add(teadrop.mesh)
        teadropPresent = true
      }
      teadrop.mesh.position.y -= TEADROP_GRAVITY

      // Handle collision with liquid in teacup
      if (teaCollide(teadrop.mesh, liquid.mesh)) {
        resetDrop()
        liquid.fill()
      }
    } else if (liquid.isFull) {
      teapot.reset()
      resetDrop()
    }

    renderer.render(scene, camera)
  }

  function teaCollide(mesh1, mesh2) {
    return mesh1.position.y <= mesh2.position.y
  }

  const resetDrop = () => {
    teadrop.mesh.position.y = 2.5
    scene.remove(teadrop.mesh)
    teadropPresent = false
  }

  return {
    camera,
    renderer,
    animate,
    stop,
    resetDrop,
    cast: {
      // garnet,
      // peridot
      // spire
      kotatsu,
      teapot,
      teacup,
      liquid,
      steam
    }
  }
}

export { createDemoUniverse }
