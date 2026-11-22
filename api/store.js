import fs from 'node:fs'
import path from 'node:path'

// Orders live in memory so the endpoint works on serverless platforms.
// Locally we also mirror them to a file so they survive a restart.
const globalKey = '__HWA_ORDER_STORE__'
const store = globalThis[globalKey] || (globalThis[globalKey] = new Map())
const dataDir = path.join(process.cwd(), '.data')
const dataFile = path.join(dataDir, 'orders.json')

function hydrate() {
  if (store.size) return
  try {
    const saved = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
    if (Array.isArray(saved)) saved.forEach((order) => order?.orderNumber && store.set(order.orderNumber, order))
  } catch {
    // No local file yet (or running on Vercel) — memory store is enough.
  }
}

function persist() {
  try {
    fs.mkdirSync(dataDir, { recursive: true })
    fs.writeFileSync(dataFile, JSON.stringify([...store.values()], null, 2))
  } catch {
    // Read-only filesystem on serverless — ignore.
  }
}

export function saveOrder(order) {
  hydrate()
  store.set(order.orderNumber, order)
  persist()
  return order
}

export function getOrder(number) {
  hydrate()
  if (!number) return null
  return store.get(String(number).trim().toUpperCase()) || null
}
