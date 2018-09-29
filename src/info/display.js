import { CANVAS_ID } from './constant'

export const canvas = document.querySelector('#' + CANVAS_ID)

export const context = canvas.getContext('2d')

export const getCanvasOffset = function() {
  const boundRect = canvas.getBoundingClientRect()
  return [boundRect.left, boundRect.top]
}
