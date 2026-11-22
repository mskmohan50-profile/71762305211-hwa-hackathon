import { applyCors, makeId, noContent, readBody, sendJson } from './http-utils.js'
import { getOrder, saveOrder } from './store.js'

function pathOf(req) {
  let url = String(req?.url || '/')
  try {
    url = new URL(url, 'http://localhost').pathname
  } catch {
    url = url.split('?')[0]
  }
  return url.replace(/^\/api/, '') || '/'
}

function asNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function pick(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '') ?? ''
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return []
  return items.map((item) => {
    const price = asNumber(pick(item?.price, item?.unitPrice, item?.amount), 0)
    const quantity = Math.max(1, Math.floor(asNumber(pick(item?.quantity, item?.qty), 1)))
    const variant = pick(item?.variant, [item?.size, item?.color].filter(Boolean).join(' / '))
    return {
      id: String(pick(item?.id, item?.productId, 'sniffari')),
      key: pick(item?.key) || undefined,
      name: String(pick(item?.name, item?.title, 'Sniffari')),
      variant: String(variant),
      price,
      quantity,
      lineTotal: Math.round(price * quantity * 100) / 100,
      image: pick(item?.image) || undefined,
    }
  })
}

function findEmail(body, ...groups) {
  for (const group of [body, ...groups]) {
    const email = pick(group?.email, group?.emailAddress)
    if (email) return String(email)
  }
  return ''
}

function dateAfter(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function createOrder(body) {
  const customerGroup = pick(body.customer, body.shipping, body.contact, {}) || {}
  const addressGroup = pick(body.shippingAddress, body.address, body.shipping, {}) || {}
  const contactGroup = pick(body.contact, body.customer, {}) || {}

  const items = normalizeItems(pick(body.items, body.cart, body.products, []))
  const subtotalRaw = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const discount = Math.max(0, asNumber(pick(body.discount, body?.totals?.discount), 0))
  const shippingCost = Math.max(0, asNumber(pick(body.shippingCost, body?.totals?.shipping), 0))
  const tax = Math.max(0, asNumber(pick(body.tax, body?.totals?.tax), 0))
  const totals = body.totals && typeof body.totals === 'object' ? body.totals : {}
  const subtotal = Math.round(asNumber(pick(body.subtotal, totals.subtotal), subtotalRaw) * 100) / 100
  // GST is included in the listed prices, so it is not added to the payable total.
  const total = Math.round(asNumber(pick(body.total, totals.total), subtotal - discount + shippingCost) * 100) / 100
  const orderNumber = makeId('HWA')
  const placedAt = new Date().toISOString()
  const shippingMethod = pick(body.shippingMethod, body.deliveryMethod, 'standard') || 'standard'
  const express = String(shippingMethod).toLowerCase().includes('express')

  return {
    id: orderNumber,
    orderNumber,
    status: 'confirmed',
    placedAt,
    estimatedDelivery: dateAfter(express ? 2 : 5),
    email: findEmail(body, customerGroup, contactGroup),
    customer: {
      firstName: pick(contactGroup.firstName, customerGroup.firstName, body.firstName),
      lastName: pick(contactGroup.lastName, customerGroup.lastName, body.lastName),
      name: pick(customerGroup.name, contactGroup.name, body.name, [contactGroup.firstName, contactGroup.lastName].filter(Boolean).join(' ')),
      email: findEmail(body, customerGroup, contactGroup),
      phone: pick(customerGroup.phone, contactGroup.phone, body.phone),
    },
    shippingAddress: {
      line1: pick(addressGroup.line1, addressGroup.address, addressGroup.street, body.address),
      line2: pick(addressGroup.line2, addressGroup.apartment, body.apartment),
      city: pick(addressGroup.city, body.city),
      state: pick(addressGroup.state, addressGroup.region, body.state),
      postalCode: pick(addressGroup.postalCode, addressGroup.zip, body.zip),
      country: pick(addressGroup.country, body.country, 'India'),
    },
    shippingMethod,
    paymentMethod: pick(body.paymentMethod, body.payment, 'UPI'),
    currency: pick(body.currency, 'INR'),
    items,
    totals: { subtotal, discount, shipping: shippingCost, tax, total },
    subtotal,
    discount,
    shipping: shippingCost,
    tax,
    total,
    timeline: [
      { label: 'Order placed', detail: 'We have your order', at: placedAt, done: true },
      { label: 'Getting it ready', detail: 'Packed with care in our Bengaluru studio', at: null, done: false },
      { label: 'On its way', detail: 'Tracking details emailed to you', at: null, done: false },
      { label: 'Delivered', detail: 'Let the sniffing begin', at: null, done: false },
    ],
  }
}

export default async function ordersHandler(req, res) {
  const method = String(req?.method || 'GET').toUpperCase()
  applyCors(res)

  if (method === 'OPTIONS') return noContent(res)
  const path = pathOf(req)

  if (method === 'GET') {
    const params = req.query || {}
    const number = pick(params.number, params.id, params.orderNumber, path.split('/').filter(Boolean).pop())
    const order = getOrder(number)
    if (!order) return sendJson(res, 404, { ok: false, error: 'Order not found' })
    return sendJson(res, 200, { ok: true, order, orderNumber: order.orderNumber })
  }

  if (method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Method not allowed' })

  const body = await readBody(req)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return sendJson(res, 400, { ok: false, error: 'A JSON order object is required' })
  }

  const order = createOrder(body)
  saveOrder(order)
  return sendJson(res, 201, {
    ok: true,
    success: true,
    order,
    orderNumber: order.orderNumber,
    id: order.orderNumber,
  })
}
