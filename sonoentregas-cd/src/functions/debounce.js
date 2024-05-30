const debounceEvent = time => {
  return function(fn, wait = 1000) {
    clearInterval(time)

    time = setTimeout(() => {
      fn()
    }, wait)
  }
}

export const debounce = debounceEvent()
