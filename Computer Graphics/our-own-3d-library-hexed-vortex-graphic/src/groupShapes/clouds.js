import { Sphere } from '../vexed/vexed-shapes.js'
import { Group } from '../vexed/vexed.js'

class Clouds {
  constructor(speed = 1.0) {
    // Big Cloud
    // Create parts of clouds
    const cloudLeft1 = new Sphere({ r: 1, g: 1, b: 1 }, 1, 10, 10)
    const cloudFront1 = new Sphere({ r: 1, g: 1, b: 1 }, 1, 10, 10)
    const cloudRight1 = new Sphere({ r: 1, g: 1, b: 1 }, 1, 10, 10)
    const cloudTop1 = new Sphere({ r: 1, g: 1, b: 1 }, 1 ,10, 10)
    const cloudBottom1 = new Sphere({ r: 1, g: 1, b: 1 }, 1, 10, 10)
    const cloudBack1 = new Sphere({ r: 1, g: 1, b: 1 }, 1, 10, 10)
    this.speeds1 = speed

    // Set positions for each part of the cloud
    cloudLeft1.setPosition(-1, 0, 0)
    cloudRight1.setPosition(1, 0, 0)
    cloudBack1.setPosition(0, 0, 0.25)
    cloudTop1.setPosition(0, 0.5, 0)
    cloudBottom1.setPosition(0, -1, 0)
    cloudFront1.setPosition(0, 0, -0.25)

    // Scale each part of the cloud
    cloudLeft1.setScale(0.7, 0.6, 1)
    cloudRight1.setScale(0.7, 0.5, 1)
    cloudBack1.setScale(0.9, 0.6, 1)
    cloudTop1.setScale(0.85, 0.6, 1)
    cloudBottom1.setScale(0.8, 0.4, 1)
    cloudFront1.setScale(0.9, 0.6, 1)

    // Shading
    cloudLeft1.smoothLighting = true
    cloudRight1.smoothLighting = true
    cloudBack1.smoothLighting = true
    cloudTop1.smoothLighting = true
    cloudBottom1.smoothLighting = true
    cloudFront1.smoothLighting = true

    // Add each part of the cloud to group
    this.bigCloud = new Group()
    this.bigCloud.add(cloudLeft1)
    this.bigCloud.add(cloudRight1)
    this.bigCloud.add(cloudFront1)
    this.bigCloud.add(cloudTop1)
    this.bigCloud.add(cloudBottom1)
    this.bigCloud.add(cloudBack1)

    // Small Cloud
    const cloudLeft2 = new Sphere({ r: 0.5, g: 0.5, b: 0.5 }, 1, 10, 10)
    const cloudFront2 = new Sphere({ r: 0.5, g: 0.5, b: 0.5 }, 1, 10, 10)
    const cloudRight2 = new Sphere({ r: 0.5, g: 0.5, b: 0.5 }, 1, 10, 10)
    const cloudTop2 = new Sphere({ r: 0.5, g: 0.5, b: 0.5 }, 1, 10, 10)
    const cloudBottom2 = new Sphere({ r: 0.5, g: 0.5, b: 0.5 }, 1, 10, 10)
    const cloudBack2 = new Sphere({ r: 0.5, g: 0.5, b: 0.5 }, 1, 10, 10)
    
    // Set positions for each part of the cloud
    cloudLeft2.setPosition(-1, 0, 0.3)
    cloudRight2.setPosition(1, 0, 0.3)
    cloudBack2.setPosition(0, 0, 0.55)
    cloudTop2.setPosition(0, 0.5, 0.3)
    cloudBottom2.setPosition(0, -1, 0.3)
    cloudFront2.setPosition(0, 0, 0.1)

    // Scale each part of the cloud
    cloudLeft2.setScale(0.3, 0.2, 1)
    cloudRight2.setScale(0.3, 0.2, 1)
    cloudBack2.setScale(0.6, 0.3, 1)
    cloudTop2.setScale(0.55, 0.3, 1)
    cloudBottom2.setScale(0.5, 0.1, 1)
    cloudFront2.setScale(0.6, 0.3, 1)

    // Shading
    cloudLeft2.smoothLighting = true
    cloudRight2.smoothLighting = true
    cloudBack2.smoothLighting = true
    cloudTop2.smoothLighting = true
    cloudBottom2.smoothLighting = true
    cloudFront2.smoothLighting = true

    // Add each part of the cloud to group
    this.smallCloud = new Group()
    this.smallCloud.add(cloudLeft2)
    this.smallCloud.add(cloudRight2)
    this.smallCloud.add(cloudFront2)
    this.smallCloud.add(cloudTop2)
    this.smallCloud.add(cloudBottom2)
    this.smallCloud.add(cloudBack2)

    this.group = new Group()
    this.group.add(this.bigCloud)
    this.group.add(this.smallCloud)
    this.moving1 = true
  }

  getSpeed() {
    return this.speeds1
  }

  move() {
    if (!this.moving1) {
      return 
    }
    this.smallCloud.setRotation(45, this.group.position.x + this.getSpeed()/2, this.group.position.y, this.group.position.z)
    if (this.group.position.x > 10 || this.group.position.x < -10) {
      this.speeds1 *= -1
    }
    this.group.position.x += this.getSpeed()/5
  }
}

export default Clouds
