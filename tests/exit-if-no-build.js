import fs from "node:fs"

const projectRoot = import.meta.dirname + "/.."

const dist = projectRoot + "/dist"

const modulePath = dist + "/index.mjs"

if (!fs.existsSync(modulePath)) {
  console.error('Please run "npm run build" first.')
  process.exit(1)
}
