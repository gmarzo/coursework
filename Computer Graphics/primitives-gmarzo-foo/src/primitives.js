/*
 * A module demonstrating assorted algorithms for selected 2D graphics
 * operations.
 */

/*
 * This is the cornerstone: we promise not to use any other graphics
 * operation but this one.
 */
const setPixel = (context, x, y, r, g, b) => {
  context.save()
  context.fillStyle = `rgb(${Number(r)},${Number(g)},${Number(b)})`
  context.fillRect(x, y, 1, 1)
  context.restore()
}

/*
 * The easy fill case: rectangles.  We take advantage of JavaScript's
 * "optional" parameter mechanism to keep things at a single method.
 *
 * A note about naming: this is one of the _rare_ times where a numbered
 * variable name is...tolerable. The way the last four arguments are
 * supplied determines how the rectangle is filled, so generic names
 * are used here.
 */
const fillRect = (context, x, y, w, h, c1, c2, c3, c4) => {
  const bottom = y + h
  const right = x + w
  const radius = Math.min(w, h) / 2
  const center = { x: x + w / 2, y: y + h / 2 }
  const leftColor = c1 ? [c1[0], c1[1], c1[2]] : c1
  const rightColor = c2 ? [c2[0], c2[1], c2[2]] : c2
  let leftVDelta
  let rightVDelta

  // We have four subcases: zero, one, two, or four colors
  // supplied.  The three-color case will be treated as if
  // the third and fourth colors are the same.  Instead of
  // embedding different logic into a single loop, we just
  // break them up.  This allows each case to be "optimal"
  // and simplifies reading the code.  There *is* some
  // duplicate code, but in this case the benefits outweigh
  // the cost.
  const fillRectNoColor = () => {
    // The rendering context will just ignore the
    // undefined colors in this case.
    for (let i = y; i < bottom; i += 1) {
      for (let j = x; j < right; j += 1) {
        setPixel(context, j, i)
      }
    }
  }

  const fillRectOneColor = () => {
    // Single color all the way through.
    for (let i = y; i < bottom; i += 1) {
      for (let j = x; j < right; j += 1) {
        setPixel(context, j, i, ...c1)
      }
    }
  }

  const fillRectTwoColors = () => {
    // This modifies the color vertically only.
    for (let i = y; i < bottom; i += 1) {
      for (let j = x; j < right; j += 1) {
        if (Math.sqrt((j - center.x) ** 2 + (i - center.y) ** 2) > radius) {
          setPixel(context, j, i, ...rightColor)
          continue
        } else {
          let centerDistance = Math.sqrt((j - center.x) ** 2 + (i - center.y) ** 2)
          setPixel(
            context,
            j,
            i,
            leftColor[0] + (rightColor[0] - leftColor[0]) * (centerDistance / radius),
            leftColor[1] + (rightColor[1] - leftColor[1]) * (centerDistance / radius),
            leftColor[2] + (rightColor[2] - leftColor[2]) * (centerDistance / radius)
          )
        }
      }

      // Move to the next level of the gradient.
      // leftColor[0] += leftVDelta[0]
      // leftColor[1] += leftVDelta[1]
      // leftColor[2] += leftVDelta[2]
    }
  }

  const fillRectFourColors = () => {
    for (let i = y; i < bottom; i += 1) {
      // Move to the next "vertical" color level.
      const currentColor = [leftColor[0], leftColor[1], leftColor[2]]
      const hDelta = [
        (rightColor[0] - leftColor[0]) / w,
        (rightColor[1] - leftColor[1]) / w,
        (rightColor[2] - leftColor[2]) / w
      ]

      for (let j = x; j < right; j += 1) {
        setPixel(context, j, i, ...currentColor)

        // Move to the next color horizontally.
        currentColor[0] += hDelta[0]
        currentColor[1] += hDelta[1]
        currentColor[2] += hDelta[2]
      }

      // The color on each side "grades" at different rates.
      leftColor[0] += leftVDelta[0]
      leftColor[1] += leftVDelta[1]
      leftColor[2] += leftVDelta[2]
      rightColor[0] += rightVDelta[0]
      rightColor[1] += rightVDelta[1]
      rightColor[2] += rightVDelta[2]
    }
  }

  // Depending on which colors are supplied, we call a different
  // version of the fill code.
  if (!c1) {
    fillRectNoColor()
  } else if (!c2) {
    fillRectOneColor()
  } else if (!c3) {
    // For this case, we set up the left vertical deltas.
    leftVDelta = [(c2[0] - c1[0]) / h, (c2[1] - c1[1]) / h, (c2[2] - c1[2]) / h]
    fillRectTwoColors()
  } else {
    // The four-color case, with a quick assignment in case
    // there are only three colors.
    c4 = c4 || c3

    // In primitives, one tends to see repeated code more
    // often than function calls, because this is the rare
    // situation where function call overhead costs more
    // than repeated code.
    leftVDelta = [(c3[0] - c1[0]) / h, (c3[1] - c1[1]) / h, (c3[2] - c1[2]) / h]
    rightVDelta = [(c4[0] - c2[0]) / h, (c4[1] - c2[1]) / h, (c4[2] - c2[2]) / h]
    fillRectFourColors()
  }
}

