let scrollTo = function (position, timeout) {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  let direction = position - scrollTop > 0 ? 1 : -1
  let distance = Math.abs(position - scrollTop)
  let split = distance / 50
  let _timeout

  if (position !== scrollTop) {
    timeout = timeout || 1000
    split *= direction

    _timeout = setInterval(function () {
      scrollTop += split
      distance -= Math.abs(split)
      if (distance <= 0) {
        window.scrollTo(0, position)
        clearInterval(_timeout)
        _timeout = null
      } else {
        window.scrollTo(0, scrollTop)
      }
    }, timeout / 100)
  }
}

export {scrollTo}
