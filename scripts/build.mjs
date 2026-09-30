import { cpSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

rmSync('dist', { recursive: true, force: true })
mkdirSync('dist/assets', { recursive: true })

const result = spawnSync('./node_modules/.bin/esbuild', [
  'src/main.tsx',
  '--bundle',
  '--minify',
  '--sourcemap',
  '--outfile=dist/assets/index.js',
], { stdio: 'inherit' })

if (result.status !== 0) process.exit(result.status ?? 1)

const revision = createHash('sha256')
  .update(readFileSync('dist/assets/index.js'))
  .update(readFileSync('dist/assets/index.css'))
  .digest('hex')
  .slice(0, 12)
renameSync('dist/assets/index.js', `dist/assets/index-${revision}.js`)
renameSync('dist/assets/index.css', `dist/assets/index-${revision}.css`)

const sourceHtml = readFileSync('index.html', 'utf8')
const productionHtml = sourceHtml.replace(
  '<script type="module" src="/src/main.tsx"></script>',
  `<link rel="stylesheet" href="./assets/index-${revision}.css" />\n    <script type="module" src="./assets/index-${revision}.js"></script>`,
)

writeFileSync('dist/index.html', productionHtml)
cpSync('public', 'dist', { recursive: true })
console.log('Build concluído em dist/.')
