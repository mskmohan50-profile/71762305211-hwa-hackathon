import { applyCors, noContent, sendJson } from './http-utils.js'
import ordersHandler from './orders.js'
import contactHandler from './contact.js'

export default async function handleApi(req, res, next) {
  applyCors(res)
  const method = String(req?.method || 'GET').toUpperCase()
  if (method === 'OPTIONS') return noContent(res)

  let path = String(req?.url || '/').split('?')[0]
  path = path.replace(/^\/api/, '') || '/'

  if (path === '/health' && method === 'GET') {
    return sendJson(res, 200, { ok: true, service: 'happy-while-away', time: new Date().toISOString() })
  }
  if (path === '/orders' || path.startsWith('/orders/')) return ordersHandler(req, res)
  if (path === '/contact' && method === 'POST') return contactHandler(req, res)

  if (typeof next === 'function') return next()
  return sendJson(res, 404, { ok: false, error: 'Endpoint not found' })
}
