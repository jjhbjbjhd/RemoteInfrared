/**
 * 防抖函数
 * @param { Function } func 被防抖的函数
 * @param { Number } delay 防抖的延迟时间，默认500毫秒
 * @param { Boolean } immediate 是否立即执行，默认false
 * @param { Function } resultCallback 执行结果回调
 */
function debounce(func, delay = 500, immediate = false, resultCallback) {
    let timer = null
    let isInvoke = false
  
    const _debounce = function (...args) {
      return new Promise((resolve, reject) => {
        if (timer) clearTimeout(timer)
  
        if (immediate && !isInvoke) {
          try {
            const result = func.apply(this, args)
            if (resultCallback) resultCallback(result)
            resolve(result)
          } catch (e) {
            reject(e)
          }
          isInvoke = true
        } else {
          timer = setTimeout(() => {
            try {
              const result = func.apply(this, args)
              if (resultCallback) resultCallback(result)
              resolve(result)
            } catch (e) {
              reject(e)
            }
            isInvoke = false
            timer = null
          }, delay)
        }
      })
    }
  
    _debounce.cancel = function () {
      if (timer) clearTimeout(timer)
      isInvoke = false
      timer = null
    }
  
    return _debounce
  }
  
  /**
   * 节流函数
   * @param { Function } func 被节流的函数
   * @param { Number } interval 触发间隔时间
   * @param { Object } options leading: 是否在开始时触发, trailing: 是否在结束时触发
   */
  function throttle(func, interval, options = { leading: true, trailing: true }) {
    let timer = null
    let lastTime = 0
  
    const _throttle = function (...args) {
      const nowTime = Date.now()
      if (!lastTime && !options.leading) lastTime = nowTime
  
      const remainTime = interval - (nowTime - lastTime)
      if (remainTime <= 0) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        lastTime = nowTime
        func.apply(this, args)
      }
  
      if (options.trailing && !timer) {
        timer = setTimeout(() => {
          lastTime = options.leading ? Date.now() : 0
          timer = null
          func.apply(this, args)
        }, remainTime)
      }
    }
  
    _throttle.cancel = function () {
      if (timer) clearTimeout(timer)
      timer = null
      lastTime = 0
    }
  
    return _throttle
  }
  
  /**
   * 驼峰转换下划线
   * @param { String } name 驼峰命名的字符串
   * @returns { String } 下划线命名的字符串
   */
  function toLine(name) {
    return name.replace(/([A-Z])/g, '_$1').toLowerCase()
  }
  
  // 导出函数
  export { debounce, throttle, toLine }
  