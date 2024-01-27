import chalkboard from './chalkboard'
import counter from './counter'
import cup from './cup'
import roomlight from './roomlight'
import shelf from './shelf'
import wall from './wall'

const drawCafe = renderingContext => {
  // Scene created by Angela Elgar: https://github.com/aelgar
  renderingContext.save()

  renderingContext.translate(400, 200)
  wall.draw(renderingContext, {})

  renderingContext.resetTransform()
  renderingContext.translate(120, 220)
  shelf.draw(renderingContext)
  renderingContext.translate(220, 0)
  shelf.draw(renderingContext)
  renderingContext.resetTransform()
  renderingContext.translate(510, 120)
  chalkboard.draw(renderingContext, { variation: 'A' })
  renderingContext.translate(110, 0)
  chalkboard.draw(renderingContext, { variation: 'B' })
  renderingContext.translate(110, 0)
  chalkboard.draw(renderingContext, { variation: 'A' })

  renderingContext.resetTransform()
  renderingContext.translate(80, 88)
  renderingContext.scale(0.2, 0.2)
  renderingContext.rotate(Math.PI)
  cup.draw(renderingContext, { color: 'PapayaWhip' })
  renderingContext.translate(-180, 0)
  cup.draw(renderingContext, { color: 'DarkSalmon' })
  renderingContext.translate(-180, 0)
  cup.draw(renderingContext, { color: 'PapayaWhip' })

  renderingContext.translate(-690, 0)
  renderingContext.rotate(Math.PI)
  cup.draw(renderingContext, { color: 'SeaGreen' })
  renderingContext.translate(250, 0)
  cup.draw(renderingContext, {})

  renderingContext.resetTransform()
  renderingContext.translate(70, 158)
  renderingContext.scale(0.2, 0.2)
  cup.draw(renderingContext, { color: 'CadetBlue' })
  renderingContext.translate(220, 0)
  cup.draw(renderingContext, { color: 'Plum' })
  renderingContext.translate(220, 0)
  cup.draw(renderingContext, { color: 'CadetBlue' })

  renderingContext.resetTransform()
  renderingContext.translate(290, 228)
  renderingContext.scale(0.2, 0.2)
  cup.draw(renderingContext, { color: 'LemonChiffon' })
  renderingContext.translate(220, 0)
  cup.draw(renderingContext, { color: 'LemonChiffon' })
  renderingContext.translate(220, 0)
  cup.draw(renderingContext, { color: 'LemonChiffon' })

  renderingContext.resetTransform()
  renderingContext.translate(570, 360)
  counter.draw(renderingContext)

  renderingContext.resetTransform()
  renderingContext.translate(540, 280)
  renderingContext.scale(0.2, 0.2)
  cup.draw(renderingContext, { steamOpacity: 0.3 })
  renderingContext.translate(300, 0)
  cup.draw(renderingContext, { steamOpacity: 0.4, color: 'SeaGreen' })

  renderingContext.setTransform(0.5, 0, 0, 0.5, 60, 50)
  roomlight.draw(renderingContext, { brightness: 0.3 })
  renderingContext.translate(300, -50)
  renderingContext.scale(1.5, 1.2)
  roomlight.draw(renderingContext, { brightness: 0.5 })
  renderingContext.translate(280, -20)
  renderingContext.scale(0.5, 1)
  roomlight.draw(renderingContext, { brightness: 0.3 })
  renderingContext.translate(500, 30)
  renderingContext.scale(2.5, 0.7)
  roomlight.draw(renderingContext, { brightness: 0.4 })
  renderingContext.translate(160, -80)
  renderingContext.scale(0.5, 1)
  roomlight.draw(renderingContext, { brightness: 0.4 })
  renderingContext.translate(-800, -600)
  renderingContext.scale(5, 2.5)
  roomlight.draw(renderingContext, { brightness: 0.4 })

  renderingContext.restore()
}

const cafe = {
  draw: drawCafe
}

export default cafe