/*
 * Here come our line-drawing primitives.  Note, for simplicity, that
 * we code for a specific case of a diagonal line going up.  Other cases
 * either switch directions or have specific optimizations (e.g., strictly
 * horizontal and vertical lines).
 */

// Our digital-differential analyzer (DDA) version.
const lineDDA = (context, x1, y1, x2, y2, color = [0, 0, 0]) => {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))
  const dx = (x2 - x1) / steps
  const dy = (y2 - y1) / steps
  let x = x1
  let y = y1

  for (let i = 0; i <= steps; i += 1) {
    setPixel(context, x, y, ...color)
    x += dx
    y += dy
  }
}

// Bresenham algorithm version 1.
const lineBres1 = (context, x1, y1, x2, y2, color = [0, 0, 0]) => {
  let x = x1
  let y = y1
  const dx = x2 - x1
  const dy = y1 - y2
  let err = 0

  while (true) {
    setPixel(context, x, y, ...color)
    if (x === x2) {
      return
    }

    x += 1
    err += dy / dx
    if (err >= 0.5) {
      y -= 1
      err -= 1
    }
  }
}

// Bresenham algorithm version 2.
const lineBres2 = (context, x1, y1, x2, y2, color = [0, 0, 0]) => {
  let x = x1
  let y = y1
  const dx = x2 - x1
  const dy = y1 - y2
  let err = 0

  while (true) {
    setPixel(context, x, y, ...color)
    if (x === x2) {
      return
    }

    x += 1
    // Note how this is "multiplying 2 * dx to both sides" when
    // compared to Bresenham 1.
    err += 2 * dy
    if (err >= dx) {
      y -= 1
      err -= 2 * dx
    }
  }
}

// Bresenham algorithm version 3.
const lineBres3 = (context, x1, y1, x2, y2, color = [0, 0, 0]) => {
  let x = x1
  let y = y1
  const dx = x2 - x1
  const dy = y1 - y2
  let err = 0

  while (true) {
    setPixel(context, x, y, ...color)
    if (x === x2) {
      return
    }

    x += 1
    // This one does the comparison first, then adjusts err
    // based on that comparison.
    if (err >= dx - 2 * dy) {
      y -= 1
      err += 2 * dy - 2 * dx
    } else {
      err += 2 * dy
    }
  }
}

// The final, optimized Bresenham algorithm: here, we presave
// most values, and adjust them to compare only to zero.
const lineBresenham = (context, x1, y1, x2, y2, color = [0, 0, 0]) => {
  let x = x1
  let y = y1
  const dx = x2 - x1
  const dy = y1 - y2
  const k1 = dy << 1 // dy divided by 2.
  let err = k1 - dx
  const k2 = (dy - dx) << 1 // dy - dx divided by 2.

  while (true) {
    setPixel(context, x, y, ...color)
    if (x === x2) {
      return
    }

    x += 1
    if (err < 0) {
      err += k1
    } else {
      y -= 1
      err += k2
    }
  }
}

