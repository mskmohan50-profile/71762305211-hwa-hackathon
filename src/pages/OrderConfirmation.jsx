import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowRight, Check, CheckCircle2, Mail, PackageCheck } from 'lucide-react'
import { formatINR } from '../currency.js'

export default function OrderConfirmation() {
  const { orderNumber } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!order)
  const [error, setError] = useState('')

  useEffect(() => {
    if (order) return
    fetch(`/api/orders/${encodeURIComponent(orderNumber)}`)
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) throw new Error(result.error || 'Order not found')
        setOrder(result.order)
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false))
  }, [orderNumber, order])

  if (loading) return <section className="section container"><p className="loading-note">Finding your order…</p></section>

  if (error || !order) {
    return (
      <section className="section empty-page container">
        <span className="empty-icon"><PackageCheck size={36} /></span>
        <h1>We couldn’t find that order.</h1>
        <p>{error || 'Check the order number and try again.'}</p>
        <Link to="/track" className="btn btn-primary btn-lg">Track an order <ArrowRight size={18} /></Link>
      </section>
    )
  }

  const deliveryDate = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <section className="section confirmation-section container">
      <div className="confirmation-hero">
        <div className="confirmation-check"><CheckCircle2 size={44} /></div>
        <span className="eyebrow">Order confirmed</span>
        <h1>Thank you. <em>Good things are coming.</em></h1>
        <p>We’ve sent the details to <strong>{order.email || 'your email'}</strong>. Your Sniffari is being packed with care.</p>
        <div className="order-number-pill">Order {order.orderNumber}</div>
      </div>

      <div className="confirmation-grid">
        <div className="confirmation-main">
          <div className="confirmation-card">
            <div className="card-heading"><h2>What’s on the way</h2><span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span></div>
            {order.items.map((item, index) => (
              <div className="confirm-item" key={`${item.id}-${index}`}>
                <img src={item.image || '/images/sniffari-product.jpg'} alt="" />
                <div><strong>{item.name}</strong>{item.variant && <small>{item.variant}</small>}<small>Quantity {item.quantity}</small></div>
                <span>{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="confirm-totals">
              <div><span>Subtotal</span><span>{formatINR(order.totals.subtotal)}</span></div>
              {Number(order.totals.discount) > 0 && <div className="discount-line"><span>Discount</span><span>−{formatINR(order.totals.discount)}</span></div>}
              <div><span>Delivery</span><span>{Number(order.totals.shipping) === 0 ? 'Free' : formatINR(order.totals.shipping)}</span></div>
              <div><span>GST (18%) included</span><span>{formatINR(order.totals.tax)}</span></div>
              <div className="grand"><span>Order total</span><strong>{formatINR(order.totals.total)}</strong></div>
            </div>
          </div>

          <div className="confirmation-card">
            <h2>Where it’s going</h2>
            <p className="address">
              {order.customer.name || [order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ')}<br />
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
              {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postalCode].filter(Boolean).join(', ')}<br />
              {order.shippingAddress.country}
            </p>
            <p className="delivery-note"><Check size={16} /> {order.shippingMethod} · estimated delivery {deliveryDate || 'soon'}</p>
            <p className="delivery-note"><Check size={16} /> Paid via {order.paymentMethod || 'UPI'} · GST invoice emailed</p>
          </div>
        </div>

        <aside className="confirmation-side">
          <div className="confirmation-card">
            <h2>Order status</h2>
            <ol className="timeline">
              {(order.timeline || []).map((step, index) => (
                <li key={step.label} className={step.done ? 'is-done' : ''}>
                  <span className="timeline-dot">{step.done && <Check size={12} />}</span>
                  <div><strong>{step.label}</strong><small>{step.detail}</small></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="confirmation-card help-card">
            <Mail size={22} />
            <h3>Need to change something?</h3>
            <p>Email us within 24 hours and we’ll do our best to adjust your order before it ships.</p>
            <Link to="/contact" className="btn btn-outline btn-block">Contact us</Link>
          </div>
        </aside>
      </div>

      <div className="confirmation-actions">
        <Link to="/product" className="btn btn-primary">Keep exploring <ArrowRight size={18} /></Link>
        <Link to={`/track?order=${order.orderNumber}`} className="btn btn-outline">Track this order</Link>
      </div>
    </section>
  )
}
