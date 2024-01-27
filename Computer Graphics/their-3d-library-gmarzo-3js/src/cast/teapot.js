import {
  LatheGeometry,
  BoxGeometry,
  CircleGeometry,
  SphereGeometry,
  CylinderGeometry,
  MeshPhongMaterial,
  TextureLoader,
  Mesh,
  Group,
  Vector2
} from 'three'
import { Tween, Ease } from '@createjs/tweenjs'
// Texture from: https://www.istockphoto.com/photos/porcelain-texture
import porcelainTexture from '../textures/porcelain-texture.jpeg'

class Teapot {
  constructor() {
    const textureLoader = new TextureLoader()

    const points = []
    for (let i = 0; i < 2; i += 0.1) {
      points.push(new Vector2(2 - i ** 2 / 2, i))
    }

    // Meshes for teapot body
    const potGeometry = new LatheGeometry(points)
    const potMaterial = new MeshPhongMaterial({ map: textureLoader.load(porcelainTexture) })
    const potMesh = new Mesh(potGeometry, potMaterial)

    const topGeometry = new SphereGeometry(0.3, 32, 32)
    const topMaterial = new MeshPhongMaterial({ color: 0x202020 })
    const topMesh = new Mesh(topGeometry, topMaterial)

    topMesh.position.y = 2

    const spoutGeometry = new CylinderGeometry(0.3, 0.2, 0.9)
    const spoutMaterial = new MeshPhongMaterial({ map: textureLoader.load(porcelainTexture) })
    const spoutMesh = new Mesh(spoutGeometry, spoutMaterial)

    spoutMesh.position.y = 1
    spoutMesh.position.x = 1.5
    spoutMesh.rotation.z = (Math.PI * 4) / 6

    const potBottomGeometry = new CircleGeometry(2, 12)
    const potBottomMaterial = new MeshPhongMaterial({ map: textureLoader.load(porcelainTexture) })
    const potBottomMesh = new Mesh(potBottomGeometry, potBottomMaterial)

    potBottomMesh.rotation.x = Math.PI / 2
    const pot = new Group()
    pot.add(potMesh)
    pot.add(topMesh)
    pot.add(spoutMesh)
    pot.add(potBottomMesh)

    // Meshes for teapot handle

    const topSupportGeometry = new BoxGeometry(1.5, 0.2, 0.2)
    const topSupportMaterial = new MeshPhongMaterial({ color: 0x303030 })
    const topSupportMesh = new Mesh(topSupportGeometry, topSupportMaterial)

    topSupportMesh.position.y = 1.3
    topSupportMesh.position.x = -1.6

    const bottomSupportGeometry = new BoxGeometry(0.6, 0.2, 0.2)
    const bottomSupportMaterial = new MeshPhongMaterial({ color: 0x303030 })
    const bottomSupportMesh = new Mesh(bottomSupportGeometry, bottomSupportMaterial)

    bottomSupportMesh.position.y = 0.6
    bottomSupportMesh.position.x = -2.1

    const handleGeometry = new CylinderGeometry(0.2, 0.2, 1)
    const handleMaterial = new MeshPhongMaterial({ color: 0x553f33 })
    const handleMesh = new Mesh(handleGeometry, handleMaterial)

    handleMesh.position.y = 0.95
    handleMesh.position.x = -2.4

    const handle = new Group()
    handle.add(topSupportMesh)
    handle.add(bottomSupportMesh)
    handle.add(handleMesh)

    this.group = new Group()
    this.group.add(pot)
    this.group.add(handle)

    this.pouring = false
    this.resetting = false
  }

  pour(callback) {
    // this.pouring = true
    Tween.get(this.group.position).to({ y: 3, x: -0.8, z: 0.66 }, 1000, Ease.quadInOut)

    Tween.get(this.group.rotation)
      .to({ z: -Math.PI / 3 }, 1000, Ease.quadInOut)
      .call(callback)
  }

  reset() {
    if (!this.resetting) {
      this.pouring = false
      this.resetting = true
      Tween.get(this.group.position).to({ y: 0, x: 1, z: 1 }, 1000, Ease.quadInOut)

      Tween.get(this.group.rotation)
        .to({ z: 0 }, 1000, Ease.quadInOut)
        .call(() => {
          this.resetting = false
        })
    }
  }
}

export default Teapot
