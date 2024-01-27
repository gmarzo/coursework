import { SphereGeometry, MeshPhongMaterial, Mesh } from 'three'

class Teadrop {
  constructor() {
    const dropGeometry = new SphereGeometry(0.1, 32, 32)
    const dropMaterial = new MeshPhongMaterial({ color: 0x70aa40 })
    const dropMesh = new Mesh(dropGeometry, dropMaterial)
    this.mesh = dropMesh
  }
}

export default Teadrop
