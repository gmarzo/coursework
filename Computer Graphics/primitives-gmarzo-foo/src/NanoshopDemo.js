import { useEffect, useRef } from 'react'

import cafe from './cafe-scene/cafe'
import { applyFilter, darken, bluen } from './nanoshop'

/**
 * If you don’t know React well, don’t worry about the trappings. Just focus on the code inside
 * the nanoshop module.
 */
const NanoshopDemo = props => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    cafe.draw(canvas.getContext('2d'))
  }, [canvasRef])

  const filterAndWrite = filter => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    // Filter time.
    const renderingContext = canvas.getContext('2d')
    renderingContext.putImageData(
      applyFilter(renderingContext.getImageData(0, 0, canvas.width, canvas.height), filter),
      0,
      0
    )
  }

  const handleDarken = event => filterAndWrite(darken)
  const handleBluen = event => filterAndWrite(bluen)

  return (
    <article>
      <section className="instructions-buttons">
        Click a button to apply a simple filter!
        <span>
          <button onClick={handleDarken}>Darken</button>
          <button onClick={handleBluen}>Da ba dee da ba di</button>
        </span>
      </section>

      <canvas width="800" height="440" ref={canvasRef}>
        All your <code>canvas</code> are belong to us!
      </canvas>

      <p>Reload the page to start over.</p>
    </article>
  )
}

export default NanoshopDemo
