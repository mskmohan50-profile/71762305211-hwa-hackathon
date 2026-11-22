import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, ArrowRight, Banknote, CreditCard, Lock, Smartphone, Truck } from 'lucide-react'
import { formatINR } from '../currency.js'
import { PAYMENT_METHODS, SHIPPING } from '../data.js'
import { useShop } from '../store.jsx'

const paymentIcons = { upi: Smartphone, card: CreditCard, cod: Banknote }

const emptyForm = {
  email: '', firstName: '', lastName: '', address: '', apartment: '',
  city: '', state: '', zip: '', country: 'India', phone: '',
  upiId: '', cardName: '', cardNumber: '', expiry: '', cvc: '',
}

function validate(form, paymentMethod) {
  const errors = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address'
  if (!form.firstName.trim()) errors.firstName = 'Required'
  if (!form.lastName.trim()) errors.lastName = 'Required'
  if (!form.address.trim()) errors.address = 'Required'
  if (!form.city.trim()) errors.city = 'Required'
  if (!form.state.trim()) errors.state = 'Required'
  if (!/^\d{6}$/.test(form.zip.trim())) errors.zip = 'Enter a 6-digit PIN code'
  const phoneDigits = form.phone.replace(/\D/g, '')
  if (form.phone.trim() && !/^(91)?[6-9]\d{9}$/.test(phoneDigits)) errors.phone = 'Enter a 10-digit mobile number'
  if (paymentMethod === 'upi' && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(form.upiId.trim())) {
    errors.upiId = 'Enter a valid UPI ID'
  }
  if (paymentMethod === 'card') {
    if (!/^\d{2}\/\d{2,4}$/.test(form.expiry)) errors.expiry = 'Use MM/YY'
    if (!/^\d{3,4}$/.test(form.cvc)) errors.cvc = '3 or 4 digits'
    if (form.cardNumber.replace(/\D/g, '').length < 12) errors.cardNumber = 'Enter a valid card number'
    if (!form.cardName.trim()) errors.cardName = 'Required'
  }
  return errors
}

