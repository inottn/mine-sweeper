(function () {
  'use strict';

  /**
   * 获取取值范围是 [start, end) 的左闭右开区间的随机数, 默认不向下取整
   * @param  {number} start - 起始数
   * @param  {number} end - 结束数（不包含）
   * @param  {boolean} [floor=false] - 是否向下取整
   * @returns {number}
   */
  function randomBetweenNumbers(start, end, floor = false) {
    let t = Math.random() * (end - start) + start;
    if (floor) return Math.floor(t)
    return t
  }

  function isStorageSupported() {
    const testKey = 'test';
    const storage = window.localStorage;

    try {
      storage.setItem(testKey, 'testValue');
      storage.removeItem(testKey);
      return true
    } catch (error) {
      return false
    }
  }

  const game = {
    isOver: false,
    isVictory: false
  };

  const status = {
    game,
    imgsLoad: false,
    storageSupportedFlag: isStorageSupported()
  };

  const CANVAS_ID = 'in-canvas';

  const canvas = document.querySelector('#' + CANVAS_ID);

  const context = canvas.getContext('2d');

  const canvas$1 = {
    get canvasWidth() {
      return game$1.width
    },
    get canvasHeight() {
      return game$1.height
    }
  };

  const game$1 = {
    get width() {
      return minefield.width + minefield.marginLeft * 2
    },
    get height() {
      return minefield.height + minefield.marginTop * 1.2
    },
    panelHeight: 30
  };

  const face = {
    width: 30,
    height: 30
  };

  const minefield = {
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
    minesCount: 10,
    xCellsCount: 24,
    yCellsCount: 12
  };

  const cell = {
    inactiveLength: 20,
    activeLength: 22,
    inactiveBgColor: '#DEDEDE',
    activeBgColor: '#654',
    textColor: '#FFFFFF'
  };

  class Game {
    constructor(scene) {
      this.currentScene = scene;
      this.init();
    }

    static instance(...args) {
      this.i = this.i || new this(...args);
      return this.i
    }

    init() {
      canvas.width = canvas$1.canvasWidth;
      canvas.height = canvas$1.canvasHeight;
    }

    replaceScene(scene) {
      this.currentScene = scene;
    }

    __start() {
      requestAnimationFrame(() => {
        this.currentScene.initStatus || this.currentScene.init();
        this.currentScene.update();
        this.currentScene.draw();
        if (this.currentScene.redirect) {
          this.replaceScene(this.currentScene.afterScene);
        }
        this.__start();
      });
    }
  }

  class Scene {
    constructor() {
      this.redirect = false;
      this.afterScene = null;
      this.initStatus = false;
    }

    update() {}
    
    draw() {
      context.clearRect(0, 0, canvas$1.canvasWidth, canvas$1.canvasHeight);
    }
  }

  const imgsInfo = {
    smile:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAA5FBMVEVHcEzpiQDqhgDohQDogwDqkADoiQDogwDoigDsjQDngQDqiwDnfgDqiQDohwDriQD/fwDoiwDpigDpigDoiwDoigD/4TP2oyL/4DP+3DH4piP/7jr4pyj/5DLtkgP+2TH+zi0CCSIAACD7yCr+1S/80in/7zL/6zj5vin/5zT/+TX/9TTrjQD4tCbwoQ3zrhMQFSPwmAwjJCOqlCv0nhr0thf/8Tz//zXiyDDphwBYTib+vSgsKiSIdSlsXij3vR7/rCP/tSSVdCY8NyXw2TKyoS67nCvhmiTwpCTHtS/prSdyZykHr9ovAAAAFnRSTlMA+XfZnyVouFEN5EvN6apbBMsYMJ1EXdQpHQAAAm9JREFUeNqllGl3ojAUQN0qbrXVdjCAiQIGZBkQUYq4TV26/v//MyEJrZUu58zcD/iSXOC9BF/hX6nf1KqlUrV2U/9Wu6hWWpdF1y1etirViy+1q9Yi8Lc6JuhbP1gIV19oyMdQIZhmehWx77Zq+dzai7kUKZb4hqUokr+oXJ8lV0Y4MsUzzAijVveD1/CsSATnIhAj6DVOzHrDM02q5VTF8srvbxcCK/PyJkTtzKstsJJ5eTPCi19cbMwjnpLhQMDXoWPwpCO/zB+IJBPQNfsQOywHYDrxwYaAhgO3yTL0FZFiH6eTtWHRTTTWk+nRZvOKL9CSizoTnXiiTrTwLo3vQo0MYofVoxfr7M2WyBenU21jQ1GE9obE/CbRklD67pJnwRPxlT3x9USEllciYsXnR2ccVpqmPts03WdV01YHgx+lX0lrmfNagB0n+6OdFbZPYhvwaubCBxE4jkG3hG6V4TggL3LgyWfGM8+LeU5FVgz4AVZMyROBxKFBbgBEuj1NhMGAMoKOY0kslkgMRywGGDXpEW7BiALDJIyhQYHxwyaEbB5syRESBG8wpBhrTV0l6/DhIVwnK1VbG2x+4AnsM3PHQz1lONpoKmEySa/aZsSnx26Tf7iePqYM8W6aeqk53eEhm9W9coHRdOXlb8oSv+yS/Wq1T3YvOJuTyV+B00ZyX2bcL++fHh+fyA8bkwVUKWRcN5As9zjyH8LbiHjl0wZwSZ7Z+4R+DzW6Zy1l1u/ntP4MdbrnTcoNyIL8bsnkxsC9vS6cUyujYEbcjN4sQJ3m5x1ScFEQzChBgFyh9l1r7rDW3LmtXvxXs/+Zv8T6h/w4r6osAAAAAElFTkSuQmCC',
    happy:
      'data:image/png;base64,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',
    click:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAABqlBMVEVHcEztjQDphwDpiADpiwDrjADqjQDqigDsjQDpjADsjADqjADpiwDohQDphQDqiwDpigDqjADqjADogwDohADqiAD/rADohQDqiQDphQDphgDohADqjADqjADojAD/qgDqjQDoiADpiQDogwDrjQDpjADijQDohgDpiwD/fwDphwDphgD/4TP+4DP2oyP+3zL+3DL91DD8zi792jH/6jj8xyz6vyr3qCT/5DP2oiL3pSbtkgMAAiH4tSf/7DnrjgD/5jT/+TX/9jTwow70nhr/6zT/7jMIDSL/6Df+2S4lJCT0tRcDCSL4pijwmA/umQf+3jT60CfyrBL/4jLzsBX/8jT/6DL5pCP8uSmEdyr/rSPukwnz2zL5yya9qC74xyKUhSxRRib1uhvMsS4SFSP+0Sz4tCfhyzEcHSR/bimvmyz8pyNcVCf/tSNxYShjVyf2oiD2rB/3vyDxmhT34zP43TIcHiSciiwyKyTqnCP+wyrXsSvElygzMSWikS1rYSjgxzGNYyO5fSOodiR4WSXjxzDxryf/yiuWcybsxi/1xCyhiivtuSl3ZCcArDiaAAAALHRSTlMADqeIUyb7TiojGqlXn7te2hPV2cz4Aef0sX+469DBA25n4NRzkQnD7QRrai9GPD4AAALpSURBVHjanZRnV9pgFICjIENcIIKz6lE7DRFFCyTNIBAIRnbCEgQB696jrmr3/s9NyCDODz6f3nvPc/LekQR4Kkb9m36Npv+13vio1jLabrX36nS9dmv76MNqZ0dPNLG8VIjHC0vLiWjPQOe9mtYKpwpQyCURggop2Kq/o5mbsXkaRfFJUGISR1E6hbWbb3qG7mgcdUmW4rrQeHSs5UYTdhJEJU2NGwVJu6qppm4Sd4H34sLJsSZFbI4mZe+uCUabZU+PxVHwQdA4JvVu604p9anqVFLofPewOECMFi+GAgTByh5LEAGofgrRWFtd7EuIc4Goo1L2mpW862zpiILEKSUGBK+1d0mskDvcRJDL96zoXSLI5iEnVrnU0yq0AtOheuwrBlfDTJZIgmCSyDLh1WDRBwrgM7Bwdz/pdgthkjhhwuHglY+P3OxVkD9/9CXrY8dJDQA8b0+ExAbZSrC6ipQI4UyUkONqsCIVHEo1NwGtffMuaV+BNQYpLwaEM7VYRpi1gFsa+nyHETB2yCLIccV1qVOIWlwvcpy8neUXBrUI4j5hdvJM+WJVonB16PY741YW1LhaaAYHIRVTHEv5KEgN34xZGE8MmlJBne9sZr9RqkwMJDU2YeC12IwK9gRBkHCFa2RiTritvsL9mFPFzK8/69vITpJWMrH9+gqBPtI5rYbmKjvMP7qmJJzkgPSazU3Pqqj9DiPVC1qJp+f4mwWGu8jZORVntb9rzPaPMzmeJbteyZ/CXmblncRK5vvF+U+mnMnI8R6mBSRM8NsGW1+ZKhP8sqUkYFPjc+3KO7wekXTu0/GH8udcWgy9jrylSfUDeJl3LDhE0hunp7mttEc488n8oPpXYTN0wf4Fr0OAf2Zuw1HHu+CHLaKnYDZhkV1JdcjabgTjl3ybtiE44vd4FTz+CDykBe7B1vlMB0cO/HUOIrDuWacNuBcbYBgxWQZ1GKYbtJhGDMBjGLTjmokJzbiW157Gf5Ig/eVjxfKkAAAAAElFTkSuQmCC',
    victory:
      'data:image/png;base64,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',
    defeat:
      'data:image/png;base64,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',
    true:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAB41BMVEVHcEzCIiLLNja7FxfKMDCzAgLHMTHFJCTMKSnILCy6DAy6Dw/TPz+5DQ3POzu1CgrIJCS2BQW9FBTMHBzTQkLSQkLUKiqyAgLONzexAADDJCTDIyPFIyO6ERG5FBS7Fha4Dg7NNDTVOzu4FBTONDTLNjbILi64Dw+9GhrFLCzROTm/Dg7PODjPPz+5ERHOKirJICDKMjLMNjbQPT3PPDy0Bwe7DQ21DAy7GBjYRETCGRnHLy/NLi7UQ0PWRESwAACzAAD7SEj7SkraCgr/SEjcCwvhFhbcBQX4RET3Pz/dDQ3xNjb8TEzpJib5Rkb6QUH1OzvkGxvgEhLeERHmHx/gCgr1NzfZCAj/T0//TU3kFhblEhLjKSnwLCziDw/WDw/qHR3yOTn5Ozv/RUX3QkL0PDzjGhrRDw/XGRnkHh7sIyPnIyPvMzPwSkrvMDDyLy/0MzPuJyfOAwPLFBTYODjsPz/nODj+SUnCERHGGBjyRET8QUHgOjrnGBjIEBDeDg67BQXrQ0PjDQ3jNDTpICDiRUXTLy/SICDFBQXbISHKAwPiJibqKirtLi7sLCz1TEziLS3eNjbePT3OGBjXLS3dRETZQkLUNzfnQEDNCwvVNDTnLS3VBQXMHR2+AgLrSUndLy97lcjLAAAAQXRSTlMAUM4xLzmjvRIXHb430OSM0OI9BbOWBrM8lnOYss2i1ldX9qM/stayt7fR9r2MLPf3v4whxsYT5Zzg7Jzscb1xvdD6JowAAALHSURBVHjanZH5PyJhHMdHtAqVSgq57/u+bxJTSKvarQi1ydUqdNgOlFKudd/kT93nqSlGY3/wnl++38/nPTOvZwb5ImxeLyejry+D08tj/0dL43T6Qsa/AGPI18lJ+0zLuA6N/4wxHrrOIFRrb4xKpXI8BliMN7VxGrXFN6S0DeGwKYd8LVS810zfs9kGI9gAsXGP3vzeo9D3BIOTgEGBYPIPYFIQ3ffolHci6U43BtGNWS6KqmpqqoouLGNYdEd685qcul8AicOyVVpIhQm1sHTL4pDAVOdsinpJt6gERVGJxEkqQWKUkJyScIzeJmFRo9Wh1+tRdOsbguPbFoqCwmFtxB74MKUHaM+hhzfPtbCZeog8sturXVhY0FrLkDjKrOHK2w2XzB6xQixWKPxJ8WKSXwE7cU8mWHh+hRgs3kqEgEpvuPTzwJz9alpbWzNdJRCJCVfh8jUbzDlnpt+AegqRSKmHneksB8z8s/WTk/XHdISQ9EfYnvHBmDwze3o6O5NMYOFaOB4fE4v4ln9knpgwH3326kjLh4cJmicADcSHaYCdOQgPk32wsrq6unJA/HmwEn4e1vO+TCZbCVYQiRXBFVDuP7PgL+xa3l9elsm2E+O9xG2ZbBnUXZlw61ial0ql80v58WI+VnVgt0mli4uLrsvij17xpQsUUmn0ZalLLqFQqHJt5uG9vE2XChSupVQsqLMLVdBUbeay3jRW7qYqHAvtddGM4VZ/nwaXes5eXpACk5SCcvscFroZSAyaQT0N0Uwb3NW01FRatdsAFojaQEPeaGs3eHZEgB2NRjQHEGk0kd1jaG9D3pHCvPfIR8KI5ABRZJZ77pkpCA5qa2BYPjKMY0Q+HGilIh9h7G6Mykd/xADLxi4DIYDM3T18Go3xdLjLJSPEkLOYL4HDDcBh4IWZhWmEsMn9WdyBAW5WP5mNfI1/pbX7qaPLhfoAAAAASUVORK5CYII=',
    false:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAABMlBMVEVHcEyyBwfGLi7AJSWyAwO4ExPJNDTKNze3EBDHLy/DKCjNOzuxAgLQQEC8HBy7GBi1Dg6wAADAIiLUQ0O1Bga0CQnRPT3UQ0O5FxfRPDzQPj7TPz/oJCTvMTHsLCzbCwv0PDzjGhr/T0/OFRXqJiblHBz0OTngFRXwNTX4RETfERH/S0v7SEjRGhr3PT33QUH6ODjLEBDnHx/rHR3pGBj+QkLeMzP8Pj7kGBjhOTn6Q0PmExP/R0fkDg7eDAz8SkrhCgrVISH1NjbjPz/JCgrGBgbfBgbaCAjqKSnuIiLlICD1Pz/dKCjhNDT2MjLhEhLxMDDbLi7yNTXjPDzdEBD5RkbnRUXkR0fBAQHeBATRAgLXBwfuJyfxKyviFRX7Rkb2Tk7lQEDqISHZHh71R0f2Skr/GslYAAAAHHRSTlMAxcW6cMDFwMXAwsXAwMDFwLrFusbAcXG6xm3GARgAAwAAAehJREFUeNqVzgtT2kAUBeAKsVoRFFF81QawEZIAQRBUHiYQIOUpKgIlPlH//19wN9xhx91Fx8OM7j3nk/HHd7IdCGzPX/dmq3f49DT0znOB2RocRlAGHr7zOuswiJ77bxFdV0EybhBRdT3yto/eu69qXI/rKk8uDVQdjerrLv5nTTV+iz7qs4dxzzCZQec0i4/yrfxYpCQZTA8UN8W8LMv5ovnzo4P6Btcgs3lN0/JZqOaXv86zWqvV0rLn5I+nVRIqIk+ToVAoeYpqqnA5N5EdGDou5qRkLnWEk8q5qIMjK7FYrJLKud3wBEdn5apyjebrSqczfaSuVhgEsts7QOl28c9eFxxfHuCA22AAke3eH0ivDY4fd/t+6u7bbr4g8J+TL+BG+e4v5K7s+9z9hnwm18oNxzTgF0ieSzebzfTk5WWCH5NGwsd1iUxakqR0JrGzM3v6uE4Kh8NSJrH48aCyfHhyhqazk8NF6mRdNBqFgS2IKzyg+qFwvM5USBJ3XLhUFOUSHFOSqqT0+32lBBVkga4XqqULURQvStUtojiDUDOc0yCOSJhqAro2bcOyLNGoraKDlSIaDXsTw3Hdtq06OFrW6pZt18cYCqP/KOA4Eq8jAb9XR+PxyM93sMK3CH6/wEVk/UbeAfeIgsYQxkZOAAAAAElFTkSuQmCC',
    boom:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAADAFBMVEVHcEzmkwDsiQCxsbK6sqXpjQDqiQDohADsiwDqkQixsbHriQCura6qqqrrjADsiwDrhwDrhwDpigDohADphgDrigDsiQDrjQCwsLCtra3ogwCtra2tra2mpqa5ubntiADohQDglSKqqquvr6+wsLGpq63qjQDqjQDGmlaqqqqxs7m1tbW0tLStra2qqqrpggCrq6uvr6+ts7uzppDxigDgkR3bmTKop6fzhQCqqqquqaLkkA23oHzqjQW1p5DXlC3VlzXwiwCxsbH////3oyP+4TP5uyn4tCj6wSr5rib7yC3/siMKEyT4pyS5ubn8zy7/6znDw8P/5DLv7/Czs7L91S/+3TH+/v+2trYjJCT39/jj4+T/zSvIyMj/pRMDDSPa2trumAf/5jb/6jj4pCLX2Nj2rCb/6DKrq6v/uSb9ohTLy8sJDyMTFyMbHCLAwMAfICTwmA+urq77tyjrjwH92S/5zCX/4DL/7DP6ox3Nzc7ppDi6qY3n5+cqKCT6+vrd3d309PT3pSbyqxL/7Tr/xir/3C7/8DS1tbXQ0NDawS/g4OD/9TS2vcq7u7vAytv7+/vR2ug3MST/rSJEPiX/rBNyUyS7xdbwnwvqiwDwow7zsBXr6+v2rRj4uSXY3+zo7fP6tSa0r6ju8vftkwX6qiX/vShqWie9poLCpHY7NyX+syj7ohjUmDzK1OXbplbJpGuhbyL9nw4AAx+0ucG6gCP6wiz8zjH7xy/6wS7+2DTg5vD/4Df1uxy2rJz4xiLw0DHDzuDvoy1jUib6zyjpyi/3+v3qpSaRaCTouCuzeiPDry7/+jX/0yz8rhu3oYHdo0jl6fDCydJzaCnb4+/ckyKjoqLU1NQRERGVf12oqKf4xSX60Cj5rSP3sST5xybPpGGoq7C9oCzyoia3wM6CaSfBm2Dgwy/YtSyUdijOoSnikRTxjAD/thmxjCmjkCzgrEsxLiX53zONdSjhvi2nrrzilyPEhSPh5ezBtKWkaRCMlKCwqaBgX1+8fR2ptcY4TO+QAAAA23RSTlMACms0BSP1zE4a/YCA5idUpOix15xJYftDarlZkfYL0IsU1K9Qm7qf/XvaJiLED+DBYMiwvtDyxvW35vT0i2z7gIsX//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////63c0JzAAADzklEQVR42p3UB1ATWRgH8EdLKOGkim3s/c7rp9fPu80KuMvKJmtCSCPBJMQQkoskAuFCEJDQu1RHUYpSRCl2z957RTmveL333t+yROMd6Iy/2Ul29vvnfW/fTD7woLy83f1efWnhy9M9JoJ7eMg9YFLgC6/MfvH5qc9xPMBIRj8d9kXn7PN/9laXicV2w8CCCWPAMEY90/nx+Q1FJWUXYxHI7luskjoenw7+w+OpdOrDg+vWH0NopSrKYYffmXm+EzyBqycSLl3ZKEQYpXbCocoQ8gv680iTad4jLrnxCXGIU6yduDZA6oopX4og88QNUv+H7/Q1iQcjfLFKZzANJBCkNE0l5sciNKF0qrP7RH+yIU5HEg6Ho5hMi3uDn4G4KiU4gDHNRBCEQcesMYwC/0cBbWwMTAiRkQmJ8QDy9Fch95E2A0BjqMwRFjq2cf2edWVbDpYUPQmgOeTdW49lyiXVRb2ODW+mb9q89b2u+T6w84w8+OOMzAaxvT9NJyWLeimm3NV1wWo9xE3tWC7r/tIbgNemFUsNRAxFUTEGnYEg0i9YD33A7ZBVdcuqlnd0pKYu43K5TX5wi3MN8HQL6MMT8vv/uCGTDZYrtpVX/lLBZax6fZYbGOvLRxhXLl37y3j9b4wuYX16XG77ucIZDPIBHAfz0r9W/3ZDdD0JX4PBXsuwNbhIhG/DnMGZXoATQwcvVidsbf+9BxZHDM6hMhB+ya3N1u6qqyI5jp9iWp/CcbnoqktruEfxlp82WWWyqCisr9x2AmuOgpqxE7byPiyK0Uy/jMfcf9K/PVf1dmSkOlKrPq5tV0dC6nbtcbUWPmIo/OCBczrPfdUYztC2NIavgOBtY4s2fMiKd5LhgYMpz67dtcipRSLJycmBH4tc7FrL8gFQUN3O7RGMs5LPP2s93PrR1yfPSiKctu+sCWL+p8kROxYPMp88nJSYiMPrux8kqxcP2REBO9M8g7N2L6Gt/lTUk6jXJxmNRr288kfeEsburEmA4Z387t6lkOZ9va2trdwGV9Ub5W1HeUtpe9+qDQVDAhQCpQAy539y4MDR/NPfXK5MSuxp1ayEz5RmRQhwcguuU8aj6Epebm5KSkpu4ZnC709fxis1GhSNR2vYbi5TLLAOzeaht/FSzhTm52tQXrag5jGfu+ZdsOJmNlzUJVuYi8ZnW5rYMOdqSkBtvTk6WnknqYyONtfXhrj9f+yxm+otAmX8EKXAUp/MDh1+kI5jKbL27bccOWLZvy9LwRo36l6jmR3ICgtjBbJDRnvdd9hPnuznHgpjD+ZfGirF2rXaToYAAAAASUVORK5CYII=',
    mine:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAn1BMVEVHcEwrNELdcSsvOEQtPEsrNEMrNURiRy4tN0MsNUQsNkUtNUMwOEfcdSzZayncejQsNkLdcisuNkbcdyo3QVC6kHnIoIbXw6vQfEjeeC0vOEZHTl4sNUNJT2BMUmNDS1o0PEs+RVU6QlHhfSnfbyj2yDvvrB///v/lghvythnmkS/zvS/+9u/yzKb86Z9QS0/irYP74Yn62lL98dUMIThUIhXlAAAAGnRSTlMA6X/jEVPNBZfyhGLdNMVJrZ7A3u+NdPz3X+gNyzcAAAG+SURBVHjahdRns6pADAZgQZZiAcupcStLs576/3/bjTrnZkEG8kGZ8Zk3G8zsZLzW22jUvPvLbF3YbBRurS3s/pCOQv9wrI7fVZFm0Qi05eXnVFYHux2GaVPWdX363hfrIRb5dv9Vn+qfox10k2XRVOWlPl2qYjkIo+ytaMqvsjzaLoyCIPp7wo+X18+i2jf2YH0XsXizeHpabGI2mcwXJpw/n8+vb41NfT99/8+C2dQocStlwk0upYCPz/NLVrhhmOAZIYXYYQl8MDoXUv1+PONELReDkqj+ChFokXPOOjOstJDE7rGaA/BF1MnboetKQAmB6xg35EgqzmHqJgaJxikeS+Yc5m7gjAI7kbByXZSAosCW1K1ZGKfOD72ZOzLCXT80PHZgOARDB3pD0H09ydAZk8CFvH9qIXQLesBz2RuoeKt1CBx2og9qDmFrI4BrKfpGAYgdyAClIUmNEbLWX4iQJG0uuiRqLQVcJa6+IIZ90cHMdbhmN6kN/i6uJYXSN0cvh055o7lR18rvjE7oDH6nWPRFIzu1AiB7V0Bb282k6sujC6DNvPkDoSuF2HQW9Bm6pEIvSbwwZn0X9j9xslsjQXfJHAAAAABJRU5ErkJggg==',
    flag:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAe1BMVEVHcEzCLynAMCrBMSm/Pz/GSTPIMCvFqFzZuWPKql60KSm1Kia3JiS0LCXINy21KSjHMivOtGTDqV3bumbMrmC6ZT7cNDHnOjPfNTHYMTDhNzLrPDTjODLs3HbXHSjQb0jZMzDtyW/vPjX1QDXKMSzVNy7QMy3BKinGbEUE7sHFAAAAFnRSTlMAw1qVCC3xWO6DH4TmS2a4z9tf9KLUz2qtxQAAANhJREFUeNrt0tkOwiAQheGqrXXfqjBlULGly/s/oVMlXnI08cbEuf7ywwSSjyad79dvwXx27lfLBYaH4ny9dN12jYsCVdl2ksWwdESllyyEpVNkqfGShVAp0pZaPxqnEJKxWqt2OskgFMlsmyGLoDS5YtNIFsKBDna3SSFkruparruBUKTQejrGUBibUYZgVYdLRqEcq8PaMcgsWzxiMaj59TQRaLSm8CoxSNY0/hmLQEXkfPeIxaAjB754gG343QD2IQbhKcQQvM2TP/xleCjehNlxnyffmjvRDS35QtPsQAAAAABJRU5ErkJggg=='
  };

  class ImgsLoader {
    constructor(imgsInfo$$1) {
      this.imgs = this.handleImgsInfo(imgsInfo$$1);
    }

    static imgByUrl(url) {
      const img = new Image();
      img.src = url;
      return img
    }

    handleImgsInfo(imgsInfo$$1) {
      const o = {};
      let n = 0;
      let l = Object.keys(imgsInfo$$1).length;
      for (let key in imgsInfo$$1) {
        if (imgsInfo$$1.hasOwnProperty(key)) {
          let imgPath = imgsInfo$$1[key];
          const img = new Image();
          img.src = imgPath;
          img.onload = () => {
            n += 1;
            if (n === l) {
              status.imgsLoad = true;
            }
          };
          o[key] = img;
        }
      }
      return o
    }

    imgByName(name) {
      return this.imgs[name]
    }
  }

  const imgs = new ImgsLoader(imgsInfo);

  class Cell {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.isActive = false;
      this.hasFlag = false;
      this.hasMine = false;
      this.firstBoom = false;
      this.surroundingMineCount = 0;
      this.activeLength = cell.activeLength;
      this.inactiveLength = cell.inactiveLength;
      this.textColor = cell.textColor;
      this.activeBgColor = cell.activeBgColor;
      this.inactiveBgColor = cell.inactiveBgColor;
      this.offsetX =
        this.x * minefield.gapLength + (this.x - 1) * this.inactiveLength;
      this.offsetY =
        this.y * minefield.gapLength + (this.y - 1) * this.inactiveLength;
    }

    resetCellStatus() {
      this.isActive = false;
      this.hasFlag = false;
      this.hasMine = false;
      this.surroundingMineCount = 0;
    }

    surroundingHasMine() {
      return this.surroundingMineCount !== 0
    }

    detectCellIsActive() {
      return this.isActive
    }

    active() {
      this.isActive = true;
      this.hasFlag = false;

      if (this.hasMine) {
        minefield$1.getHasMineCells().forEach(cell$$1 => {
          cell$$1.isActive = true;
          this.hasFlag = false;
        });
        this.firstBoom = true;
        game.isOver = true;
        face$1.changeStatus('defeat');
      } else if (!this.surroundingHasMine()) {
        minefield$1.activeSurroundingCells(this);
      }

      if (
        minefield$1.getActivedCellsCount() ===
        minefield$1.cellsCount - minefield$1.minesCount
      ) {
        minefield$1.getHasMineCells().forEach(cell$$1 => {
          cell$$1.hasFlag = true;
        });
        game.isVictory = true;
        face$1.changeStatus('victory');
      }
    }

    click() {
      if (game.isOver || game.isVictory || this.hasFlag) return

      if (this.isActive) {
        if (this.surroundingHasMine()) {
          const cells = Object.values(
            minefield$1.getSurroundingCells(this.x, this.y)
          );

          const count = cells.filter(cell$$1 => {
            return cell$$1 && cell$$1.hasFlag
          }).length;

          if (count === this.surroundingMineCount) {
            cells
              .filter(cell$$1 => {
                return cell$$1 && !cell$$1.isActive && !cell$$1.hasFlag
              })
              .forEach(cell$$1 => {
                cell$$1.active();
              });
          }
        }
      } else {
        this.active();
      }

      if (this.residualMinesCount < this.minesCount * 0.3)
        face$1.changeStatus('happy');
      else face$1.changeStatus('smile');
    }

    contextmenu() {
      if (!this.hasFlag && minefield$1.residualMinesCount === 0) return

      if (!this.detectCellIsActive() && !game.isOver && !game.isVictory)
        this.hasFlag = !this.hasFlag;
    }

    mousedown() {
      if (game.isOver || game.isVictory || this.hasFlag) return
      face$1.changeStatus('click');
    }

    draw() {
      if (this.detectCellIsActive()) {
        if (this.hasMine) {
          if (this.firstBoom) {
            context.drawImage(
              imgs.imgByName('boom'),
              this.offsetX,
              this.offsetY,
              this.activeLength,
              this.activeLength
            );
          } else if (
            (game.isOver || game.isOver) &&
            this.hasFlag &&
            this.hasMine
          ) {
            context.drawImage(
              imgs.imgByName('true'),
              this.offsetX,
              this.offsetY,
              this.activeLength,
              this.activeLength
            );
          } else {
            context.drawImage(
              imgs.imgByName('mine'),
              this.offsetX,
              this.offsetY,
              this.activeLength,
              this.activeLength
            );
          }
        } else if (!this.surroundingHasMine()) {
          context.fillStyle = this.activeBgColor;
          context.fillRect(
            this.offsetX,
            this.offsetY,
            this.activeLength,
            this.activeLength
          );
        } else {
          context.fillStyle = this.activeBgColor;
          context.fillRect(
            this.offsetX,
            this.offsetY,
            this.activeLength,
            this.activeLength
          );
          context.font = '800 12px sans-serif';
          context.font = '900 12px Arial';
          context.fillStyle = this.textColor;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(
            this.surroundingMineCount + '',
            this.offsetX + this.activeLength / 2,
            this.offsetY + this.activeLength / 2
          );
        }
      } else {
        if (this.hasFlag) {
          context.drawImage(
            imgs.imgByName('flag'),
            this.offsetX,
            this.offsetY,
            this.inactiveLength,
            this.inactiveLength
          );
        } else {
          context.fillStyle = this.inactiveBgColor;
          context.fillRect(
            this.offsetX,
            this.offsetY,
            this.inactiveLength,
            this.inactiveLength
          );
        }
      }
    }
  }

  class Minefield {
    constructor() {
      this.width = minefield.width;
      this.height = minefield.height;
      this.marginTop = minefield.marginTop;
      this.marginLeft = minefield.marginLeft;
      this.xCellsCount = minefield.xCellsCount;
      this.yCellsCount = minefield.yCellsCount;
      this.cellsCount = this.xCellsCount * this.yCellsCount;
      this.minesCount = minefield.minesCount;
      this.residualMinesCount = this.minesCount;
      this.bgColor = minefield.bgColor;

      this.init();
    }

    init() {
      this.initCells();
      this.initMines();
      this.initSurroundingMineCount();
    }

    initCells() {
      this.cells = [];

      for (let x = 0; x < this.xCellsCount; x++) {
        for (let y = 0; y < this.yCellsCount; y++) {
          const cell$$1 = new Cell(x + 1, y + 1);
          this.cells.push(cell$$1);
        }
      }
    }

    initMines() {
      for (let i = 0; i < this.minesCount; i++) {
        let x = randomBetweenNumbers(1, this.xCellsCount + 1, true);
        let y = randomBetweenNumbers(1, this.yCellsCount + 1, true);

        if (!this.detectCellHasMine(x, y)) {
          this.setMine(x, y);
        } else {
          i--;
        }
      }
    }

    detectCellHasMine(x, y) {
      return this.getCell(x, y).hasMine
    }

    setMine(x, y) {
      const cell$$1 = this.getCell(x, y);
      cell$$1 && (cell$$1.hasMine = true);
    }

    getCell(x, y) {
      if (x < 1 || x > this.xCellsCount || y < 1 || y > this.yCellsCount)
        return false
      const cell$$1 = this.cells[(x - 1) * this.yCellsCount + y - 1];
      if (!cell$$1) return false
      return cell$$1
    }

    initSurroundingMineCount() {
      for (let x = 1; x <= this.xCellsCount; x++) {
        for (let y = 1; y <= this.yCellsCount; y++) {
          if (this.detectCellHasMine(x, y)) {
            const cells = Object.values(this.getSurroundingCells(x, y));

            cells.forEach(cell$$1 => {
              cell$$1 && cell$$1.surroundingMineCount++;
            });
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
      return this.cells.filter(cell$$1 => {
        return cell$$1.hasMine
      })
    }

    getHasFlagCellsCount() {
      return this.cells.filter(cell$$1 => {
        return cell$$1.hasFlag
      }).length
    }

    getActivedCellsCount() {
      return this.cells.filter(cell$$1 => {
        return cell$$1.isActive && !cell$$1.hasMine
      }).length
    }

    activeSurroundingCells(cell$$1) {
      const cells = Object.values(this.getSurroundingCells(cell$$1.x, cell$$1.y));

      cells.forEach(cell$$1 => {
        cell$$1 && !cell$$1.hasFlag && !cell$$1.detectCellIsActive() && cell$$1.active();
      });
    }

    rebuild() {
      this.residualMinesCount = this.minesCount;

      this.resetCellsStatus();
      this.initMines();
      this.initSurroundingMineCount();
    }

    resetCellsStatus() {
      this.cells.forEach(cell$$1 => {
        cell$$1.resetCellStatus();
      });
    }

    registerClickEvent(e) {
      const cell$$1 = this.returnClickedCell(
        e.offsetX - this.marginLeft,
        e.offsetY - this.marginTop
      );

      cell$$1 && cell$$1.click();
    }

    registerContextmenuEvent(e) {
      const cell$$1 = this.returnClickedCell(
        e.offsetX - this.marginLeft,
        e.offsetY - this.marginTop
      );

      cell$$1 && cell$$1.contextmenu();
    }

    registerMousedownEvent(e) {
      const cell$$1 = this.returnClickedCell(
        e.offsetX - this.marginLeft,
        e.offsetY - this.marginTop
      );

      cell$$1 && cell$$1.mousedown();
    }

    returnClickedCell(clickX, clickY) {
      let x = Math.ceil(clickX / (cell.inactiveLength + minefield.gapLength));

      let y = Math.ceil(clickY / (cell.inactiveLength + minefield.gapLength));

      console.log(x, y);

      return this.getCell(x, y)
    }

    draw() {
      context.save();
      context.translate(this.marginLeft, this.marginTop);
      context.fillStyle = this.bgColor;
      context.fillRect(0, 0, this.width, this.height);
      this.cells.forEach(cell$$1 => {
        cell$$1.draw();
      });
      context.restore();
    }
  }

  class Face {
    constructor() {
      this.status = 'smile';
      this.offsetX = (game$1.width - face.width) / 2;
      this.offsetY = face.height / 2;
      this.width = face.width;
      this.height = face.height;
    }

    changeStatus(status) {
      this.status = status;
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
      sceneMain.initNewGame();
    }

    registerClickEvent(e) {
      if (this.detectToClickFace(e.offsetX, e.offsetY)) {
        this.click();
      }
    }

    registerMousedownEvent(e) {
      if (this.detectToClickFace(e.offsetX, e.offsetY)) {
        this.changeStatus('click');
      }
    }

    draw() {
      context.drawImage(imgs.imgByName(this.status), this.offsetX, this.offsetY, this.width, this.height);
    }
  }

  function drawRoundedRect(x, y, w, h, r) {
    context.save();
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + r, r);
    context.arcTo(x + w, y + h, x + w - r, y + h, r);
    context.arcTo(x, y + h, x, y + h - r, r);
    context.arcTo(x, y, x + r, y, r);
    context.fill();
    context.restore();
  }

  function drawRoundedRectByCenter(x, y, w, h, r) {
    x = x - w / 2;
    y = y - h / 2;

    drawRoundedRect(x, y, w, h, r);
  }

  const minefield$1 = new Minefield();
  const face$1 = new Face();

  class SceneMain extends Scene {
    constructor() {
      super();

      this.width = game$1.width;
      this.height = game$1.height;
      this.event = {};
    }

    addEvent(type, event) {
      if (!this.event[type]) this.event[type] = [];
      this.event[type].push(event);
    }

    removeEvent(type, event) {
      const index = this.event[type].indexOf(event);

      this.event[type].splice(index, 1);
    }

    handleEvent() {
      const clickEvent = e => {
        this.minefield.registerClickEvent(e);
        this.face.registerClickEvent(e);
        this.calculateresidualMinesCount();
      };
      const contextmenuEvent = e => {
        e.preventDefault();
        this.minefield.registerContextmenuEvent(e);
        this.calculateresidualMinesCount();
      };
      const mousedownEvent = e => {
        this.minefield.registerMousedownEvent(e);
        this.face.registerMousedownEvent(e);
      };

      this.addEvent('click', clickEvent);
      this.addEvent('contextmenu', contextmenuEvent);
      this.addEvent('mousedown', mousedownEvent);
    }

    registerEvent() {
      for (const type in this.event) {
        if (this.event.hasOwnProperty(type)) {
          const events = this.event[type];

          for (const event of events) {
            canvas.addEventListener(type, event, false);
          }
        }
      }
    }

    removeAllEvents() {
      for (const type in this.event) {
        if (this.event.hasOwnProperty(type)) {
          const events = this.event[type];

          for (const event of events) {
            canvas.removeEventListener(type, event, false);
          }
        }
      }
    }

    init() {
      this.minefield = minefield$1;
      this.face = face$1;
      this.initTimeStamp = Date.now();
      this.handleEvent();
      this.registerEvent();
      this.initStatus = true;
    }

    initNewGame() {
      this.minefield.rebuild();
      this.face.changeStatus('smile');
      this.initTimeStamp = Date.now();
      game.isOver = false;
      game.isVictory = false;
    }

    calculateresidualMinesCount() {
      this.minefield.residualMinesCount =
        this.minefield.minesCount - this.minefield.getHasFlagCellsCount();
    }

    calculateGameTime() {
      let time = Date.now() - this.initTimeStamp;
      let second = Math.floor(time / 1000);
      let minute = Math.floor(second / 60);

      this.time = `${minute} : ${
      second - minute * 60 < 10
        ? '0' + (second - minute * 60)
        : second - minute * 60
    }`;
    }

    update() {
      if (!game.isOver && !game.isVictory) {
        this.calculateGameTime();
      }
    }

    draw() {
      super.draw();

      context.fillStyle = '#DEDEDE';
      drawRoundedRect(0, 0, this.width, this.height, 10);

      context.fillStyle = '#FFFFFF';

      drawRoundedRect(4, 4, this.width - 8, this.height - 8, 8);

      context.fillStyle = '#DEDEDE';
      drawRoundedRectByCenter(this.width / 2, 30, this.width - 28, 40, 6);

      context.fillStyle = '#FFFFFF';
      drawRoundedRectByCenter(this.width / 2, 30, this.width - 32, 36, 4);

      context.font = '800 20px sans-serif';
      context.fillStyle = '#646464';
      context.textBaseline = 'middle';
      context.textAlign = 'left';
      context.fillText(this.minefield.residualMinesCount + '', 50, 30);
      context.textAlign = 'right';
      context.fillText(this.time, this.width - 50, 30);

      this.face.draw();
      this.minefield.draw();
    }
  }

  const sceneMain = new SceneMain();

  const __main = function() {
    if (!status.storageSupportedFlag) {
      alert('您的浏览器版本过低或开启无痕模式，部分功能无法实现');
    }

    const game$$1 = Game.instance(sceneMain);
    game$$1.__start();
  };

  __main();

}());
