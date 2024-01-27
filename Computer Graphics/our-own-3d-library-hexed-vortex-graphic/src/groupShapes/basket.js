import * as shapes from '../vexed/vexed-shapes.js'
import { Group } from '../vexed/vexed.js'

const LID_ROTATION_SPEED = 1
const MAX_OPEN_ANGLE = 200

export default class Basket {
  constructor() {
    const boxColor = { r: 0.6, g: 0.3, b: 0.3 }
    const mainBox = new shapes.Cylinder(boxColor, 4, 2, 1.6, 1.6)
    mainBox.setRotation(45, 0, 1, 0)

    const topLid1 = new shapes.Box(boxColor)
    topLid1.setScale(1.5, 0.2, 3)
    topLid1.setPosition(-0.7, 0, 0)

    this.movingLidGroupLeft = new Group()
    this.movingLidGroupLeft.add(topLid1)
    this.movingLidGroupLeft.setPosition(1.5, 0.8, 0)

    const topLid2 = new shapes.Box(boxColor)
    topLid2.setScale(1.5, 0.2, 3)
    topLid2.setPosition(0.7, 0, 0)

    this.movingLidGroupRight = new Group()
    this.movingLidGroupRight.add(topLid2)
    this.movingLidGroupRight.setPosition(-1.5, 0.8, 0)

    this.group = new Group()
    this.group.add(mainBox)
    this.group.add(this.movingLidGroupLeft)
    this.group.add(this.movingLidGroupRight)

    this.group.setPosition(0, -1, 2)

    this.open = false
    this.moving = false
  }

  toggleBasket() {
    this.moving = true
    this.open = !this.open
  }

  lidCheck() {
    if (!this.moving) {
      return
    }
    const leftAngle = this.movingLidGroupLeft.rotation.angle
    const rightAngle = this.movingLidGroupRight.rotation.angle
    
    // First open the left lid
    if (this.open && leftAngle > -MAX_OPEN_ANGLE) {
      this.movingLidGroupLeft.setRotation(leftAngle - LID_ROTATION_SPEED, 0, 0, 1)

    // Then open the right lid
    } else if (this.open && rightAngle < MAX_OPEN_ANGLE) {
      this.movingLidGroupRight.setRotation(rightAngle + LID_ROTATION_SPEED, 0, 0, 1)

    // Otherwise, close the left lid
    } else if (!this.open && leftAngle < 0) {
      this.movingLidGroupLeft.setRotation(leftAngle + LID_ROTATION_SPEED, 0, 0, 1)

    // Then close the right lid
    } else if (!this.open && rightAngle > 0) {
      this.movingLidGroupRight.setRotation(rightAngle - LID_ROTATION_SPEED, 0, 0, 1)

    // If we get here, both lids have been moved, and we are finished 
    } else {
      this.moving = false
    }
  }
}
