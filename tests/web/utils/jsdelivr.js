import fs from "node:fs"

const packageLockPath = import.meta.dirname + "/../../../package-lock.json"

const packageLock = fs.readFileSync(packageLockPath, "utf-8")
const packages = JSON.parse(packageLock).packages || {}

export default function jsdelivr(name) {
  const version = packages["node_modules/" + name]?.version || "latest"
  return "https://cdn.jsdelivr.net/npm/" + name + "@" + version + "/+esm"
}