/*
 * Time for the circles.  First, we observe that it is sufficient
 * to compute one-eighth of a circle: the other seven portions are
 * permutations of that eighth's coordinates.  So we define a helper
 * function that all of the circle implementations will use...
 */
const plotCirclePoints = (context, xc, yc, x, y, r, leftColor = [70, 70, 70], rightColor = [0, 0, 0]) => {
  setPixel(context, xc + x, yc + y, ...calcColor(xc + x, xc, r, leftColor, rightColor))
  setPixel(context, xc + x, yc - y, ...calcColor(xc + x, xc, r, leftColor, rightColor))
  setPixel(context, xc + y, yc + x, ...calcColor(xc + y, xc, r, leftColor, rightColor))
  setPixel(context, xc + y, yc - x, ...calcColor(xc + y, xc, r, leftColor, rightColor))
  setPixel(context, xc - x, yc + y, ...calcColor(xc - x, xc, r, leftColor, rightColor))
  setPixel(context, xc - x, yc - y, ...calcColor(xc - x, xc, r, leftColor, rightColor))
  setPixel(context, xc - y, yc + x, ...calcColor(xc - y, xc, r, leftColor, rightColor))
  setPixel(context, xc - y, yc - x, ...calcColor(xc - y, xc, r, leftColor, rightColor))
}

const calcColor = (pixelPosition, xc, r, leftColor, rightColor) => {
  let vDelta = [
    (rightColor[0] - leftColor[0]) / (r * 2),
    (rightColor[1] - leftColor[1]) / (r * 2),
    (rightColor[2] - leftColor[2]) / (r * 2)
  ]

  return [
    leftColor[0] + vDelta[0] * Math.abs(xc - r - pixelPosition),
    leftColor[1] + vDelta[1] * Math.abs(xc - r - pixelPosition),
    leftColor[2] + vDelta[2] * Math.abs(xc - r - pixelPosition)
  ]
}

// First, the most naive possible implementation: circle by trigonometry.
const circleTrig = (context, xc, yc, r, leftColor, rightColor) => {
  const theta = 1 / r
  // const vDelta = [
  //   (rightColor[0] - leftColor[0]) / (r * 2),
  //   (rightColor[1] - leftColor[1]) / (r * 2),
  //   (rightColor[2] - leftColor[2]) / (r * 2)
  // ]

  // At the very least, we compute our sine and cosine just once.
  const s = Math.sin(theta)
  const c = Math.cos(theta)

  // We compute the first octant, from zero to pi/4.
  let x = r
  let y = 0

  let curr = 0

  while (x >= y) {
    while (curr <= x) {
      plotCirclePoints(context, xc, yc, curr, y, r, leftColor, rightColor)
      curr++
    }
    x = x * c - y * s
    y = x * s + y * c

    curr = y
  }
}

// Now DDA.
const circleDDA = (context, xc, yc, r, leftColor, rightColor) => {
  const epsilon = 1 / r
  let x = r
  let y = 0

  let curr = 0

  while (x >= y) {
    while (curr <= x) {
      plotCirclePoints(context, xc, yc, curr, y, r, leftColor, rightColor)
      curr++
    }
    x = x - epsilon * y
    y = y + epsilon * x
    curr = y
  }
}

// One of three Bresenham-like approaches.
const circleBres1 = (context, xc, yc, r, leftColor, rightColor) => {
  let p = 3 - 2 * r
  let x = 0
  let y = r

  let curr = 0

  while (x < y) {
    while (curr <= y) {
      plotCirclePoints(context, xc, yc, x, curr, r, leftColor, rightColor)
      curr++
    }
    if (p < 0) {
      p = p + 4 * x + 6
    } else {
      p = p + 4 * (x - y) + 10
      y -= 1
    }
    x += 1
    curr = 0
  }

  if (x === y) {
    plotCirclePoints(context, xc, yc, x, y, r, leftColor, rightColor)
  }
}

