import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'Product question', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [response, setResponse] = useState('')

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = {}
    if (!form.name.trim()) found.name = 'Please tell us your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) found.email = 'Enter a valid email'
    if (form.message.trim().length < 8) found.message = 'A little more detail, please'
    setErrors(found)
    if (Object.keys(found).length) return

    setSending(true)
    try {
      const result = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await result.json()
      if (!result.ok) throw new Error(data.error || 'Please try again')
      setResponse(data.message)
      setSent(true)
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section contact-section container">
      <div className="page-heading centered-heading">
        <span className="eyebrow">We’re all ears</span>
        <h1>Say <em>hello.</em></h1>
        <p>Questions about your dog, an order, or whether Mini is right for a corgi? Ask away.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info card">
          <span className="contact-icon"><Mail size={26} /></span>
          <h2>We usually reply within one business day.</h2>
          <p>Our small team is based in Bengaluru, India. We answer every message ourselves — no chatbots, no ticket maze.</p>
          <div className="contact-detail"><strong>Email</strong><span>care@happywhileaway.in</span></div>
          <div className="contact-detail"><strong>Hours</strong><span>Mon–Sat, 10am–6pm IST</span></div>
          <div className="contact-detail"><strong>Orders</strong><span>Include your order number for a faster answer.</span></div>
          <Link to="/faq" className="btn btn-outline">Browse the FAQ <ArrowRight size={16} /></Link>
        </div>

        <div className="card contact-form-card">
          {sent ? (
            <div className="contact-success">
              <CheckCircle2 size={44} />
              <h2>Message received.</h2>
              <p>{response}</p>
              <button type="button" className="btn btn-outline" onClick={() => { setSent(false); setForm({ name: '', email: '', topic: 'Product question', message: '' }) }}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="contact-name">Your name</label>
                  <input id="contact-name" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Ananya" />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="contact-email">Email</label>
                  <input id="contact-email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="you@example.com" />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="contact-topic">What’s it about?</label>
                <select id="contact-topic" value={form.topic} onChange={(e) => setField('topic', e.target.value)}>
                  <option>Product question</option>
                  <option>My order</option>
                  <option>Returns & refunds</option>
                  <option>Something else</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="contact-message">Your message</label>
                <textarea id="contact-message" rows="5" value={form.message} onChange={(e) => setField('message', e.target.value)} placeholder="Tell us what’s on your mind…" />
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>
              {errors.submit && <p className="field-error">{errors.submit}</p>}
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={sending}>
                {sending ? 'Sending…' : <>Send message <ArrowRight size={18} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
