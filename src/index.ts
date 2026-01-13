type useDebounceReturnType<TArgs extends any[]> = ((...args: TArgs) => void) & { cancel: () => void, flush: () => void }

/**
 * Creates a debounced version of a function that delays its execution until after
 * a specified `delay` milliseconds have passed since the last time it was invoked.
 * This function defaults to trailing-edge debounce behavior.
 *
 * @template TArgs - A tuple type representing the arguments of the debounced function.
 * @param {((...args: TArgs) => void)} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {(...args: TArgs) => void & { cancel: () => void; flush: () => void; }} - The debounced function,
 * with `cancel` and `flush` methods attached.
*/
export function useDebounce<TArgs extends any[]> (
  func: (...args: TArgs) => void,
  delay: number = 1500
): useDebounceReturnType<TArgs> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: TArgs | null = null
  let lastThis: any | null = null

  const debounced = function (this: any, ...args: TArgs): void {
    lastArgs = args
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout((): void => {
      func.apply(lastThis, lastArgs as TArgs)
      timeoutId = null
      lastArgs = null
      lastThis = null
    }, delay)
  } as useDebounceReturnType<TArgs>

  /**
   * Cancels any pending debounced function execution.
   */
  debounced.cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = null
    lastArgs = null
    lastThis = null
  }

  /**
   * Immediately executes the debounced function if there's a pending call,
   * then cancels any further pending execution.
   */
  debounced.flush = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      func.apply(lastThis, lastArgs as TArgs)
      timeoutId = null
      lastArgs = null
      lastThis = null
    }
  }

  return debounced
}
