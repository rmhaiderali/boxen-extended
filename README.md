# boxen-extended

Extended wrapper around [`boxen`](https://github.com/sindresorhus/boxen) for rendering multiple values in one box, with divider support and smart `inspect()` formatting.

## Install

```bash
npm install boxen-extended
```

## Usage

```ts
import boxenExtended from "boxen-extended"

const output = boxenExtended(
  123,
  "Alice",
  ["one", "two"],
  { foo: "bar" },
  () => "hello world",
)

console.log(output)
```

By default:

- non-string values are rendered with `node-inspect-extracted`
- string values are used as-is
- `single` border style is used unless you set `borderStyle: "none"`

## API

### `boxenExtended(...args)`

Default export. Also available as a named export.

```ts
boxenExtended(...args: unknown[] | [...unknown[], Options]): string
```

- You can pass one or more values to show inside the box.
- You can also pass one extra object at the end for options.
- The last object is recognized as the options object if it has **any** of these keys:
  - `boxenOptions`
  - `inspectOptions`
  - `extendedOptions`

If the last argument does not have any of those keys, it is treated as normal content.

#### `Options`

```ts
type Options = {
  boxenOptions?: PatchedBoxenOptions
  inspectOptions?: InspectOptions
  extendedOptions?: ExtendedOptions
}
```

- `boxenOptions`: forwarded to `boxen`
- `inspectOptions`: forwarded to `inspect()` for non-string values (or all values when `rawStrings` is enabled)
- `extendedOptions`: controls extra behavior from this package

#### `extendedOptions.rawStrings`

```ts
type ExtendedOptions = {
  rawStrings?: boolean // default: false
}
```

- `false` (default): plain strings are kept untouched; non-strings are inspected
- `true`: all values (including strings) are run through `inspect()`

### `boxenCompatible(value, options)`

Named export for easier drop-in compatibility with `boxen(value, options)`.

```ts
boxenCompatible(value: string, options: BoxenOptions): string
```

## Divider Behavior

When a border style is enabled, passing multiple values renders each value in a separate section with a center divider line between them.

If `borderStyle` is `"none"`, values are joined with blank lines instead of border dividers.

## Supported Built-in Border Styles

This package supports all built-in styles from `boxen` and extends style objects with divider characters:

- `single`
- `double`
- `round`
- `bold`
- `singleDouble`
- `doubleSingle`
- `classic`
- `arrow`
- `none`

You can also pass a custom style object with all `boxen` border keys plus:

- `center`
- `centerLeft`
- `centerRight`

## Notes

- `boxen` options like `margin`, `title`, `width`, `height`, `float`, and colors are passed through via `boxenOptions`.
- Divider rendering is ANSI-aware and keeps colored output aligned.
