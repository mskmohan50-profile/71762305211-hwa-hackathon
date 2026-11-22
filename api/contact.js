import { applyCors, makeId, noContent, readBody, sendJson } from './http-utils.js'

export default async function contactHandler(req, res) {
  const method = String(req?.method || 'GET').toUpperCase()
  applyCors(res)
  if (method === 'OPTIONS') return noContent(res)
  if (method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Method not allowed' })

  const body = await readBody(req)
  const email = String(body?.email || '').trim()
  const message = String(body?.message || '').trim()
  if (!email.includes('@') || message.length < 4) {
    return sendJson(res, 400, { ok: false, error: 'Please add a valid email and a short message.' })
  }

  return sendJson(res, 200, {
    ok: true,
    success: true,
    ticket: makeId('MSG'),
    message: 'Thanks for reaching out. We reply to every note within one business day.',
  })
}
