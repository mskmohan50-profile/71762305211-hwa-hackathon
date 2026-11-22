import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PROMO_CODES, SHIPPING, TAX_RATE } from './data.js'

const ShopContext = createContext(null)

const CART_KEY = 'hwa-cart-inr-v1'
const PROMO_KEY = 'hwa-promo-inr-v1'

function initialCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function ShopProvider({ children }) {
  const [items, setItems] = useState(initialCart)
  const [promoInput, setPromoInput] = useState('')
  const [promoCode, setPromoCode] = useState(() => localStorage.getItem(PROMO_KEY) || '')
  const [shippingId, setShippingId] = useState('standard')
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (promoCode) localStorage.setItem(PROMO_KEY, promoCode)
    else localStorage.removeItem(PROMO_KEY)
  }, [promoCode])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, message, type }])
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3600)
  }, [])

  const addItem = useCallback((item, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.key === item.key)
      if (existing) {
        return current.map((entry) =>
          entry.key === item.key ? { ...entry, quantity: entry.quantity + quantity } : entry,
        )
      }
      return [...current, { ...item, quantity }]
    })
    showToast(`${item.name} added to your bag`)
  }, [showToast])

  const updateQuantity = useCallback((key, quantity) => {
    setItems((current) =>
      quantity < 1
        ? current.filter((entry) => entry.key !== key)
        : current.map((entry) => (entry.key === key ? { ...entry, quantity } : entry)),
    )
  }, [])

  const removeItem = useCallback((key) => {
    setItems((current) => current.filter((entry) => entry.key !== key))
    showToast('Removed from your bag', 'info')
  }, [showToast])

  const clearCart = useCallback(() => {
    setItems([])
    setPromoCode('')
    setPromoInput('')
  }, [])

  const applyPromo = useCallback((code) => {
    const normalised = String(code || '').trim().toUpperCase()
    if (PROMO_CODES[normalised]) {
      setPromoCode(normalised)
      showToast(`${normalised} applied — nice one!`)
      return true
    }
    showToast('That code is not valid', 'error')
    return false
  }, [showToast])

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discountRate = PROMO_CODES[promoCode] || 0
    const discount = Math.round(subtotal * discountRate)
    const shipping = SHIPPING.find((option) => option.id === shippingId)?.price || 0
    const taxable = Math.max(0, subtotal - discount)
    // Prices are GST-inclusive, so this is the GST already contained in the price.
    const tax = Math.round((taxable * TAX_RATE) / (1 + TAX_RATE))
    const total = taxable + shipping
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return { subtotal, discount, shipping, tax, total, itemCount, discountRate }
  }, [items, promoCode, shippingId])

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    promoInput,
    setPromoInput,
    promoCode,
    setPromoCode,
    applyPromo,
    shippingId,
    setShippingId,
    totals,
    toasts,
    showToast,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used inside ShopProvider')
  return context
}
