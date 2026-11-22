import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [signedUp, setSignedUp] = useState(false)

  function handleSubscribe(event) {
    event.preventDefault()
    if (email.includes('@')) setSignedUp(true)
  }

  return (
    <footer className="site-footer">
      <div className="footer-top container">
        <div className="footer-intro">
          <div className="footer-brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 64 64" width="24" height="24">
                <ellipse cx="32" cy="41" rx="12" ry="10" fill="currentColor" />
                <ellipse cx="18" cy="27" rx="5" ry="7" transform="rotate(-18 18 27)" fill="currentColor" />
                <ellipse cx="28" cy="19" rx="5" ry="7" transform="rotate(-6 28 19)" fill="currentColor" />
                <ellipse cx="39" cy="19" rx="5" ry="7" transform="rotate(8 39 19)" fill="currentColor" />
                <ellipse cx="49" cy="28" rx="5" ry="7" transform="rotate(20 49 28)" fill="currentColor" />
              </svg>
            </span>
            <span>happy while away</span>
          </div>
          <h2>A calmer goodbye. A happier hello.</h2>
          <p>Notes on dog enrichment, quiet company and the little inventions that make alone-time better. No spam, ever.</p>
        </div>
        <div className="footer-signup">
          {signedUp ? (
            <div className="signup-success"><Check size={20} /> You’re on the list. Say hello to your dog from us.</div>
          ) : (
            <form onSubmit={handleSubscribe} className="signup-form">
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" aria-label="Subscribe"><ArrowRight size={20} /></button>
            </form>
          )}
          <small>Join 12,000+ people who care a little too much about their dogs.</small>
        </div>
      </div>

      <div className="footer-bottom container">
        <div className="footer-column footer-about">
          <p className="footer-wordmark">HAPPY WHILE AWAY</p>
          <p>We make quiet, clever things that keep dogs busy while their people are out living life.</p>
          <p className="footer-note">Designed and made in India. Assembled in Bengaluru.</p>
        </div>
        <div className="footer-column">
          <h3>Shop</h3>
          <Link to="/product">Sniffari</Link>
          <Link to="/product#extras">Scent refills</Link>
          <Link to="/cart">Your bag</Link>
        </div>
        <div className="footer-column">
          <h3>Help</h3>
          <Link to="/faq">FAQ</Link>
          <Link to="/track">Track an order</Link>
          <Link to="/contact">Contact us</Link>
        </div>
        <div className="footer-column">
          <h3>Good to know</h3>
          <Link to="/#how">How it works</Link>
          <Link to="/faq#shipping">Shipping & returns</Link>
          <Link to="/faq#safety">Safety first</Link>
        </div>
      </div>
      <div className="footer-legal container">
        <span>© {new Date().getFullYear()} Happy While Away. All paws reserved.</span>
        <span>Demo storefront · all prices in INR, inclusive of GST · no real payments processed.</span>
      </div>
    </footer>
  )
}
