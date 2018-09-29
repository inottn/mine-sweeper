import { minefield, cell } from './info/config'
import { randomBetweenNumbers } from './util/utils'
import { context as ctx } from './info/display'
import { Cell } from './cell'
import { face } from './scene_main'

export class Minefield {
  constructor() {
    this.width = minefield.width
    this.height = minefield.height
    this.marginTop = minefield.marginTop
    this.marginLeft = minefield.marginLeft
    this.xCellsCount = minefield.xCellsCount
    this.yCellsCount = minefield.yCellsCount
    this.cellsCount = this.xCellsCount * this.yCellsCount
    this.minesCount = minefield.minesCount
    this.residualMinesCount = this.minesCount
    this.bgColor = minefield.bgColor

    this.init()
  }

  init() {
    this.initCells()
    this.initMines()
    this.initSurroundingMineCount()
  }

  initCells() {
    this.cells = []

    for (let x = 0; x < this.xCellsCount; x++) {
      for (let y = 0; y < this.yCellsCount; y++) {
        const cell = new Cell(x + 1, y + 1)
        this.cells.push(cell)
      }
    }
  }

  initMines() {
    for (let i = 0; i < this.minesCount; i++) {
      let x = randomBetweenNumbers(1, this.xCellsCount + 1, true)
      let y = randomBetweenNumbers(1, this.yCellsCount + 1, true)

      if (!this.detectCellHasMine(x, y)) {
        this.setMine(x, y)
      } else {
        i--
      }
    }
  }

  detectCellHasMine(x, y) {
    return this.getCell(x, y).hasMine
  }

  setMine(x, y) {
    const cell = this.getCell(x, y)
    cell && (cell.hasMine = true)
  }

  getCell(x, y) {
    if (x < 1 || x > this.xCellsCount || y < 1 || y > this.yCellsCount)
      return false
    const cell = this.cells[(x - 1) * this.yCellsCount + y - 1]
    if (!cell) return false
    return cell
  }

  initSurroundingMineCount() {
    for (let x = 1; x <= this.xCellsCount; x++) {
      for (let y = 1; y <= this.yCellsCount; y++) {
        if (this.detectCellHasMine(x, y)) {
          const cells = Object.values(this.getSurroundingCells(x, y))

          cells.forEach(cell => {
            cell && cell.surroundingMineCount++
          })
        }
      }
    }
  }

  getSurroundingCells(x, y) {
    return {
      leftCell: this.getCell(x - 1, y),
      rightCell: this.getCell(x + 1, y),
      upCell: this.getCell(x, y - 1),
      downCell: this.getCell(x, y + 1),
      upLeftCell: this.getCell(x - 1, y - 1),
      downLeftCell: this.getCell(x - 1, y + 1),
      upRightCell: this.getCell(x + 1, y - 1),
      downRightCell: this.getCell(x + 1, y + 1)
    }
  }

  getHasMineCells() {
    return this.cells.filter(cell => {
      return cell.hasMine
    })
  }

  getHasFlagCellsCount() {
    return this.cells.filter(cell => {
      return cell.hasFlag
    }).length
  }

  getActivedCellsCount() {
    return this.cells.filter(cell => {
      return cell.isActive && !cell.hasMine
    }).length
  }

  activeSurroundingCells(cell) {
    const cells = Object.values(this.getSurroundingCells(cell.x, cell.y))

    cells.forEach(cell => {
      cell && !cell.hasFlag && !cell.detectCellIsActive() && cell.active()
    })
  }

  rebuild() {
    this.residualMinesCount = this.minesCount

    this.resetCellsStatus()
    this.initMines()
    this.initSurroundingMineCount()
  }

  resetCellsStatus() {
    this.cells.forEach(cell => {
      cell.resetCellStatus()
    })
  }

  registerClickEvent(e) {
    const cell = this.returnClickedCell(
      e.offsetX - this.marginLeft,
      e.offsetY - this.marginTop
    )

    cell && cell.click()
  }

  registerContextmenuEvent(e) {
    const cell = this.returnClickedCell(
      e.offsetX - this.marginLeft,
      e.offsetY - this.marginTop
    )

    cell && cell.contextmenu()
  }

  registerMousedownEvent(e) {
    const cell = this.returnClickedCell(
      e.offsetX - this.marginLeft,
      e.offsetY - this.marginTop
    )

    cell && cell.mousedown()
  }

  returnClickedCell(clickX, clickY) {
    let x = Math.ceil(clickX / (cell.inactiveLength + minefield.gapLength))

    let y = Math.ceil(clickY / (cell.inactiveLength + minefield.gapLength))

    console.log(x, y)

    return this.getCell(x, y)
  }

  draw() {
    ctx.save()
    ctx.translate(this.marginLeft, this.marginTop)
    ctx.fillStyle = this.bgColor
    ctx.fillRect(0, 0, this.width, this.height)
    this.cells.forEach(cell => {
      cell.draw()
    })
    ctx.restore()
  }
}
