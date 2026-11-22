import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, PackageSearch, Search } from 'lucide-react'

export default function TrackOrder() {
  const [params] = useSearchParams()
  const [number, setNumber] = useState(params.get('order') || '')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const initial = params.get('order')
    if (initial) lookup(initial, '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function lookup(orderNumber, emailAddress) {
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const query = emailAddress ? `?email=${encodeURIComponent(emailAddress)}` : ''
      const response = await fetch(`/api/orders/${encodeURIComponent(orderNumber.trim())}${query}`)
      const result = await response.json()
      if (!response.ok || !result.order) throw new Error('No order found with that number. Double-check and try again.')
      setOrder(result.order)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!number.trim()) {
      setError('Please enter your order number.')
      return
    }
    lookup(number, email)
  }

  return (
    <section className="section track-section container">
      <div className="page-heading centered-heading">
        <span className="eyebrow">Order lookup</span>
        <h1>Where’s my <em>Sniffari?</em></h1>
        <p>Enter the order number from your confirmation email to see the latest status.</p>
      </div>

      <div className="track-layout">
        <form className="track-form card" onSubmit={handleSubmit}>
          <label htmlFor="order-number">Order number</label>
          <input
            id="order-number"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            placeholder="HWA-2026-12345"
            required
          />
          <label htmlFor="track-email">Email (optional)</label>
          <input
            id="track-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Looking…' : <><Search size={17} /> Track order</>}
          </button>
          {error && <p className="field-error">{error}</p>}
          <p className="track-hint">Order number looks like <strong>HWA-2026-12345</strong>.</p>
        </form>

        <div className="track-result">
          {order ? (
            <div className="card track-card">
              <span className="track-icon"><PackageSearch size={26} /></span>
              <h2>{order.orderNumber}</h2>
              <p>Placed {new Date(order.placedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
              <ol className="timeline">
                {(order.timeline || []).map((step) => (
                  <li key={step.label} className={step.done ? 'is-done' : ''}>
                    <span className="timeline-dot">{step.done && <Check size={12} />}</span>
                    <div><strong>{step.label}</strong><small>{step.detail}</small></div>
                  </li>
                ))}
              </ol>
              <Link to="/contact" className="btn btn-outline btn-small">Question about this order? <ArrowRight size={15} /></Link>
            </div>
          ) : (
            <div className="card track-placeholder">
              <PackageSearch size={40} />
              <h2>Your order status will show up here</h2>
              <p>We will show you where your parcel is and what happens next.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
