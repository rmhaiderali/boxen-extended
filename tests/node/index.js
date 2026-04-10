import boxenExtended from "../../dist/index.mjs"

const output = boxenExtended(
  123,
  "Alice",
  ["one", "two"],
  { foo: "bar" },
  () => "hello world",
)

console.log(output)
