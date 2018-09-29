import { isStorageSupported } from '../util/utils'

export const game = {
  isOver: false,
  isVictory: false
}

export const status = {
  game,
  imgsLoad: false,
  storageSupportedFlag: isStorageSupported()
}