// And another...
const circleBres2 = (context, xc, yc, r, leftColor, rightColor) => {
  let x = 0
  let y = r
  let e = 1 - r
  let u = 1
  let v = e - r

  let curr = 0

  while (x <= y) {
    while (curr <= y) {
      plotCirclePoints(context, xc, yc, x, curr, r, leftColor, rightColor)
      curr++
    }
    if (e < 0) {
      x += 1
      u += 2
      v += 2
      e += u
    } else {
      x += 1
      y -= 1
      u += 2
      v += 4
      e += v
    }
    curr = 0
  }
}

// Last but not least...
const circleBres3 = (context, xc, yc, r, leftColor, rightColor) => {
  let x = r
  let y = 0
  let e = 0

  let curr = 0

  while (y <= x) {
    while (curr <= x) {
      plotCirclePoints(context, xc, yc, curr, y, r, leftColor, rightColor)
      curr++
    }
    y += 1
    e += 2 * y - 1
    if (e > x) {
      x -= 1
      e -= 2 * x + 1
    }
    curr = 0
  }
}

/*
 * Now, the big one: a general polygon-filling algorithm.
 * We expect the polygon to be an array of objects with x
 * and y properties.
 */

// For starters, we need an Edge helper object.
const Edge = class {
  constructor(p1, p2) {
    this.color1 = p1.color
    this.color2 = p2.color
    this.maxY = Math.max(p1.y, p2.y)
    this.minY = Math.min(p1.y, p2.y)
    this.horizontal = p1.y === p2.y
    if (!this.horizontal) {
      this.inverseSlope = (p2.x - p1.x) / (p2.y - p1.y)
      this.vDelta = [
        (this.color2.r - this.color1.r) / (this.maxY - this.minY),
        (this.color2.g - this.color1.g) / (this.maxY - this.minY),
        (this.color2.b - this.color1.b) / (this.maxY - this.minY)
      ]
    }

    // The initial x coordinate is the x coordinate of the
    // point with the lower y value.
    this.currentX = p1.y === this.minY ? p1.x : p2.x
  }
}

