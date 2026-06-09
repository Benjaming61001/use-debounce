# use-debounce

A lightweight TypeScript debounce function implementation that fires on the trailing edge, preserving `this` context and parameters. Ideal for user input events.

## Installation

```bash
npm install @benjaming61001/use-debounce
```

```bash
bun add @benjaming61001/use-debounce
```

```bash
yarn add @benjaming61001/use-debounce
```

```bash
pnpm add @benjaming61001/use-debounce
```

## Usage

### Basic Usage

```typescript
import { useDebounce } from '@benjaming61001/use-debounce'

const debouncedSearch = useDebounce((query: string) => {
  fetchResults(query)
}, 500)

debouncedSearch('hello')
```

### Cancel & Flush

```typescript
const debouncedSave = useDebounce((data: FormData) => {
  api.save(data)
}, 1000)

// Cancel pending execution
debouncedSave.cancel()

// Flush pending execution immediately
debouncedSave.flush()
```

### Preserving Context

```typescript
class SearchController {
  query = ''

  search = useDebounce((term: string) => {
    console.log(this.query) // `this` is preserved
    api.search(term)
  }, 300)
}
```

## API

### `useDebounce(func, delay?)`

Creates a debounced version of a function that delays its execution until after a specified `delay` milliseconds have passed since the last time it was invoked.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `func` | `(...args: TArgs) => void` | required | The function to debounce |
| `delay` | `number` | `1500` | Delay in milliseconds |

**Returns:** A debounced function with `cancel()` and `flush()` methods.

### `cancel()`

Cancels any pending debounced function execution.

### `flush()`

Immediately executes the debounced function if there's a pending call, then cancels any further pending execution.

## Development

```bash
bun install
bun run test        # run tests
bun run test:watch  # watch mode
bun run build       # build package
```

## License

MIT
