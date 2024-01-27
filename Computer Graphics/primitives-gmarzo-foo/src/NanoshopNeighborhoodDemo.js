import { useEffect, useRef } from 'react'

import cafe from './cafe-scene/cafe'
import { applyNeighborhoodFilter, average, basicEdgeDetect, darken, markTheSpot } from './nanoshop-neighborhood'

const NanoshopNeighborhood = props => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const renderingContext = canvas.getContext('2d')
    cafe.draw(renderingContext)

    // Some edge lines to test for wraparound bleeding.
    renderingContext.strokeStyle = 'yellow'
    renderingContext.beginPath()
    renderingContext.moveTo(0, 0)
    renderingContext.lineTo(canvas.width - 1, 0)
    renderingContext.stroke()

    renderingContext.strokeStyle = 'cyan'
    renderingContext.beginPath()
    renderingContext.moveTo(0, canvas.height - 1)
    renderingContext.lineTo(canvas.width - 1, canvas.height - 1)
    renderingContext.stroke()

    renderingContext.strokeStyle = 'green'
    renderingContext.beginPath()
    renderingContext.moveTo(0, 0)
    renderingContext.lineTo(0, canvas.height - 1)
    renderingContext.stroke()

    renderingContext.strokeStyle = 'red'
    renderingContext.beginPath()
    renderingContext.moveTo(canvas.width - 1, 0)
    renderingContext.lineTo(canvas.width - 1, canvas.height / 2)
    renderingContext.stroke()

    renderingContext.strokeStyle = 'blue'
    renderingContext.beginPath()
    renderingContext.moveTo(canvas.width - 1, canvas.height / 2)
    renderingContext.lineTo(canvas.width - 1, canvas.height - 1)
    renderingContext.stroke()
  }, [canvasRef])

  const filterAndWrite = filter => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    // Filter time.
    const renderingContext = canvas.getContext('2d')
    renderingContext.putImageData(
      applyNeighborhoodFilter(
        renderingContext,
        renderingContext.getImageData(0, 0, canvas.width, canvas.height),
        filter
      ),
      0,
      0
    )
  }

  const handleDarken = event => filterAndWrite(darken)
  const handleAverage = event => filterAndWrite(average)
  const handleBasicEdgeDetect = event => filterAndWrite(basicEdgeDetect)
  const handleXMarks = event => filterAndWrite(markTheSpot)

  return (
    <article>
      <section className="instructions-buttons">
        Click a button to apply a neighborhood filter!
        <span>
          <button onClick={handleDarken}>Darken</button>
          <button onClick={handleAverage}>Average</button>
          <button onClick={handleBasicEdgeDetect}>Basic Edge Detect</button>
          <button onClick={handleXMarks}>X Marks the Spot</button>
        </span>
      </section>

      <canvas width="800" height="440" ref={canvasRef}>
        All your <code>canvas</code> are belong to us!
      </canvas>

      <p>Reload the page to start over.</p>
    </article>
  )
}

export default NanoshopNeighborhood
