import { status } from './info/status'
import { Game } from './game/game'
import { sceneMain } from './info/scene'

const __main = function() {
  if (!status.storageSupportedFlag) {
    alert('您的浏览器版本过低或开启无痕模式，部分功能无法实现')
  }

  const game = Game.instance(sceneMain)
  game.__start()
}

__main()
