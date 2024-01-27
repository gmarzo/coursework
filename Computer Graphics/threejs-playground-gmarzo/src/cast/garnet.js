/**
 * We take the approach of organizing each “cast member” in a scene within its own file.
 * This is a choice and isn’t required, but it does isolate internal changes/enhancements
 * to these specific “characters.”
 */
import { BoxGeometry, MeshPhongMaterial, Mesh, TorusGeometry, Group } from 'three'

/**
 * The use of a JavaScript “class” is also a design choice.
 */
class Garnet {
  constructor(color) {
    this.geometry = new BoxGeometry()
    this.material = new MeshPhongMaterial({ color })
    const cube = new Mesh(this.geometry, this.material)

    const ringMaterial = new MeshPhongMaterial({ color: 'pink' })
    const ringGeometry = new TorusGeometry(1, 0.1, 12, 48)
    const ring = new Mesh(ringGeometry, ringMaterial)

    const group = new Group()
    group.add(cube)
    group.add(ring)

    const gemGroup = new Group()
    gemGroup.add(cube)
    // cube.position.y = 1.5

    group.add(gemGroup)

    this.gem = gemGroup
    this.mesh = group
  }

  rotateGem() {
    this.gem.rotation.z += 0.05
  }
}

export default Garnet
