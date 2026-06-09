import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { useDebounce } from "./index"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should debounce function calls", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 500)

    debounced()
    debounced()
    debounced()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("should pass arguments to the debounced function", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 500)

    debounced("a", "b")

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledWith("a", "b")
  })

  it("should use the last arguments when called multiple times", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 500)

    debounced("first")
    debounced("second")
    debounced("third")

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledWith("third")
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("should reset the delay on subsequent calls", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 500)

    debounced()
    vi.advanceTimersByTime(300)
    debounced()
    vi.advanceTimersByTime(300)

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("should use default delay of 1500ms", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn)

    debounced()

    vi.advanceTimersByTime(1499)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("should cancel pending execution", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 500)

    debounced()
    debounced.cancel()

    vi.advanceTimersByTime(500)
    expect(fn).not.toHaveBeenCalled()
  })

  it("should flush pending execution immediately", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 500)

    debounced()
    debounced.flush()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("should do nothing on flush when no pending call", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 500)

    debounced.flush()

    expect(fn).not.toHaveBeenCalled()
  })

  it("should preserve this context", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 500)

    const obj = { debounced, value: 42 }
    obj.debounced()

    vi.advanceTimersByTime(500)
    expect(fn.mock.contexts[0]).toBe(obj)
  })

  it("should work with no arguments", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 500)

    debounced()

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledWith()
  })

  it("should handle multiple flush calls", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 500)

    debounced()
    debounced.flush()
    debounced.flush()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("should handle cancel after flush", () => {
    const fn = vi.fn()
    const debounced = useDebounce(fn, 500)

    debounced()
    debounced.flush()
    debounced.cancel()

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
