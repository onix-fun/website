import fs from 'node:fs'
import path from 'node:path'

const sourceRoot = path.resolve(import.meta.dirname, '../src')
const sassFiles = []

function inspectDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name)
    if (entry.isDirectory()) inspectDirectory(filePath)
    else if (entry.name.endsWith('.scss')) sassFiles.push(path.relative(sourceRoot, filePath))
  }
}

inspectDirectory(sourceRoot)

if (sassFiles.length > 0) {
  console.error('SCSS is not allowed. Use styled-components instead:')
  for (const file of sassFiles) console.error(`  - ${file}`)
  process.exitCode = 1
}
