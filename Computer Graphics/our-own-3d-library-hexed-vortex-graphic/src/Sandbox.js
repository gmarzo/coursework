/**
 * Build out this component to display a “sandbox” scene—see the description below.
 */
import { useCallback, useEffect, useRef } from 'react'
import { Scene, Group, PositionalLight } from './vexed/vexed'
import { Box, Sphere, Cylinder, Extrude, Lathe } from './vexed/vexed-shapes'

const CANVAS_WIDTH = 512
const CANVAS_HEIGHT = 512
const DEFAULT_ROTATION_RATE = 0.1

const Sandbox = props => {
  const canvasRef = useRef()

  let scene = useRef()
  let cast = useRef()
  let moving = false

  const animate = useCallback(() => {
    window.requestAnimationFrame(animate)
    if (moving) {
      scene.current.rotation.angle += DEFAULT_ROTATION_RATE
      scene.current.render()
    }
  }, [moving])

  useEffect(() => {
    const canvas = canvasRef.current
    scene.current = new Scene(canvas)

    const light = new PositionalLight()
    light.set(1, 0, -1)

    scene.current.addLight(light) // Testing lights

    cast.current = {}

    const box = new Box(
      { r: 1, g: 0, b: 0 },
      false,
      true
    )
    cast.current.box = box
    box.setRotation(30, 1, 1, 1)
    box.setPosition(-1.5, 1.5, 0)

    const sphere = new Sphere({ r: 1, g: 0, b: 0 }, 1, 32, 16, false, true)
    cast.current.sphere = sphere
    sphere.setScale(1.5, 1.6, 1.5)
    sphere.setPosition(0, 0, 0)

    const cylinder = new Cylinder({ r: 0, g: 0, b: 1 }, 16, 0.4, 0.3, 0.5, false, true)
    cast.current.cylinder = cylinder
    cylinder.setRotation(45, 1, 1, 1)
    cylinder.setPosition(-1.7, -1.5, 0)
    cylinder.setScale(1.5, -1.6, 1.5)

    const latheOutline = [0.4, 0.5, 0.35, 0.25, 0.6, -0.2, 0, -0.5]
    const lathe = new Lathe({ r: 0, g: 0, b: 1 }, latheOutline, 16, false, true)
    cast.current.lathe = lathe
    lathe.setScale(1.25, 1.25, 1.25)
    lathe.setPosition(1.5, -2, 0)

    const extrude = new Extrude({ r: 0, g: 1, b: 0 }, [-0.5, 0, 0.5, 0, 0, 0.5], 1, false, true)
    cast.current.extrude = extrude
    extrude.setScale(1.5, 1.5, 1.5)
    extrude.setPosition(1.5, 1.5, 0)

    const group = new Group()
    const latheForGroupOutline = [0.4, 0.5, 0, 0, 0.6, -0.2, 0, -0.5]
    const latheForGroup = new Lathe({ r: 0, g: 1, b: 0.5 }, latheForGroupOutline, 16, false, true)
    const sphereForGroup = new Sphere({ r: 0, g: 0, b: 0 }, 0.2, 16, 8, false, true)
    sphereForGroup.setScale(2, 1, 2)
    group.add(latheForGroup)
    group.add(sphereForGroup)
    group.setPosition(0, 2.5, 0)

    cast.current.group = group

    animate()
  }, [animate, canvasRef])

  let selectedShape = null
  const handleShapeChange = event => {
    selectedShape = cast.current[event.target.value]
  }

  const handleAddShape = e => {
    scene.current.add(selectedShape)
    scene.current.render()
  }

  const handleRemoveShape = e => {
    scene.current.remove(selectedShape)
    scene.current.render()
  }

  const handleToggleShapeWireframe = e => {
    selectedShape.setWireframe(selectedShape)
    scene.current.render()
  }

  const handleRotateScene = e => {
    moving = !moving
    if (moving) {
      window.requestAnimationFrame(animate)
    }
  }

  const handleSmoothShading = e => {
    selectedShape.smoothLighting = !selectedShape.smoothLighting
    scene.current.render()
  }

  return (
    <article>
      <p>
        The sandbox scene is where you can demonstrate features/capabilities of your library solely for the purpose of
        demonstrating them. It doesn’t have to fit any particular pitch or application.
      </p>
      <select onChange={handleShapeChange} style={{ marginLeft: 'auto' }}>
        <option value="sphere">Select Shape</option>
        <option value="sphere">Sphere</option>
        <option value="box">Box</option>
        <option value="cylinder">Cylinder</option>
        <option value="lathe">Lathe</option>
        <option value="extrude">Extrude</option>
        <option value="group">Example Group</option>
      </select>
      <div>
        <button onClick={handleAddShape}>Add shape</button>
        <button onClick={handleRemoveShape}>Remove shape</button>
        <button onClick={handleToggleShapeWireframe}>Toggle shape wireframe</button>
        <button onClick={handleRotateScene}>Rotate scene</button>
        <button onClick={handleSmoothShading}>Toggle smooth shading</button>
      </div>

      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}>
        Your favorite update-your-browser message here.
      </canvas>
    </article>
  )
}

export default Sandbox
