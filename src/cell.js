import { context as ctx } from './info/display'
import { imgs } from './game/imgs_loader'
import { cell as cellInfo, minefield as minefieldInfo } from './info/config'
import { game } from './info/status'
import { minefield, face } from './scene_main'

export class Cell {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.isActive = false
    this.hasFlag = false
    this.hasMine = false
    this.firstBoom = false
    this.surroundingMineCount = 0
    this.activeLength = cellInfo.activeLength
    this.inactiveLength = cellInfo.inactiveLength
    this.textColor = cellInfo.textColor
    this.activeBgColor = cellInfo.activeBgColor
    this.inactiveBgColor = cellInfo.inactiveBgColor
    this.offsetX =
      this.x * minefieldInfo.gapLength + (this.x - 1) * this.inactiveLength
    this.offsetY =
      this.y * minefieldInfo.gapLength + (this.y - 1) * this.inactiveLength
  }

  resetCellStatus() {
    this.isActive = false
    this.hasFlag = false
    this.hasMine = false
    this.surroundingMineCount = 0
  }

  surroundingHasMine() {
    return this.surroundingMineCount !== 0
  }

  detectCellIsActive() {
    return this.isActive
  }

  active() {
    this.isActive = true
    this.hasFlag = false

    if (this.hasMine) {
      minefield.getHasMineCells().forEach(cell => {
        cell.isActive = true
        this.hasFlag = false
      })
      this.firstBoom = true
      game.isOver = true
      face.changeStatus('defeat')
    } else if (!this.surroundingHasMine()) {
      minefield.activeSurroundingCells(this)
    }

    if (
      minefield.getActivedCellsCount() ===
      minefield.cellsCount - minefield.minesCount
    ) {
      minefield.getHasMineCells().forEach(cell => {
        cell.hasFlag = true
      })
      game.isVictory = true
      face.changeStatus('victory')
    }
  }

  click() {
    if (game.isOver || game.isVictory || this.hasFlag) return

    if (this.isActive) {
      if (this.surroundingHasMine()) {
        const cells = Object.values(
          minefield.getSurroundingCells(this.x, this.y)
        )

        const count = cells.filter(cell => {
          return cell && cell.hasFlag
        }).length

        if (count === this.surroundingMineCount) {
          cells
            .filter(cell => {
              return cell && !cell.isActive && !cell.hasFlag
            })
            .forEach(cell => {
              cell.active()
            })
        }
      }
    } else {
      this.active()
    }

    if (this.residualMinesCount < this.minesCount * 0.3)
      face.changeStatus('happy')
    else face.changeStatus('smile')
  }

  contextmenu() {
    if (!this.hasFlag && minefield.residualMinesCount === 0) return

    if (!this.detectCellIsActive() && !game.isOver && !game.isVictory)
      this.hasFlag = !this.hasFlag
  }

  mousedown() {
    if (game.isOver || game.isVictory || this.hasFlag) return
    face.changeStatus('click')
  }

  draw() {
    if (this.detectCellIsActive()) {
      if (this.hasMine) {
        if (this.firstBoom) {
          ctx.drawImage(
            imgs.imgByName('boom'),
            this.offsetX,
            this.offsetY,
            this.activeLength,
            this.activeLength
          )
        } else if (
          (game.isOver || game.isOver) &&
          this.hasFlag &&
          this.hasMine
        ) {
          ctx.drawImage(
            imgs.imgByName('true'),
            this.offsetX,
            this.offsetY,
            this.activeLength,
            this.activeLength
          )
        } else {
          ctx.drawImage(
            imgs.imgByName('mine'),
            this.offsetX,
            this.offsetY,
            this.activeLength,
            this.activeLength
          )
        }
      } else if (!this.surroundingHasMine()) {
        ctx.fillStyle = this.activeBgColor
        ctx.fillRect(
          this.offsetX,
          this.offsetY,
          this.activeLength,
          this.activeLength
        )
      } else {
        ctx.fillStyle = this.activeBgColor
        ctx.fillRect(
          this.offsetX,
          this.offsetY,
          this.activeLength,
          this.activeLength
        )
        ctx.font = '800 12px sans-serif'
        ctx.font = '900 12px Arial'
        ctx.fillStyle = this.textColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(
          this.surroundingMineCount + '',
          this.offsetX + this.activeLength / 2,
          this.offsetY + this.activeLength / 2
        )
      }
    } else {
      if (this.hasFlag) {
        ctx.drawImage(
          imgs.imgByName('flag'),
          this.offsetX,
          this.offsetY,
          this.inactiveLength,
          this.inactiveLength
        )
      } else {
        ctx.fillStyle = this.inactiveBgColor
        ctx.fillRect(
          this.offsetX,
          this.offsetY,
          this.inactiveLength,
          this.inactiveLength
        )
      }
    }
  }
}
