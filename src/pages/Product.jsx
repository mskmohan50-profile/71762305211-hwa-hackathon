import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, CreditCard, MapPin, Package, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { Accordion, QtyStepper, Stars } from '../components/ui.jsx'
import { formatINR } from '../currency.js'
import { useShop } from '../store.jsx'
import { COLORS, PRODUCTS, REVIEWS, SIZES } from '../data.js'

const gallery = [
  { src: '/images/sniffari-product.jpg', alt: 'A dog exploring a green enrichment feeder filled with treats' },
  { src: '/images/hero-dog.jpg', alt: 'A dog following a scent trail across the floor at home' },
  { src: '/images/sniffari-lifestyle.jpg', alt: 'A corgi waiting beside a food puzzle toy' },
  { src: '/images/dog-food.jpg', alt: 'A dog investigating real food' },
]

const details = [
  {
    q: 'What arrives in the box',
    a: 'One Sniffari toy, six reusable treat pods, a starter pack of three botanical scent sachets (sleepy lavender, bacon & apple, and peanut), a USB-C cable, a quick-start guide and a little card with our phone number on it. The optional app is a free download, not a requirement.',
  },
  {
    q: 'How the adaptive challenge works',
    a: 'Each pocket has a tiny sensor. When a treat is found, the toy notes how long it took. Quick finds mean the next reset hides treats a little deeper and comes sooner; slower finds mean it eases off. The goal is a dog who is working, not struggling.',
  },
  {
    q: 'Safety & care',
    a: 'Designed for supervised introduction and then independent play. Soft rounded shell, food-safe silicone bumper, no loose small parts and no laser. Use only small dry treats. Unclip and machine-wash the cover cold on a gentle cycle; wipe the inner shell with a damp cloth.',
  },
  {
    q: 'Delivery, GST & returns',
    a: 'Free standard delivery across India in 3–5 working days, or express delivery in 1–2 working days for ₹149. Every order ships from Bengaluru with a GST invoice and tracking link. If your dog is not smitten, request a return within 7 days of delivery for a full refund — we arrange the pickup.',
  },
]

const specs = [
  ['MRP', 'Mini ₹4,999 · Original ₹5,999 (incl. 18% GST)'],
  ['Dimensions', 'Mini 32 × 11 cm · Original 40 × 12 cm'],
  ['Weight', 'Mini 680 g · Original 950 g'],
  ['Materials', 'Food-safe ABS shell, replaceable polyester-felt cover, silicone bumper'],
  ['Mechanism', 'Geared 6 V DC motor, 10 optical pocket sensors, < 35 dB operation'],
  ['Reset interval', '90 seconds by default, adjustable 30–300 seconds'],
  ['Battery', '2600 mAh Li-ion, USB-C, about 4 hours of play per charge'],
  ['Safety', 'Rounded edges, enclosed treat pods, no loose small parts, BIS / CE tested'],
  ['In the box', 'Sniffari, 6 treat pods, 3 scent sachets, USB-C cable, quick-start guide'],
  ['Country of origin', 'India · assembled and tested in Bengaluru'],
  ['Warranty', '2-year replacement warranty · 7-day returns'],
]

