// Small helpers shared by the local dev server, Vite middleware and Vercel functions.

function parseMaybeJson(value) {
  if (value === undefined || value === null || value === '') return {}
  if (typeof value === 'object') return value
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export async function readBody(req) {
  if (req.body !== undefined && req.body !== null) return parseMaybeJson(req.body)
  return await new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 1_000_000) req.destroy()
    })
    req.on('end', () => resolve(parseMaybeJson(raw)))
    req.on('error', () => resolve({}))
  })
}

export function applyCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store')
}

export function sendJson(res, status, payload) {
  applyCors(res)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

export function noContent(res) {
  applyCors(res)
  res.statusCode = 204
  res.end()
}

export function makeId(prefix = 'HWA') {
  const year = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000)
  return `${prefix}-${year}-${random}`
}
