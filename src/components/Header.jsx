import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useShop } from '../store.jsx'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/product', label: 'The Sniffari' },
  { to: '/#how', label: 'How it works' },
  { to: '/faq', label: 'FAQ' },
  { to: '/track', label: 'Track order' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { totals } = useShop()
  const location = useLocation()

  return (
    <header className="site-header">
      <div className="announcement">
        <span>Free delivery across India</span>
        <span className="announcement-dot">·</span>
        <span>GST invoice · 7-day returns</span>
      </div>
      <div className="nav-wrap">
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="Happy While Away home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="28" height="28">
              <ellipse cx="32" cy="41" rx="12" ry="10" fill="currentColor" />
              <ellipse cx="18" cy="27" rx="5" ry="7" transform="rotate(-18 18 27)" fill="currentColor" />
              <ellipse cx="28" cy="19" rx="5" ry="7" transform="rotate(-6 28 19)" fill="currentColor" />
              <ellipse cx="39" cy="19" rx="5" ry="7" transform="rotate(8 39 19)" fill="currentColor" />
              <ellipse cx="49" cy="28" rx="5" ry="7" transform="rotate(20 49 28)" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-text">
            <strong>happy while away</strong>
            <small>good dogs, good days</small>
          </span>
        </Link>

        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.map((link) =>
            link.to.includes('#') ? (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ),
          )}
          <Link to="/contact" className="nav-contact" onClick={() => setOpen(false)}>
            Contact
          </Link>
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-button" aria-label={`Shopping bag with ${totals.itemCount} items`}>
            <ShoppingBag size={20} strokeWidth={1.9} />
            <span className="cart-count">{totals.itemCount}</span>
            <span className="cart-label">Bag</span>
          </Link>
          <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {location.pathname === '/product' && <div className="nav-shadow" />}
    </header>
  )
}
