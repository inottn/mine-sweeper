import { imgs } from "./game/imgs_loader";
import { context as ctx } from './info/display'
import { face, game } from "./info/config";
import { sceneMain } from "./info/scene";

export class Face {
  constructor() {
    this.status = 'smile'
    this.offsetX = (game.width - face.width) / 2
    this.offsetY = face.height / 2
    this.width = face.width
    this.height = face.height
  }

  changeStatus(status) {
    this.status = status
  }

  detectToClickFace(clickX, clickY) {
    if (
      clickX >= this.offsetX && 
      clickX <= this.offsetX + this.width &&
      clickY >= this.offsetY && 
      clickY <= this.offsetY + this.height
    ) return true

    return false
  }

  click() {
    sceneMain.initNewGame()
  }

  registerClickEvent(e) {
    if (this.detectToClickFace(e.offsetX, e.offsetY)) {
      this.click()
    }
  }

  registerMousedownEvent(e) {
    if (this.detectToClickFace(e.offsetX, e.offsetY)) {
      this.changeStatus('click')
    }
  }

  draw() {
    ctx.drawImage(imgs.imgByName(this.status), this.offsetX, this.offsetY, this.width, this.height)
  }
}