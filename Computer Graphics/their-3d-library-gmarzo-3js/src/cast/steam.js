import { RingGeometry, MeshBasicMaterial, Mesh } from 'three'
import { Tween, Ease } from '@createjs/tweenjs'

class Steam {
  constructor() {
    const steamGeometry = new RingGeometry(0.2, 0.3, 6)
    const steamMaterial = new MeshBasicMaterial({ color: 0xffffff, side: 2 })
    const steamMesh = new Mesh(steamGeometry, steamMaterial)
    this.mesh = steamMesh
  }

  rise() {
    Tween.get(this.mesh.scale).to({ x: 2, y: 2, z: 2 }, 3000, Ease.sineIn)
    Tween.get(this.mesh.position)
      .to({ y: 2.5 }, 3000, Ease.circIn)
      .call(() => {
        this.mesh.position.y = 1.3
        this.mesh.scale.set(1, 1, 1)
        this.rise()
      })
  }
}

export default Steam
