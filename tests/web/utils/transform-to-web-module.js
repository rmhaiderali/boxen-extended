import fs from "node:fs"
import convertImportToDynamic from "./convert-import-to-dynamic.js"

const projectRoot = import.meta.dirname + "/../../.."

const dist = projectRoot + "/dist"
const distWeb = projectRoot + "/dist-web"

const modulePath = dist + "/index.mjs"

const module = fs.readFileSync(modulePath, "utf-8")

const regex = /import.+from.+/g

const matches = [...module.match(regex)]

console.log(matches)

const replacements = await Promise.all(
  matches.map((m) => convertImportToDynamic(m)),
)

console.log(replacements)

let i = 0
const modifiedModule = module.replace(regex, () => replacements[i++])

if (!fs.existsSync(distWeb)) fs.mkdirSync(distWeb)

fs.writeFileSync(distWeb + "/index.js", modifiedModule)
