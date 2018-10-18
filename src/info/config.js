export const canvas = {
  get canvasWidth() {
    return game.width
  },
  get canvasHeight() {
    return game.height
  }
}

export const game = {
  get width() {
    return minefield.width + minefield.marginLeft * 2
  },
  get height() {
    return minefield.height + minefield.marginTop * 1.2
  },
  panelHeight: 30
}

export const face = {
  width: 30,
  height: 30
}

export const minefield = {
  get width() {
    return (
      this.xCellsCount * (cell.inactiveLength + this.gapLength) + this.gapLength
    )
  },
  get height() {
    return (
      this.yCellsCount * (cell.inactiveLength + this.gapLength) + this.gapLength
    )
  },
  marginTop: 50,
  marginLeft: 16,
  gapLength: 8,
  bgColor: '#FFFFFF',
  minesCount: 40,
  xCellsCount: 24,
  yCellsCount: 12
}

export const cell = {
  inactiveLength: 20,
  activeLength: 22,
  inactiveBgColor: '#DEDEDE',
  activeBgColor: '#654',
  textColor: '#FFFFFF'
}

export const config = {
  canvas
}
