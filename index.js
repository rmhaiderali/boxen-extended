import { inspect } from "node:util"
import RegexEscape from "regex-escape"
import ansiRegex from "ansi-regex"
import boxen from "boxen"

const styles = {
  single: {
    topLeft: "┌",
    top: "─",
    topRight: "┐",
    right: "│",
    bottomRight: "┘",
    bottom: "─",
    bottomLeft: "└",
    left: "│",
    center: "─",
    centerRight: "┤",
    centerLeft: "├",
  },
  double: {
    topLeft: "╔",
    top: "═",
    topRight: "╗",
    right: "║",
    bottomRight: "╝",
    bottom: "═",
    bottomLeft: "╚",
    left: "║",
    center: "═",
    centerRight: "╣",
    centerLeft: "╠",
  },
  round: {
    topLeft: "╭",
    top: "─",
    topRight: "╮",
    right: "│",
    bottomRight: "╯",
    bottom: "─",
    bottomLeft: "╰",
    left: "│",
    center: "─",
    centerRight: "┤",
    centerLeft: "├",
  },
  bold: {
    topLeft: "┏",
    top: "━",
    topRight: "┓",
    right: "┃",
    bottomRight: "┛",
    bottom: "━",
    bottomLeft: "┗",
    left: "┃",
    center: "━",
    centerRight: "┫",
    centerLeft: "┣",
  },
  singleDouble: {
    topLeft: "╓",
    top: "─",
    topRight: "╖",
    right: "║",
    bottomRight: "╜",
    bottom: "─",
    bottomLeft: "╙",
    left: "║",
    center: "─",
    centerRight: "╢",
    centerLeft: "╟",
  },
  doubleSingle: {
    topLeft: "╒",
    top: "═",
    topRight: "╕",
    right: "│",
    bottomRight: "╛",
    bottom: "═",
    bottomLeft: "╘",
    left: "│",
    center: "═",
    centerRight: "╡",
    centerLeft: "╞",
  },
  classic: {
    topLeft: "+",
    top: "-",
    topRight: "+",
    right: "|",
    bottomRight: "+",
    bottom: "-",
    bottomLeft: "+",
    left: "|",
    center: "-",
    centerRight: "+",
    centerLeft: "+",
  },
  arrow: {
    topLeft: "↘",
    top: "↓",
    topRight: "↙",
    right: "←",
    bottomRight: "↖",
    bottom: "↑",
    bottomLeft: "↗",
    left: "→",
    center: "↕",
    centerRight: "←",
    centerLeft: "→",
  },
}

const zeroOrMoreAnsi = "((?:" + ansiRegex({ onlyFirst: true }).source + ")*)"

export function fmt(...args) {
  const bOpts = { padding: { left: 1, right: 1 } }
  const iOpts = { colors: true }
  if (
    args.at(-1)?.hasOwnProperty?.("boxenOptions") ||
    args.at(-1)?.hasOwnProperty?.("inspectOptions")
  ) {
    const { boxenOptions, inspectOptions } = args.pop()
    Object.assign(bOpts, boxenOptions)
    Object.assign(iOpts, inspectOptions)
  }

  const style = styles[bOpts.borderStyle] || styles.single

  const regex = new RegExp(
    "( *)" +
      zeroOrMoreAnsi +
      RegexEscape(style.left) +
      zeroOrMoreAnsi +
      "( *<:boxen:> *)" +
      zeroOrMoreAnsi +
      RegexEscape(style.right) +
      zeroOrMoreAnsi +
      "( *)",
    "g"
  )

  const box = boxen(
    args
      .map((arg) => (typeof arg === "string" ? arg : inspect(arg, iOpts)))
      .join(
        bOpts.borderStyle === "none"
          ? "\n".repeat(
              Math.max(
                bOpts.padding?.bottom || bOpts.padding || 0,
                bOpts.padding?.top || bOpts.padding || 0
              ) + 1
            )
          : "\n<:boxen:>\n"
      ),
    bOpts
  )

  if (bOpts.borderStyle === "none") return box

  const centerReplacedBox = box.replace(
    regex,
    (match, g1, g2, g3, g4, g5, g6, g7) => {
      // g1: left spaces
      // g2: pre left border ansi
      // g3: post left border ansi
      // g4: middle content
      // g5: pre right border ansi
      // g6: post right border ansi
      // g7: right spaces

      const empty =
        g1 +
        g2 +
        style.left +
        g3 +
        " ".repeat(g4.length) +
        g5 +
        style.right +
        g6 +
        g7
      const border =
        g1 +
        g2 +
        style.centerLeft +
        style.center.repeat(g4.length) +
        style.centerRight +
        g6 +
        g7

      return (
        (empty + "\n").repeat(bOpts.padding?.bottom || bOpts.padding || 0) +
        border +
        ("\n" + empty).repeat(bOpts.padding?.top || bOpts.padding || 0)
      )
    }
  )

  return centerReplacedBox
}

export function log(...args) {
  console.log(fmt(...args))
}

export default { fmt, log }
