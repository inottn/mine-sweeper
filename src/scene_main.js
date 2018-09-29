import { Scene } from './game/scene'
import { context as ctx, canvas } from './info/display'
import { Minefield } from './minefield'
import { Face } from './face'
import { game as gameInfo } from './info/config'
import { drawRoundedRect, drawRoundedRectByCenter } from './util/draw'
import { game as gameStatus } from './info/status'

export const minefield = new Minefield()
export const face = new Face()

export class SceneMain extends Scene {
  constructor() {
    super()

    this.width = gameInfo.width
    this.height = gameInfo.height
    this.event = {}
  }

  addEvent(type, event) {
    if (!this.event[type]) this.event[type] = []
    this.event[type].push(event)
  }

  removeEvent(type, event) {
    const index = this.event[type].indexOf(event)

    this.event[type].splice(index, 1)
  }

  handleEvent() {
    const clickEvent = e => {
      this.minefield.registerClickEvent(e)
      this.face.registerClickEvent(e)
      this.calculateresidualMinesCount()
    }
    const contextmenuEvent = e => {
      e.preventDefault()
      this.minefield.registerContextmenuEvent(e)
      this.calculateresidualMinesCount()
    }
    const mousedownEvent = e => {
      this.minefield.registerMousedownEvent(e)
      this.face.registerMousedownEvent(e)
    }

    this.addEvent('click', clickEvent)
    this.addEvent('contextmenu', contextmenuEvent)
    this.addEvent('mousedown', mousedownEvent)
  }

  registerEvent() {
    for (const type in this.event) {
      if (this.event.hasOwnProperty(type)) {
        const events = this.event[type]

        for (const event of events) {
          canvas.addEventListener(type, event, false)
        }
      }
    }
  }

  removeAllEvents() {
    for (const type in this.event) {
      if (this.event.hasOwnProperty(type)) {
        const events = this.event[type]

        for (const event of events) {
          canvas.removeEventListener(type, event, false)
        }
      }
    }
  }

  init() {
    this.minefield = minefield
    this.face = face
    this.initTimeStamp = Date.now()
    this.handleEvent()
    this.registerEvent()
    this.initStatus = true
  }

  initNewGame() {
    this.minefield.rebuild()
    this.face.changeStatus('smile')
    this.initTimeStamp = Date.now()
    gameStatus.isOver = false
    gameStatus.isVictory = false
  }

  calculateresidualMinesCount() {
    this.minefield.residualMinesCount =
      this.minefield.minesCount - this.minefield.getHasFlagCellsCount()
  }

  calculateGameTime() {
    let time = Date.now() - this.initTimeStamp
    let second = Math.floor(time / 1000)
    let minute = Math.floor(second / 60)

    this.time = `${minute} : ${
      second - minute * 60 < 10
        ? '0' + (second - minute * 60)
        : second - minute * 60
    }`
  }

  update() {
    if (!gameStatus.isOver && !gameStatus.isVictory) {
      this.calculateGameTime()
    }
  }

  draw() {
    super.draw()

    ctx.fillStyle = '#DEDEDE'
    drawRoundedRect(0, 0, this.width, this.height, 10)

    ctx.fillStyle = '#FFFFFF'

    drawRoundedRect(4, 4, this.width - 8, this.height - 8, 8)

    ctx.fillStyle = '#DEDEDE'
    drawRoundedRectByCenter(this.width / 2, 30, this.width - 28, 40, 6)

    ctx.fillStyle = '#FFFFFF'
    drawRoundedRectByCenter(this.width / 2, 30, this.width - 32, 36, 4)

    ctx.font = '800 20px sans-serif'
    ctx.fillStyle = '#646464'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillText(this.minefield.residualMinesCount + '', 50, 30)
    ctx.textAlign = 'right'
    ctx.fillText(this.time, this.width - 50, 30)

    this.face.draw()
    this.minefield.draw()
  }
}
