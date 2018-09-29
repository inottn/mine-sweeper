import { context as ctx } from '../info/display'

export function drawRectByCenter(x, y, w, h = w) {
  ctx.fillRect(x - w / 2, y - h / 2, w, h)
}

export function drawRoundedRect(x, y, w, h, r) {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.fill()
  ctx.restore()
}

export function drawRoundedRectByCenter(x, y, w, h, r) {
  x = x - w / 2
  y = y - h / 2

  drawRoundedRect(x, y, w, h, r)
}

export function scaleByCenter(x, y, scaleX, scaleY = scaleX) {
  ctx.translate(x * (1 - scaleX), y * (1 - scaleY))
  ctx.scale(scaleX, scaleY)
}
