import * as shapes from '../vexed/vexed-shapes.js'
import { Group } from '../vexed/vexed.js'

class Tree {
  constructor() {
    this.exposed = false
    this.progress = 0
    this.group = new Group()
    const trunk = new shapes.Cylinder({ r: 0.8, g: 0.4, b: 0.0 }, 7, 2, 2, 9)
    const treetop = new shapes.Sphere({ r: 0.0, g: 1.0, b: 0.0 }, 6)
    const birdHole = new shapes.Cylinder({ r: 0, g: 0, b: 0 }, 12, 1, 1, 0.01)

    this.bird = new Group()
    const birdHead = new shapes.Sphere({ r: 0, g: 0.6, b: 0.9 }, 0.8)
    const beak = new shapes.Cylinder({ r: 1.0, g: 0.9, b: 0.0 }, 4, 0, 0.2, 0.5)

    beak.setPosition(0, 1, 0)

    this.bird.add(birdHead)
    this.bird.add(beak)

    this.group.add(trunk)
    this.group.add(treetop)
    this.group.add(birdHole)
    this.group.add(this.bird)

    trunk.setPosition(0, -2, 0)
    treetop.setPosition(0, 6, 0)

    birdHole.setPosition(0, -2, 2)
    birdHole.setRotation(90, 1, 0, 0)

    this.bird.setPosition(0, -2, 0)
    this.bird.setRotation(90, 1, 0, 0)
  }
}

export default Tree
