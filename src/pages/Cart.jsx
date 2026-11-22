import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Tag, Trash2 } from 'lucide-react'
import { QtyStepper } from '../components/ui.jsx'
import { formatINR } from '../currency.js'
import { useShop } from '../store.jsx'

export default function Cart() {
  const {
    items, updateQuantity, removeItem, totals,
    promoInput, setPromoInput, applyPromo, promoCode, setPromoCode,
  } = useShop()

  function handlePromo(event) {
    event.preventDefault()
    applyPromo(promoInput)
  }

  if (!items.length) {
    return (
      <section className="section empty-page container">
        <span className="empty-icon"><ShoppingBag size={36} /></span>
        <h1>Your bag is taking a nap.</h1>
        <p>Nothing in here yet. Sniffari would love to change that.</p>
        <Link to="/product" className="btn btn-primary btn-lg">Meet Sniffari <ArrowRight size={18} /></Link>
      </section>
    )
  }

  return (
    <section className="section cart-section container">
      <div className="page-heading">
        <span className="eyebrow">Almost there</span>
        <h1>Your bag <em>({totals.itemCount})</em></h1>
      </div>

      <div className="cart-grid">
        <div className="cart-items">
          <div className="cart-labels"><span>Product</span><span>Quantity</span><span>Total</span></div>
          {items.map((item) => (
            <article className="cart-item" key={item.key}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <Link to="/product"><h2>{item.name}</h2></Link>
                {item.variant && <p>{item.variant}</p>}
                <span className="cart-unit">{formatINR(item.price)} each</span>
                <button type="button" className="remove-link" onClick={() => removeItem(item.key)}>
                  <Trash2 size={14} /> Remove
                </button>
              </div>
              <QtyStepper value={item.quantity} onChange={(value) => updateQuantity(item.key, value)} label={`Quantity for ${item.name}`} />
              <strong className="cart-line-total">{formatINR(item.price * item.quantity)}</strong>
            </article>
          ))}

          <Link to="/product" className="continue-link">← Keep browsing</Link>
        </div>

        <aside className="summary-card">
          <h2>Order summary</h2>
          <dl className="summary-lines">
            <div><dt>Subtotal</dt><dd>{formatINR(totals.subtotal)}</dd></div>
            {totals.discount > 0 && (
              <div className="discount-line"><dt>Discount {promoCode && <span>({promoCode})</span>}</dt><dd>−{formatINR(totals.discount)}</dd></div>
            )}
            <div><dt>Delivery</dt><dd>{totals.shipping === 0 ? 'Free' : formatINR(totals.shipping)}</dd></div>
            <div><dt>GST (18%) included</dt><dd>{formatINR(totals.tax)}</dd></div>
          </dl>
          <div className="summary-total"><span>Total</span><strong>{formatINR(totals.total)}</strong></div>

          <form className="promo-form" onSubmit={handlePromo}>
            <label htmlFor="promo"><Tag size={16} /> Have a code?</label>
            <div className="promo-row">
              <input
                id="promo"
                value={promoInput}
                onChange={(event) => setPromoInput(event.target.value)}
                placeholder="Enter code"
                disabled={Boolean(promoCode)}
              />
              <button type="submit" disabled={Boolean(promoCode)}>{promoCode ? 'Applied' : 'Apply'}</button>
            </div>
            {promoCode && <button type="button" className="promo-remove" onClick={() => { setPromoCode(''); setPromoInput('') }}>Remove code</button>}
            <small className="promo-hint">Try <strong>NOSEWORK10</strong> for 10% off.</small>
          </form>

          <Link to="/checkout" className="btn btn-primary btn-block btn-lg">Checkout <ArrowRight size={18} /></Link>
          <p className="summary-secure">Secure demo checkout · UPI, cards & COD · no real payment is taken</p>
        </aside>
      </div>
    </section>
  )
}
