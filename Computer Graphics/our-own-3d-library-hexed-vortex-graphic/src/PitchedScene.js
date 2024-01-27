/**
 * Build out this component to display a “sandbox” scene—see the description below.
 */
import { useCallback, useEffect, useRef } from 'react'
import { Scene, PositionalLight, Group } from './vexed/vexed.js'
import { Box, Cylinder } from './vexed/vexed-shapes.js'
import Tree from './groupShapes/tree'
import Clouds from './groupShapes/clouds'
import Basket from './groupShapes/basket'

const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 512
const DEFAULT_ROTATION_RATE = 0.0005
const CAMERA_DISTANCE = 6
let currentAngle = 0
var listOfClouds = []
const CLOUD_MAX = 2
var CLOUDS_IN_SCENE = false
const BIRD_DELTA = 2 / 300

const PitchedScene = props => {
  const canvasRef = useRef()

  let scene = useRef()
  let cast = useRef()
  let moving = false

  const animate = useCallback(() => {
    window.requestAnimationFrame(animate)

    if (cast.picnicBasket.moving) {
      cast.picnicBasket.lidCheck()
    }


    if (cast.birdTree.exposed) {
      if (cast.birdTree.bird.position.z > 0) {
        cast.birdTree.bird.setPosition(
          cast.birdTree.bird.position.x,
          cast.birdTree.bird.position.y,
          cast.birdTree.bird.position.z - BIRD_DELTA
        )
      } else {
        cast.birdTree.exposed = false
      }
    } else {
      if (cast.birdTree.bird.position.z < 2) {
        cast.birdTree.bird.setPosition(
          cast.birdTree.bird.position.x,
          cast.birdTree.bird.position.y,
          cast.birdTree.bird.position.z + BIRD_DELTA
        )
      } else {
        cast.birdTree.exposed = true
      }
    }
    if (CLOUDS_IN_SCENE) {
      for (let i = 0; i < listOfClouds.length; i++) {
        listOfClouds[i].move()
      }
    }

    if (moving) {
      scene.current.camera.setPosition(Math.sin(currentAngle) * CAMERA_DISTANCE, 0.5, -Math.cos(currentAngle) * CAMERA_DISTANCE)
      currentAngle += DEFAULT_ROTATION_RATE
    }
    scene.current.render()
  }, [moving])

  useEffect(() => {
    const canvas = canvasRef.current
    scene.current = new Scene(canvas)

    const light = new PositionalLight()
    light.set(5, 7, 5)

    scene.current.addLight(light) // Testing lights
    cast.current = {}

    scene.current.camera.setPosition(0, 0.5, -CAMERA_DISTANCE)
    scene.current.camera.setTarget(0, 0, 0)

    // Green Grass
    const ground = new Box({ r: 0, g: 1, b: 0 })
    cast.current.ground = ground
    ground.setScale(20, 2, 20)
    ground.setPosition(0, -3.5, 0)
    scene.current.add(ground)

    // Picnic blanket
    const blanket = new Box({ r: 0.9, g: 0.1, b: 0 })
    cast.current.blanket = blanket
    blanket.setScale(10, 0.2, 10)
    blanket.setPosition(0, -2, 0)
    scene.current.add(blanket)

    // Cups
    const cups = new Group()

    const cup1 = new Cylinder({ r: 0, g: 0, b: 1 }, 10, 2, 2, 1, false, false, null)
    cup1.setScale(0.2, 1, 0.1)
    cup1.setPosition(-3, -1.3, 0)
    cups.add(cup1)
    

    const cup2 = new Cylinder({ r: 0, g: 0, b: 1 }, 10, 2, 2, 1, false, false, null)
    cup2.setScale(0.2, 1, 0.1)
    cup2.setPosition(-2, -1.3, -0)
    cups.add(cup2)

    const cup3 = new Cylinder({ r: 0, g: 0, b: 1 }, 10, 2, 2, 1, false, false, null)
    cup3.setScale(0.2, 1, 0.1)
    cup3.setPosition(3, -1.3, -1)
    cups.add(cup3)

    cast.current.cups = cups
    scene.current.add(cups)

    // Plate
    const plate = new Cylinder({ r: 0, g: 1, b: 1 }, 25, 2, 2, 1, false, false, null)
    cast.current.plate = plate
    plate.setScale(0.7, 0.1, 0.4)
    plate.setPosition(0, -1.8, -0.4)
    scene.current.add(plate)

    const tree = new Tree()
    tree.group.setScale(0.5, 0.5, 0.5)
    tree.group.setPosition(10, 0, 10)
    tree.group.setRotation(180, 0, 1, 0)
    cast.current.tree = tree.group
    cast.birdTree = tree
    scene.current.add(tree.group)

    // Clouds
    const clouds1 = new Clouds(0.5)
    cast.clouds1 = clouds1
    cast.current.clouds1 = clouds1.group
    clouds1.group.setPosition(-1.5, 3, 0.1)
    clouds1.group.setScale(0.8, 0.4, 1)
    listOfClouds.push(clouds1)

    const clouds2 = new Clouds(0.5)
    cast.clouds2 = clouds2
    cast.current.clouds2 = clouds2.group
    clouds2.group.setPosition(4, 4, 0.1)
    clouds2.group.setScale(0.8, 0.4, 1)
    listOfClouds.push(clouds2)

    const picnicBasket = new Basket()
    scene.current.add(picnicBasket.group)
    cast.picnicBasket = picnicBasket
    cast.current.picnicBasket = picnicBasket.group

    scene.current.render()
    animate()
  }, [animate, canvasRef])

  const handleToggleShapeWireframe = e => {
    Object.entries(cast.current).forEach(([shapeName, shape]) => {
      shape.setWireframe(shape)
    })
    scene.current.render()
  }

  const handleRotateScene = e => {
    moving = !moving
    if (moving) {
      window.requestAnimationFrame(animate)
    }
  }

  var cloudNum = 0
  const handleAddCloud = e => {
    if (cloudNum < CLOUD_MAX) {
      switch(cloudNum) {
        case 0:
          scene.current.add(cast.current.clouds1)
          cloudNum++
          break;
        case 1:
          scene.current.add(cast.current.clouds2)
          cloudNum++
          break;
        default:
          break;
      }
      CLOUDS_IN_SCENE = true
      
    } else {
      alert('You cannot add more clouds')
    }
    scene.current.render()
  }

  const handleRemoveClouds = e => {
    scene.current.remove(cast.current.clouds1)
    scene.current.remove(cast.current.clouds2)
    CLOUDS_IN_SCENE = false
    cloudNum = 0
    scene.current.render()
  }

  const toggleBasket = e => {
    cast.picnicBasket.toggleBasket()
  }

  const toggleOrthographicProjection = e => {
    scene.current.camera.orthographicProjection = !scene.current.camera.orthographicProjection
    scene.current.render()
  }

  const toggleBird = e => {
    if (cast.birdTree.group.children.has(cast.birdTree.bird)) {
      cast.birdTree.group.remove(cast.birdTree.bird)
    } else {
      cast.birdTree.group.add(cast.birdTree.bird)
    }
  }

  return (
    <article>
      <p>
        The sandbox scene is where you can demonstrate features/capabilities of your library solely for the purpose of
        demonstrating them. It doesn’t have to fit any particular pitch or application.
      </p>
      <div>
        <button onClick={handleToggleShapeWireframe}>Toggle wireframe</button>
        <button onClick={handleRotateScene}>Move Camera</button>
        <button onClick={handleAddCloud}>Add Cloud</button>
        <button onClick={handleRemoveClouds}>Remove Clouds</button>
        <button onClick={toggleBasket}>Toggle basket</button>
        <button onClick={toggleOrthographicProjection}>Toggle Orthographic Projection</button>
        <button onClick={toggleBird}>Toggle Bird</button>
      </div>

      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} style={{ backgroundColor: 'lightblue' }}>
        Your favorite update-your-browser message here.
      </canvas>
    </article>
  )
}

export default PitchedScene
