type DebouncedFn<TArgs extends any[]> = ((...args: TArgs) => void) & {
  cancel: () => void
  flush: () => void
}

export function useDebounce<TArgs extends any[]>(
  func: (...args: TArgs) => void,
  delay: number = 1500
): DebouncedFn<TArgs> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: TArgs | null = null
  let lastThis: unknown = null

  function cleanup(): void {
    timeoutId = null
    lastArgs = null
    lastThis = null
  }

  const debounced = function (this: unknown, ...args: TArgs): void {
    lastArgs = args
    lastThis = this

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(lastThis, lastArgs!)
      cleanup()
    }, delay)
  } as DebouncedFn<TArgs>

  debounced.cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    cleanup()
  }

  debounced.flush = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      func.apply(lastThis, lastArgs!)
      cleanup()
    }
  }

  return debounced
}
