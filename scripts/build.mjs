import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

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

const sourceHtml = readFileSync('index.html', 'utf8')
const productionHtml = sourceHtml.replace(
  '<script type="module" src="/src/main.tsx"></script>',
  '<link rel="stylesheet" href="./assets/index.css" />\n    <script type="module" src="./assets/index.js"></script>',
)

writeFileSync('dist/index.html', productionHtml)
copyFileSync('public/vertia-logo.png', 'dist/vertia-logo.png')
console.log('Build concluído em dist/.')
