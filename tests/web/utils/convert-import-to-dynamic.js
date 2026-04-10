import { parseImports } from "parse-imports"
import jsdelivr from "./jsdelivr.js"

export default async function convertImportToDynamic(code) {
  const i = [...(await parseImports(code))][0]

  const defaultImport = i.importClause.default
  const namedImports = i.importClause.named

  const imports = defaultImport
    ? [{ specifier: "default", binding: defaultImport }].concat(namedImports)
    : namedImports

  const moduleUrl = JSON.stringify(jsdelivr(i.moduleSpecifier.value))

  return (
    "const { " +
    imports.map((imp) => imp.specifier + ": " + imp.binding).join(", ") +
    " } = await import(" +
    moduleUrl +
    ")"
  )
}