export default function Product() {
  const [size, setSize] = useState('original')
  const [color, setColor] = useState('moss')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const { addItem } = useShop()

  const selectedSize = SIZES.find((option) => option.id === size)
  const selectedColor = COLORS.find((option) => option.id === color)
  const price = selectedSize.price

  function handleAddToCart() {
    addItem(
      {
        key: `sniffari-${size}-${color}`,
        id: 'sniffari',
        name: 'Sniffari',
        variant: `${selectedSize.label} · ${selectedColor.label}`,
        size,
        color,
        price,
        image: '/images/sniffari-product.jpg',
      },
      quantity,
    )
  }

  return (
    <>
      <div className="breadcrumb container">
        <Link to="/">Home</Link><span>/</span><span>Sniffari</span>
      </div>

      <section className="product-section container">
        <div className="product-gallery">
          <div className="product-main-image">
            <img src={gallery[activeImage].src} alt={gallery[activeImage].alt} />
            <span className="gallery-badge">Best seller</span>
          </div>
          <div className="product-thumbs" role="tablist" aria-label="Product images">
            {gallery.map((image, index) => (
              <button
                key={image.src}
                type="button"
                role="tab"
                aria-selected={activeImage === index}
                className={activeImage === index ? 'is-active' : ''}
                onClick={() => setActiveImage(index)}
              >
                <img src={image.src} alt={image.alt} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info">
          <span className="eyebrow">The original nose-led adventure</span>
          <h1>Sniffari</h1>
          <div className="product-rating"><Stars rating={5} count={680} /> <span>·</span> <span>In stock &amp; ready to ship</span></div>
          <p className="product-lede">
            A self-resetting scent playground that keeps your dog happily busy for hours —
            no phone required, no novelty wear-off, no chewed shoes.
          </p>
          <div className="product-price">
            <span>{formatINR(price)}</span>
            <small>MRP incl. 18% GST · or 3 interest-free EMIs from {formatINR(Math.ceil(price / 3))}</small>
          </div>

          <div className="option-group">
            <div className="option-label"><span>Size</span><strong>{selectedSize.label}</strong></div>
            <div className="option-row">
              {SIZES.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={`option-button ${size === option.id ? 'is-selected' : ''}`}
                  onClick={() => setSize(option.id)}
                  aria-pressed={size === option.id}
                >
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                  <span>{formatINR(option.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <div className="option-label"><span>Colour</span><strong>{selectedColor.label}</strong></div>
            <div className="color-row">
              {COLORS.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={`color-swatch ${color === option.id ? 'is-selected' : ''}`}
                  style={{ '--swatch': option.hex }}
                  onClick={() => setColor(option.id)}
                  aria-label={`${option.label} colour`}
                  aria-pressed={color === option.id}
                  title={option.label}
                >
                  {color === option.id && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="buy-row">
            <QtyStepper value={quantity} onChange={setQuantity} />
            <button type="button" className="btn btn-primary btn-block" onClick={handleAddToCart}>
              Add to bag — {formatINR(price * quantity)}
            </button>
          </div>
          <Link to="/cart" className="btn btn-outline btn-block">View bag</Link>

          <div className="product-assurances">
            <span><Truck size={18} /> Free delivery across India</span>
            <span><RotateCcw size={18} /> 7-day returns</span>
            <span><ShieldCheck size={18} /> 2-year warranty</span>
            <span><CreditCard size={18} /> UPI, cards & COD</span>
            <span><MapPin size={18} /> Ships from Bengaluru</span>
          </div>
        </div>
      </section>

      <section className="section product-details">
        <div className="container details-grid">
          <div>
            <span className="eyebrow">The details</span>
            <h2>Everything worth<br /><em>knowing first.</em></h2>
            <p>Still deciding? These are the questions we answer most often in our inbox.</p>
            <div className="detail-icons">
              <div><Package size={22} /><span>7-day returns</span></div>
              <div><ShieldCheck size={22} /><span>2-year warranty</span></div>
              <div><Check size={22} /><span>No app needed</span></div>
            </div>
          </div>
          <Accordion items={details} initialOpen={0} />
        </div>
      </section>

      <section className="section specs-section">
        <div className="container specs-grid">
          <div className="specs-copy">
            <span className="eyebrow">Made, not imagined</span>
            <h2>A real product,<br /><em>built to be used.</em></h2>
            <p>Sniffari is manufactured the ordinary, boring way: an injection-moulded shell, a sewn felt cover and a small geared motor. No exotic parts, no subscription chip, nothing that stops working when a company changes its mind. The shell is moulded in batches near Pune, the covers are stitched by a small textile workshop in Tiruppur, and final assembly and testing happen by hand in Bengaluru.</p>
            <p className="specs-note">Every unit is run for a full hour on the bench before it ships.</p>
          </div>
          <dl className="spec-table">
            {specs.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section extras-section" id="extras">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Keep the adventure fresh</span>
            <h2>Good things to <em>add on.</em></h2>
          </div>
          <div className="extras-grid">
            {[PRODUCTS.refill, PRODUCTS.cover].map((extra) => (
              <article className="extra-card" key={extra.id}>
                <img src={extra.image} alt={extra.name} />
                <div>
                  <h3>{extra.name}</h3>
                  <p>{extra.tagline}</p>
                  <div className="extra-bottom">
                    <strong>{formatINR(extra.price)}</strong>
                    <button
                      type="button"
                      className="btn btn-outline btn-small"
                      onClick={() => addItem({
                        key: extra.id,
                        id: extra.id,
                        name: extra.name,
                        variant: '',
                        price: extra.price,
                        image: extra.image,
                      })}
                    >
                      Add <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section product-reviews">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Dog people say</span>
            <h2>Loved by the <em>2 p.m. quiet.</em></h2>
            <div className="heading-stars"><Stars rating={5} /> <span>4.9 average from 680+ reviews</span></div>
          </div>
          <div className="reviews-grid">
            {REVIEWS.map((review) => (
              <article className="review-card" key={review.name}>
                <Stars rating={review.rating} />
                <h3>{review.title}</h3>
                <p>“{review.body}”</p>
                <div className="review-author">
                  <span className="avatar">{review.name.charAt(0)}</span>
                  <span><strong>{review.name}</strong><small>{review.dog}</small></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
