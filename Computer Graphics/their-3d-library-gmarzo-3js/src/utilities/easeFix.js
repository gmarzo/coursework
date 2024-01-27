/**
 * Some TweenJS Ease functions aren’t built correctly. These functions address some of them.
 * This also shows that you can write your own easing functions; you aren’t bound to Ease.
 */
import { Ease } from '@createjs/tweenjs'

const bounceIn = t => 1 - Ease.bounceOut(1 - t)
const bounceInOut = t => (t < 0.5 ? bounceIn(t * 2) * 0.5 : Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5)

export { bounceIn, bounceInOut }
