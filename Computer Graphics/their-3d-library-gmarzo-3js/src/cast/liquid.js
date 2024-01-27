import { CircleGeometry, MeshPhongMaterial, Mesh } from 'three'
import { Tween, Ease } from '@createjs/tweenjs'

class Liquid {
  constructor() {
    this.MAX_HEIGHT = 1.2
    this.BASE_HEIGHT = 0.2
    this.currentHeight = this.BASE_HEIGHT

    const liquidGeometry = new CircleGeometry(1, 6)
    const liquidMaterial = new MeshPhongMaterial({ color: 0x70aa40 })
    const liquidMesh = new Mesh(liquidGeometry, liquidMaterial)
    this.mesh = liquidMesh

    this.isFull = false
  }

  fill() {
    if (this.currentHeight >= this.MAX_HEIGHT) {
      this.isFull = true
      return
    }

    Tween.get(this.mesh.position)
      .to({ y: Math.min(this.mesh.position.y + 0.1, this.MAX_HEIGHT) }, 500, Ease.linear)
      .call(() => {
        this.currentHeight += 0.1
      })
  }

  drink() {
    Tween.get(this.mesh.position)
      .to({ y: this.BASE_HEIGHT }, 1000, Ease.linear)
      .call(() => {
        this.isFull = false
        this.currentHeight = this.BASE_HEIGHT
      })
  }
}

export default Liquid
