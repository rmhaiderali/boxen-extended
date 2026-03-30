import boxen from "boxen"
import ansiRegex from "ansi-regex"
import { inspect } from "node-inspect-extracted"

import * as boxenTypes from "boxen"
import * as cliBoxesTypes from "cli-boxes"
import * as nodeInspectExtractedTypes from "node-inspect-extracted"

import { styles, Styles } from "./styles.ts"

type BoxenSpacing = boxenTypes.Spacing

type BoxenOptions = boxenTypes.Options

type InspectOptions = nodeInspectExtractedTypes.InspectOptions

type PatchedCliBoxesBoxStyle = cliBoxesTypes.BoxStyle & {
  readonly center: string
  readonly centerLeft: string
  readonly centerRight: string
}

type PatchedBoxenBorderStyle =
  | undefined
  | "none"
  | Styles
  | PatchedCliBoxesBoxStyle

type PatchedBoxenOptions = Omit<BoxenOptions, "borderStyle"> & {
  borderStyle?: PatchedBoxenBorderStyle
}

type ExtendedOptions = { rawStrings?: boolean }

type Options = {
  boxenOptions?: PatchedBoxenOptions
  inspectOptions?: InspectOptions
  extendedOptions?: ExtendedOptions
}

function RegexEscape(input: string) {
  return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
}

function getSpacingSide(
  spacing: undefined | number | BoxenSpacing,
  side: keyof BoxenSpacing,
) {
  return typeof spacing === "number" ? spacing : spacing?.[side] || 0
}

const zeroOrMoreAnsi = "((?:" + ansiRegex({ onlyFirst: true }).source + ")*)"

export function boxenExtended(...args: unknown[] | [...unknown[], Options]) {
  const bOpts: PatchedBoxenOptions = { padding: { left: 1, right: 1 } }
  const iOpts: InspectOptions = { colors: true }
  const eOpts: ExtendedOptions = { rawStrings: false }

  const last = args.at(-1)

  if (
    last?.hasOwnProperty?.("boxenOptions") ||
    last?.hasOwnProperty?.("inspectOptions") ||
    last?.hasOwnProperty?.("extendedOptions")
  ) {
    const { boxenOptions, inspectOptions, extendedOptions } =
      args.pop() as Options
    Object.assign(bOpts, boxenOptions)
    Object.assign(iOpts, inspectOptions)
    Object.assign(eOpts, extendedOptions)
  }

  let style: PatchedBoxenBorderStyle = undefined

  if (bOpts.borderStyle !== "none") {
    if (typeof bOpts.borderStyle === "string") style = styles[bOpts.borderStyle]
    else if (typeof bOpts.borderStyle === "object") style = bOpts.borderStyle
    else style = styles.single
  }

  const paddingTop = getSpacingSide(bOpts.padding, "top")
  const paddingBottom = getSpacingSide(bOpts.padding, "bottom")

  const inspectAll = (arg: unknown) => inspect(arg, iOpts)

  const inspectExceptString = (arg: unknown) =>
    typeof arg === "string" ? arg : inspect(arg, iOpts)

  const inspector = eOpts.rawStrings ? inspectAll : inspectExceptString

  const joiner = style
    ? "\n:boxen:split:\n"
    : "\n".repeat(Math.max(paddingTop, paddingBottom) + 1)

  const box = boxen(args.map(inspector).join(joiner), bOpts)

  if (!style) return box

  const regex = new RegExp(
    "( *)" +
      zeroOrMoreAnsi +
      RegexEscape(style.left) +
      zeroOrMoreAnsi +
      "( *:boxen:split: *)" +
      zeroOrMoreAnsi +
      RegexEscape(style.right) +
      zeroOrMoreAnsi +
      "( *)",
    "g",
  )

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
        (empty + "\n").repeat(paddingBottom) +
        border +
        ("\n" + empty).repeat(paddingTop)
      )
    },
  )

  return centerReplacedBox
}

export function boxenCompatible(value: string, options: BoxenOptions) {
  return boxenExtended(value, { boxenOptions: { padding: 0, ...options } })
}

export default boxenExtended