// Now to the function itself.
const fillPolygon = (context, polygon, color = [0, 0, 0]) => {
  /*
   * A useful helper function: this "snaps" a given y coordinate
   * to its nearest scan line.
   */
  const toScanLine = y => Math.ceil(y)

  /*
   * We will need to sort edges by x coordinate.
   */
  const xComparator = (edge1, edge2) => edge1.currentX - edge2.currentX

  /*
   * We will need to do "array difference:" return an array whose
   * elements are in the first array but not in the second.
   */
  const arrayDifference = (array1, array2) => array1.filter(element => array2.indexOf(element) < 0)

  /*
   * An important helper function: this moves the edges whose
   * minimum y match the given scan line from the source
   * list to the destination. We assume that the source list
   * is sorted by minimum y.
   */
  const moveMatchingMinYs = (src, dest, targetY) => {
    for (let i = 0, max = src.length; i < max; i += 1) {
      if (toScanLine(src[i].minY) === targetY) {
        dest.push(src[i])
      } else if (toScanLine(src[i].minY) > targetY) {
        // We can bail immediately because the global edge list is sorted.
        break
      }
    }

    // Eliminate the moved edges from the source array; this is
    // the function's result.
    return arrayDifference(src, dest)
  }

  const calcEdgeColor = (edge, y) => {
    return {
      r: edge.color1.r + y * edge.vDelta[0],
      g: edge.color1.g + y * edge.vDelta[1],
      b: edge.color1.b + y * edge.vDelta[2]
    }
  }

  /*
   * Due to the relative complexity of this algorithm, we "pre-declare" variables here
   * so that we can easily attach comments that explain their role in the fill.
   */
  let globalEdgeList = [] // List of all edges.
  let activeEdgeList = [] // List of all edges currently being scanned.
  let anEdge // Temporary edge holder.
  let currentScanLine // The scan line that is being drawn.
  let drawPixel // Whether we are supposed to plot something.
  let fromX // The starting x coordinate of the current scan line.
  let fromColor // The starting color of the current scan line.
  let toX // The ending x coordinate of the current scan line.
  let toColor // The ending color of the current scan line.
  let edgesToRemove // For use when, well, removing edges from a list.

  // Create the global edge list.
  for (let i = 0, max = polygon.length; i < max; i += 1) {
    // If we are at the last vertex, we go back to the first one.
    anEdge = new Edge(polygon[i], polygon[(i + 1) % polygon.length])

    // We skip horizontal edges; they get drawn "automatically."
    if (!anEdge.horizontal) {
      globalEdgeList.push(anEdge)
    }
  }

  // Sort the list from top to bottom.
  globalEdgeList.sort((edge1, edge2) =>
    edge1.minY !== edge2.minY
      ? edge1.minY - edge2.minY
      : // If the minimum y's are the same, then the edge with the
        // smaller x value goes first.
        edge1.currentX - edge2.currentX
  )

  // We start at the lowest y coordinate.
  currentScanLine = toScanLine(globalEdgeList[0].minY)

  // Initialize the active edge list.
  globalEdgeList = moveMatchingMinYs(globalEdgeList, activeEdgeList, currentScanLine)

  // Start scanning!
  drawPixel = false
  while (activeEdgeList.length) {
    fromX = Number.MAX_VALUE
    for (let i = 0, max = activeEdgeList.length; i < max; i += 1) {
      // If we're drawing pixels, we draw until we reach the x
      // coordinate of this edge. Otherwise, we just remember where we
      // are then move on.
      if (drawPixel) {
        toX = toScanLine(activeEdgeList[i].currentX)
        toColor = calcEdgeColor(activeEdgeList[i], Math.abs(currentScanLine - activeEdgeList[i].minY))
        //console.log(toColor)

        let edgeHDelta = [
          (toColor.r - fromColor.r) / (toX - fromX),
          (toColor.g - fromColor.g) / (toX - fromX),
          (toColor.b - fromColor.b) / (toX - fromX)
        ]

        // No cheating here --- draw each pixel, one by one.
        for (let x = fromX; x <= toX; x += 1) {
          let pixelColor = [
            fromColor.r + edgeHDelta[0] * (x - fromX),
            fromColor.g + edgeHDelta[1] * (x - fromX),
            fromColor.b + edgeHDelta[2] * (x - fromX)
          ]
          // console.log(pixelColor)
          setPixel(context, x, currentScanLine, ...pixelColor)
        }
      } else {
        fromX = toScanLine(activeEdgeList[i].currentX)
        fromColor = calcEdgeColor(activeEdgeList[i], Math.abs(currentScanLine - activeEdgeList[i].minY))
        //console.log(fromColor)
      }

      drawPixel = !drawPixel
    }

    // If we get out of this loop and drawPixel is true, then we
    // encountered an odd number of edges, and need to draw a single
    // pixel.
    if (drawPixel) {
      setPixel(context, fromX, currentScanLine, ...color)
      drawPixel = !drawPixel
    }

    // Go to the next scan line.
    currentScanLine += 1

    // Remove edges for which we have reached the maximum y.
    edgesToRemove = []
    for (let i = 0, max = activeEdgeList.length; i < max; i += 1) {
      if (toScanLine(activeEdgeList[i].maxY) === currentScanLine) {
        edgesToRemove.push(activeEdgeList[i])
      }
    }
    activeEdgeList = arrayDifference(activeEdgeList, edgesToRemove)

    // Add edges for which we have reached the minimum y.
    globalEdgeList = moveMatchingMinYs(globalEdgeList, activeEdgeList, currentScanLine)

    // Update the x coordinates of the active edges.
    for (let i = 0, max = activeEdgeList.length; i < max; i += 1) {
      activeEdgeList[i].currentX += activeEdgeList[i].inverseSlope
    }

    // Re-sort the edge list.
    activeEdgeList.sort(xComparator)
  }
}

export {
  setPixel,
  fillRect,
  lineDDA,
  lineBres1,
  lineBres2,
  lineBres3,
  lineBresenham,
  circleTrig,
  circleDDA,
  circleBres1,
  circleBres2,
  circleBres3,
  fillPolygon
}
