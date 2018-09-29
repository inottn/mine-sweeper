import { context as ctx } from '../info/display'
import { canvas as canvasInfo } from '../info/config';

export class Scene {
  constructor() {
    this.redirect = false
    this.afterScene = null
    this.initStatus = false
  }

  update() {}
  
  draw() {
    ctx.clearRect(0, 0, canvasInfo.canvasWidth, canvasInfo.canvasHeight)
  }
}