function formatCard(value) {
  return value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export default function Checkout() {
  const { items, totals, shippingId, setShippingId, clearCart } = useShop()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  if (!items.length) {
    return (
      <section className="section empty-page container">
        <span className="empty-icon"><Truck size={36} /></span>
        <h1>Nothing to check out yet.</h1>
        <p>Add a Sniffari to your bag and we will take it from there.</p>
        <Link to="/product" className="btn btn-primary btn-lg">Shop Sniffari <ArrowRight size={18} /></Link>
      </section>
    )
  }

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const foundErrors = validate(form, paymentMethod)
    setErrors(foundErrors)
    setApiError('')
    if (Object.keys(foundErrors).length) {
      document.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    try {
      const shipping = SHIPPING.find((option) => option.id === shippingId)
      const payload = {
        customer: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          name: `${form.firstName.trim()} ${form.lastName.trim()}`,
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        shipping: {
          line1: form.address.trim(),
          line2: form.apartment.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.zip.trim(),
          country: form.country,
        },
        shippingMethod: shipping.label,
        paymentMethod: PAYMENT_METHODS.find((method) => method.id === paymentMethod)?.label || 'UPI',
        currency: 'INR',
        items: items.map((item) => ({
          id: item.id,
          key: item.key,
          name: item.name,
          variant: item.variant,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        shippingCost: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        totals: {
          subtotal: totals.subtotal,
          discount: totals.discount,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total,
        },
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok || !result.order) throw new Error(result.error || 'Something went wrong. Please try again.')

      clearCart()
      navigate(`/order/${result.orderNumber}`, { state: { order: result.order } })
    } catch (error) {
      setApiError(error.message || 'We could not place your order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const field = (name, label, props = {}) => (
    <div className={`form-field ${props.className || ''}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={(event) => setField(name, props.format ? props.format(event.target.value) : event.target.value)}
        aria-invalid={Boolean(errors[name])}
        {...props.inputProps}
      />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  )

  return (
    <section className="section checkout-section container">
      <div className="page-heading">
        <span className="eyebrow">One last step</span>
        <h1>Checkout</h1>
        <p>This is a demo shop — use any UPI ID or card details. No payment is processed.</p>
      </div>

      <form className="checkout-grid" onSubmit={handleSubmit} noValidate>
        <div className="checkout-form">
          {apiError && <div className="api-error"><AlertCircle size={18} /> {apiError}</div>}

          <fieldset className="form-panel">
            <legend><span className="legend-number">1</span> Contact</legend>
            {field('email', 'Email address', { className: 'field-wide', inputProps: { type: 'email', autoComplete: 'email', placeholder: 'you@example.com' } })}
          </fieldset>

          <fieldset className="form-panel">
            <legend><span className="legend-number">2</span> Delivery address</legend>
            <div className="form-row">
              {field('firstName', 'First name', { inputProps: { autoComplete: 'given-name', placeholder: 'Ananya' } })}
              {field('lastName', 'Last name', { inputProps: { autoComplete: 'family-name', placeholder: 'Sharma' } })}
            </div>
            {field('address', 'Street address', { inputProps: { autoComplete: 'address-line1', placeholder: '12, 4th Cross, Indiranagar' } })}
            {field('apartment', 'Apartment, suite (optional)', { inputProps: { autoComplete: 'address-line2', placeholder: 'Flat 3B' } })}
            <div className="form-row form-row--three">
              {field('city', 'City', { inputProps: { autoComplete: 'address-level2', placeholder: 'Bengaluru' } })}
              {field('state', 'State', { inputProps: { autoComplete: 'address-level1', placeholder: 'Karnataka' } })}
              {field('zip', 'PIN code', { inputProps: { autoComplete: 'postal-code', placeholder: '560038', inputMode: 'numeric' } })}
            </div>
            <div className="form-row">
              {field('country', 'Country', { inputProps: { autoComplete: 'country-name' } })}
              {field('phone', 'Mobile (optional)', { inputProps: { type: 'tel', autoComplete: 'tel', placeholder: '+91 98765 43210' } })}
            </div>
          </fieldset>

          <fieldset className="form-panel">
            <legend><span className="legend-number">3</span> Delivery speed</legend>
            <div className="shipping-options">
              {SHIPPING.map((option) => (
                <label className={`shipping-option ${shippingId === option.id ? 'is-selected' : ''}`} key={option.id}>
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={shippingId === option.id}
                    onChange={() => setShippingId(option.id)}
                  />
                  <Truck size={20} />
                  <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                  <b>{option.price === 0 ? 'Free' : formatINR(option.price)}</b>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="form-panel">
            <legend><span className="legend-number">4</span> Payment <span className="legend-note"><Lock size={13} /> Demo only</span></legend>
            <div className="shipping-options payment-methods">
              {PAYMENT_METHODS.map((method) => {
                const Icon = paymentIcons[method.id]
                return (
                  <label className={`shipping-option ${paymentMethod === method.id ? 'is-selected' : ''}`} key={method.id}>
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => { setPaymentMethod(method.id); setErrors({}) }}
                    />
                    <Icon size={20} />
                    <span><strong>{method.label}</strong><small>{method.detail}</small></span>
                    <b>{method.tag}</b>
                  </label>
                )
              })}
            </div>

            {paymentMethod === 'upi' && (
              <div className="payment-fields">
                {field('upiId', 'UPI ID', { className: 'field-wide', inputProps: { autoComplete: 'off', placeholder: 'ananya@okhdfcbank', inputMode: 'email' } })}
                <p className="payment-note"><Smartphone size={15} /> Demo only: use any UPI ID. No payment request is sent.</p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="payment-fields">
                {field('cardName', 'Name on card', { className: 'field-wide', inputProps: { autoComplete: 'cc-name', placeholder: 'Ananya Sharma' } })}
                {field('cardNumber', 'Card number', {
                  className: 'field-wide',
                  format: formatCard,
                  inputProps: { inputMode: 'numeric', autoComplete: 'cc-number', placeholder: '4242 4242 4242 4242' },
                })}
                <div className="form-row">
                  {field('expiry', 'Expiry', { format: formatExpiry, inputProps: { inputMode: 'numeric', autoComplete: 'cc-exp', placeholder: 'MM/YY' } })}
                  {field('cvc', 'Security code', { inputProps: { inputMode: 'numeric', autoComplete: 'cc-csc', placeholder: '123' } })}
                </div>
                <p className="payment-note"><CreditCard size={15} /> Demo only: enter any card values. Nothing is charged or stored.</p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <p className="payment-note payment-note--cod"><Banknote size={15} /> Pay {formatINR(totals.total)} in cash when the courier arrives. No extra fee.</p>
            )}
          </fieldset>

          <button type="submit" className="btn btn-primary btn-block btn-lg place-order" disabled={submitting}>
            {submitting ? 'Placing your order…' : `Place order — ${formatINR(totals.total)}`}
            {!submitting && <ArrowRight size={18} />}
          </button>
          <Link to="/cart" className="continue-link"><ArrowLeft size={15} /> Back to bag</Link>
        </div>

        <aside className="summary-card checkout-summary">
          <h2>Your order</h2>
          <div className="checkout-items">
            {items.map((item) => (
              <div className="checkout-item" key={item.key}>
                <img src={item.image} alt="" />
                <div><strong>{item.name}</strong><small>{item.variant || 'Add-on'}</small><small>Qty {item.quantity}</small></div>
                <span>{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <dl className="summary-lines">
            <div><dt>Subtotal</dt><dd>{formatINR(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="discount-line"><dt>Discount</dt><dd>−{formatINR(totals.discount)}</dd></div>}
            <div><dt>Delivery</dt><dd>{totals.shipping === 0 ? 'Free' : formatINR(totals.shipping)}</dd></div>
            <div><dt>GST (18%) included</dt><dd>{formatINR(totals.tax)}</dd></div>
          </dl>
          <div className="summary-total"><span>Total</span><strong>{formatINR(totals.total)}</strong></div>
          <p className="summary-secure"><Lock size={13} /> Demo checkout — no real payment taken</p>
        </aside>
      </form>
    </section>
  )
}
