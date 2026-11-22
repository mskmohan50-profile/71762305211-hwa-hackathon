import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import handleApi from './api/index.js'

function localApi() {
  return {
    name: 'happy-while-away-local-api',
    configureServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        req.url = req.url || '/'
        handleApi(req, res, next).catch((error) => {
          console.error('[api]', error)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'Internal server error' }))
          }
        })
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        req.url = req.url || '/'
        handleApi(req, res, next).catch((error) => {
          console.error('[api]', error)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'Internal server error' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localApi()],
  server: { host: '0.0.0.0' },
  preview: { host: '0.0.0.0' },
})
