import boxenExtended from "./dist/index.mjs"

const join = (...parts: string[]) => parts.join("\n")

const t1 = boxenExtended("Hello", "World")

const s1 = join(
  "┌───────────────┐",
  "│ Hello         │",
  "├───────────────┤",
  "│ World         │",
  "└───────────────┘",
)

console.log(1, t1 === s1)

const t2 = boxenExtended("Hello", "World", {
  boxenOptions: { borderStyle: "double" },
})

const s2 = join(
  "╔═══════════════╗",
  "║ Hello         ║",
  "╠═══════════════╣",
  "║ World         ║",
  "╚═══════════════╝",
)

console.log(2, t2 === s2)

const t3 = boxenExtended(":boxen:split:")

const s3 = join(
  //
  "┌───────────────┐",
  "├───────────────┤",
  "└───────────────┘",
)

console.log(3, t3 === s3)

const t4 = boxenExtended()

const s4 = join(
  //
  "┌──┐",
  "│  │",
  "└──┘",
)

console.log(4, t4 === s4)

const t5 = boxenExtended("Hello", "World", {
  extendedOptions: { rawStrings: true },
})

const s5 = join(
  "┌───────────────┐",
  "│ \x1B[32m'Hello'\x1B[39m       │",
  "├───────────────┤",
  "│ \x1B[32m'World'\x1B[39m       │",
  "└───────────────┘",
)

console.log(5, t5 === s5)

const t6 = boxenExtended(() => 0)

const s6 = join(
  "┌────────────────────────┐",
  "│ \x1B[36m[Function (anonymous)]\x1B[39m │",
  "└────────────────────────┘",
)

console.log(6, t6 === s6)

const t7 = boxenExtended("0123456789ABCDEF", "World", {
  boxenOptions: { margin: 1, padding: 1 },
})

const s7 = join(
  "",
  "   ┌──────────────────────┐",
  "   │                      │",
  "   │   0123456789ABCDEF   │",
  "   │                      │",
  "   ├──────────────────────┤",
  "   │                      │",
  "   │   World              │",
  "   │                      │",
  "   └──────────────────────┘",
  "",
)

console.log(7, t7 === s7)

const t8 = boxenExtended("0123456789ABCDEF", "Hello", {
  boxenOptions: {
    margin: { top: 1, bottom: 2, left: 3, right: 4 },
    padding: { top: 1, bottom: 2, left: 3, right: 4 },
  },
})

const s8 = join(
  "",
  "   ┌───────────────────────┐",
  "   │                       │",
  "   │   0123456789ABCDEF    │",
  "   │                       │",
  "   │                       │",
  "   ├───────────────────────┤",
  "   │                       │",
  "   │   Hello               │",
  "   │                       │",
  "   │                       │",
  "   └───────────────────────┘",
  "",
  "",
)

console.log(8, t8 === s8)

const t9 = boxenExtended(["Hello"], [[[["World"]]]], {
  inspectOptions: { colors: false },
})

const s9 = join(
  "┌─────────────────────┐",
  "│ [ 'Hello' ]         │",
  "├─────────────────────┤",
  "│ [ [ [ [Array] ] ] ] │",
  "└─────────────────────┘",
)

console.log(9, t9 === s9)

const t10 = boxenExtended(["Hello"], [[[["World"]]]], {
  inspectOptions: { colors: false, depth: null },
})

const s10 = join(
  "┌───────────────────────┐",
  "│ [ 'Hello' ]           │",
  "├───────────────────────┤",
  "│ [                     │",
  "│   [ [ [ 'World' ] ] ] │",
  "│ ]                     │",
  "└───────────────────────┘",
)

console.log(10, t10 === s10)
