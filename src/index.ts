/**
 * A generic type constraint for any function.
 */
type AnyFunction = (...args: any[]) => any

/**
 * Creates a debounced function factory.
 *
 * This function returns a new, debounced version of the passed function (`func`).
 * The debounced function will only be invoked after `delay` milliseconds
 * have passed since the last time it was called.
 *
 * This is useful for delaying an action until after a "burst" of events
 * (e.g., waiting for a user to stop typing before saving).
 *
 * @param func The function to debounce.
 * @param delay The number of milliseconds to wait after the last invocation.
 * @returns A new, debounced function.
 */
export function debounce<T extends AnyFunction> (
  func: T,
  delay: number
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout((): void => {
      func.apply(this, args)
    }, delay)
  }
}

export default { debounce }