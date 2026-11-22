import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import handleApi from './api/index.js'

const root = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(root, 'dist')
const port = Number(process.env.PORT || 3000)

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

function serveFile(res, filePath, status = 200) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.statusCode = 404
      res.end('Not found')
      return
    }
    res.statusCode = status
    res.setHeader('Content-Type', mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream')
    res.end(data)
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)

  if (url.pathname.startsWith('/api/')) {
    let raw = ''
    for await (const chunk of req) raw += chunk
    if (raw) {
      try {
        req.body = JSON.parse(raw)
      } catch {
        req.body = {}
      }
    } else {
      req.body = {}
    }
    try {
      await handleApi(req, res)
    } catch (error) {
      console.error('[api]', error)
      if (!res.headersSent) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ok: false, error: 'Internal server error' }))
      }
    }
    return
  }

  let requested = decodeURIComponent(url.pathname)
  if (requested === '/') requested = '/index.html'
  const filePath = path.join(dist, path.normalize(requested).replace(/^([/\\])+/, ''))

  if (!filePath.startsWith(dist)) {
    res.statusCode = 403
    res.end('Forbidden')
    return
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) return serveFile(res, filePath)
    return serveFile(res, path.join(dist, 'index.html'), 200)
  })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Happy While Away is running at http://localhost:${port}`)
})
