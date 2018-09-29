import { imgsInfo } from "../info/imgs_info";
import { status } from "../info/status";

export class ImgsLoader {
  constructor(imgsInfo) {
    this.imgs = this.handleImgsInfo(imgsInfo)
  }

  static imgByUrl(url) {
    const img = new Image()
    img.src = url
    return img
  }

  handleImgsInfo(imgsInfo) {
    const o = {}
    let n = 0
    let l = Object.keys(imgsInfo).length
    for (let key in imgsInfo) {
      if (imgsInfo.hasOwnProperty(key)) {
        let imgPath = imgsInfo[key]
        const img = new Image()
        img.src = imgPath
        img.onload = () => {
          n += 1
          if (n === l) {
            status.imgsLoad = true
          }
        }
        o[key] = img
      }
    }
    return o
  }

  imgByName(name) {
    return this.imgs[name]
  }
}

export const imgs = new ImgsLoader(imgsInfo)
