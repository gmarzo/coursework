import { useEffect, useRef } from 'react'
import * as Primitives from './primitives'

/**
 * If you don’t know React well, don’t worry about the trappings. Just focus on the code inside
 * the useEffect hook.
 */
const PrimitivesDemo = props => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const renderingContext = canvas.getContext('2d')

    // Start with rectangles.
    renderingContext.fillStyle = 'gray' // For demonstrating the no-color case.
    Primitives.fillRect(renderingContext, 5, 5, 200, 100)
    Primitives.fillRect(renderingContext, 210, 5, 200, 100, [255, 0, 255])
    Primitives.fillRect(renderingContext, 415, 5, 200, 100, [255, 0, 0], [230, 230, 230])
    Primitives.fillRect(renderingContext, 620, 5, 200, 100, [0, 0, 200], [0, 255, 0], [190, 140, 0])
    Primitives.fillRect(renderingContext, 825, 5, 200, 100, [255, 0, 0], [255, 255, 0], [0, 200, 0], [0, 0, 100])

    // Some line segments.
    Primitives.lineDDA(renderingContext, 5, 210, 204, 110)
    Primitives.lineBres1(renderingContext, 210, 210, 409, 110)
    Primitives.lineBres2(renderingContext, 415, 210, 614, 110)
    Primitives.lineBres3(renderingContext, 620, 210, 819, 110)
    Primitives.lineBresenham(renderingContext, 825, 210, 1024, 110)

    // A few circles.
    Primitives.circleTrig(renderingContext, 105, 315, 100, [0, 0, 255], [0, 255, 255])
    Primitives.circleDDA(renderingContext, 310, 315, 100, [255, 255, 0], [255, 0, 0])
    Primitives.circleBres1(renderingContext, 515, 315, 100, [0, 255, 0], [255, 0, 255])
    Primitives.circleBres2(renderingContext, 720, 315, 100, [0, 255, 255], [255, 0, 0])
    Primitives.circleBres3(renderingContext, 925, 315, 100, [255, 0, 255], [0, 255, 0])

    // And finally...polygon fills!
    renderingContext.save()
    renderingContext.translate(5, 420)
    Primitives.fillPolygon(
      renderingContext,
      [
        { x: 50, y: 50, color: { r: 255, g: 0, b: 0 } },
        { x: 50, y: 80, color: { r: 0, g: 255, b: 0 } },
        { x: 80, y: 100, color: { r: 0, g: 0, b: 255 } },
        { x: 140, y: 50, color: { r: 255, g: 255, b: 0 } },
        { x: 140, y: 80, color: { r: 0, g: 255, b: 255 } },
        { x: 110, y: 50, color: { r: 255, g: 0, b: 255 } }
      ],
      [0, 0, 255]
    )
    renderingContext.restore()

    renderingContext.save()
    renderingContext.translate(210, 420)
    Primitives.fillPolygon(renderingContext, [
      { x: 50, y: 5, color: { r: 0, g: 255, b: 255 } },
      { x: 100, y: 80, color: { r: 10, g: 184, b: 106 } },
      { x: 120, y: 40, color: { r: 0, g: 255, b: 0 } }
    ])
    renderingContext.restore()

    renderingContext.save()
    renderingContext.translate(415, 420)
    Primitives.fillPolygon(renderingContext, [
      { x: 30, y: 40, color: { r: 0, g: 0, b: 255 } },
      { x: 100, y: 40, color: { r: 255, g: 0, b: 0 } },
      { x: 100, y: 100, color: { r: 255, g: 255, b: 0 } },
      { x: 30, y: 100, color: { r: 0, g: 255, b: 0 } }
    ])
    renderingContext.restore()

    renderingContext.save()
    renderingContext.translate(620, 420)
    Primitives.fillPolygon(renderingContext, [
      { x: 20, y: 20, color: { r: 36, g: 122, b: 99 } },
      { x: 50, y: 25, color: { r: 27, g: 130, b: 130 } },
      { x: 100, y: 90, color: { r: 66, g: 80, b: 81 } },
      { x: 50, y: 100, color: { r: 35, g: 72, b: 81 } },
      { x: 15, y: 80, color: { r: 8, g: 28, b: 51 } },
      { x: 10, y: 50, color: { r: 102, g: 69, b: 96 } }
    ])
    renderingContext.restore()

    renderingContext.save()
    renderingContext.translate(825, 420)
    Primitives.fillPolygon(renderingContext, [
      { x: 100, y: 10, color: { r: 140, g: 110, b: 78 } },
      { x: 150, y: 100, color: { r: 244, g: 48, b: 163 } },
      { x: 20, y: 40, color: { r: 0, g: 159, b: 252 } },
      { x: 180, y: 40, color: { r: 8, g: 4, b: 10 } },
      { x: 50, y: 100, color: { r: 53, g: 56, b: 41 } }
    ])
    renderingContext.restore()
  }, [canvasRef])

  return (
    <article>
      <p>
        Everything you see below was drawn <em>one pixel at a time</em>, using 2D graphics primitives implemented
        completely in JavaScript. Slow, but educational!
      </p>

      <canvas width="1030" height="525" ref={canvasRef}>
        Your favorite update-your-browser message here.
      </canvas>
    </article>
  )
}

export default PrimitivesDemo
