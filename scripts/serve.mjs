import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const root = join(process.cwd(), 'dist')
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
}

createServer((request, response) => {
  const requestedPath = decodeURIComponent((request.url ?? '/').split('?')[0])
  const safePath = normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '')
  let filePath = join(root, safePath === '/' ? 'index.html' : safePath)
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) filePath = join(root, 'index.html')

  response.setHeader('Content-Type', types[extname(filePath)] ?? 'application/octet-stream')
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  response.setHeader('Pragma', 'no-cache')
  response.setHeader('Expires', '0')
  createReadStream(filePath).pipe(response)
}).listen(5173, '127.0.0.1', () => {
  console.log('Vértia disponível em http://127.0.0.1:5173/ — cache desativado')
})
