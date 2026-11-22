import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, BatteryCharging, Brain, Check, Clock3, Heart, Leaf,
  PlayCircle, ShieldCheck, Smile, Sparkles, Volume2,
} from 'lucide-react'
import { Accordion, Stars } from '../components/ui.jsx'
import { formatINR } from '../currency.js'
import { FAQS, PRODUCTS, REVIEWS, SIZES } from '../data.js'
import { useShop } from '../store.jsx'

const features = [
  { icon: Clock3, title: 'Up to 4 hours of play', text: 'A long, slow burn of nose-led fun instead of five minutes of frantic chewing.' },
  { icon: Brain, title: 'It gets clever with your dog', text: 'Sensors notice how fast treats are found and adjust the next round.' },
  { icon: Volume2, title: 'Whisper quiet', text: 'Under 35 dB. No laser, no sudden noises, no overstimulated zoomies.' },
  { icon: ShieldCheck, title: 'Safe on its own', text: 'Soft rounded edges, enclosed treat pods and a non-slip, food-safe bumper.' },
  { icon: Leaf, title: 'Easy to keep clean', text: 'The felt cover unclips and goes straight into the washing machine.' },
  { icon: BatteryCharging, title: 'Charge once, play often', text: 'USB-C, roughly four hours per charge, with automatic shut-down.' },
]

const steps = [
  {
    number: '01',
    icon: Smile,
    title: 'Load a few small treats',
    text: 'Pop treats or the included scent pods into the pockets. No app, no pairing, no fuss.',
  },
  {
    number: '02',
    icon: PlayCircle,
    title: 'Let the nose take over',
    text: 'Your dog sniffs, paws and noses out the hidden pods. Ten minutes of sniffing equals a long walk mentally.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'It quietly resets itself',
    text: 'Every 90 seconds the carousel re-hides what is left, so the adventure keeps unfolding while you are out.',
  },
]

const plans = [
  {
    id: 'mini',
    name: 'Mini',
    price: 4999,
    tagline: 'For the smaller sniffers',
    features: ['Dogs up to 10 kg', '32 cm soft felt body', '6 hidden treat pockets', 'All the smart features'],
  },
  {
    id: 'original',
    name: 'Original',
    price: 5999,
    tagline: 'Our most-loved size',
    featured: true,
    features: ['Dogs 10–35 kg', '40 cm soft felt body', '10 hidden treat pockets', 'All the smart features'],
  },
  {
    id: 'kit',
    name: 'Complete Kit',
    price: 7499,
    tagline: 'Everything on day one',
    features: ['Original Sniffari · ₹5,999', 'Botanical scent refill · ₹699', 'Spare felt cover · ₹999', 'Save ₹198 · no subscription'],
  },
]

export default function Home() {
  const { addItem } = useShop()
  const navigate = useNavigate()

  function choosePlan(plan) {
    if (plan.id === 'kit') {
      addItem({ key: 'sniffari-original-moss', id: 'sniffari', name: 'Sniffari', variant: 'Original · Moss', price: PRODUCTS.sniffari.price, image: '/images/sniffari-product.jpg' })
      addItem({ key: 'refill', id: 'refill', name: PRODUCTS.refill.name, variant: '', price: PRODUCTS.refill.price, image: '/images/dog-food.jpg' })
      addItem({ key: 'cover', id: 'cover', name: PRODUCTS.cover.name, variant: '', price: PRODUCTS.cover.price, image: '/images/sniffari-product.jpg' })
    } else {
      const size = SIZES.find((option) => option.id === plan.id)
      addItem({
        key: `sniffari-${plan.id}-moss`,
        id: 'sniffari',
        name: 'Sniffari',
        variant: `${size.label} · Moss`,
        price: size.price,
        image: '/images/sniffari-product.jpg',
      })
    }
    navigate('/cart')
  }
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> New · invented for the hours you’re away</span>
            <h1>Hours of happy,<br /><em>even when you’re not.</em></h1>
            <p className="hero-lede">
              Meet Sniffari — the self-resetting scent adventure that turns your dog’s
              strongest sense into calm, deeply satisfying solo play.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" to="/product">Meet Sniffari <ArrowRight size={18} /></Link>
              <a className="btn btn-text" href="#how">See how it works</a>
            </div>
            <div className="hero-proof">
              <Stars rating={5} />
              <span><strong>4.9 / 5</strong> from 680+ dog people</span>
              <span className="proof-divider" />
              <span>7-day returns · 2-year warranty</span>
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-art-blob" />
            <img src="/images/hero-dog.jpg" alt="A dog following a scent trail across the floor at home" className="hero-image" />
            <div className="float-card float-card--top">
              <Clock3 size={18} />
              <span><strong>Up to 4 hrs</strong><small>of independent play</small></span>
            </div>
            <div className="float-card float-card--bottom">
              <Volume2 size={18} />
              <span><strong>&lt; 35 dB</strong><small>whisper quiet</small></span>
            </div>
          </div>
        </div>
        <div className="hero-strip">
          <div className="container strip-inner">
            <span>Self-resetting pockets</span><span>✳</span>
            <span>Adaptive challenge</span><span>✳</span>
            <span>No screens, no lasers</span><span>✳</span>
            <span>Machine-washable cover</span><span>✳</span>
            <span>Free delivery across India</span>
          </div>
        </div>
      </section>

      <section className="section problem-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">The real problem</span>
            <h2>The walk is easy. <em>It’s the six hours after.</em></h2>
            <p>Every dog knows the house is boring. Kongs get solved, balls get abandoned, and the good shoes pay the price. Boredom is not naughtiness — it is an unmet need.</p>
          </div>
          <div className="problem-grid">
            <div className="problem-card">
              <span className="problem-number">01</span>
              <h3>“Solved in five minutes”</h3>
              <p>Most puzzle toys have one answer. Once your dog finds it, the game is over and the boredom comes right back.</p>
            </div>
            <div className="problem-card problem-card--feature">
              <span className="problem-number">02</span>
              <h3>Skin, shoes, skirting boards</h3>
              <p>A bored dog makes their own entertainment. Chewing and pacing are how they say “I need something to do”.</p>
            </div>
            <div className="problem-card">
              <span className="problem-number">03</span>
              <h3>Guilt on your commute</h3>
              <p>You leave tired and worry all day. A camera that tosses treats helps — but only if you are glued to your phone.</p>
            </div>
          </div>
          <div className="solution-line">
            <Heart size={20} /> So we built a toy that does not run out of answers.
          </div>
        </div>
      </section>

      <section className="section how-section" id="how">
        <div className="container how-grid">
          <div className="how-intro">
            <span className="eyebrow">How it works</span>
            <h2>Nose first.<br /><em>Calm follows.</em></h2>
            <p>Sniffing is the dog equivalent of a long, thoughtful walk. It releases serotonin, lowers the heart rate and uses an enormous part of the brain. Sniffari simply gives that instinct somewhere to go — again and again.</p>
            <img src="/images/puppy-toy.jpg" alt="A puppy happily playing with a toy" className="how-image" />
          </div>
          <div className="steps-list">
            {steps.map((step) => (
              <div className="step" key={step.number}>
                <div className="step-icon"><step.icon size={24} /></div>
                <div>
                  <span className="step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section feature-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Thoughtful by design</span>
            <h2>Small details. <em>Big difference in your day.</em></h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon"><feature.icon size={24} /></div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section life-section">
        <div className="container life-grid">
          <div className="life-art">
            <div className="life-art-frame">
              <img src="/images/dog-food.jpg" alt="A dog investigating a bag of food" />
            </div>
            <div className="life-stamp">Felt cover<br /><strong>machine washable</strong></div>
          </div>
          <div className="life-copy">
            <span className="eyebrow">Built for real life</span>
            <h2>It lives in your home,<br /><em>not a pet shop aisle.</em></h2>
            <p>Warm colours, soft textures and a shape that looks at home next to your sofa. Inside, a simple quiet mechanism does the clever bit. Outside, nothing to unscrew, nothing to charge with a special cable.</p>
            <ul className="check-list">
              <li><Check size={18} /> Two sizes, three colours to choose from</li>
              <li><Check size={18} /> Reusable scent pods included, refills available</li>
              <li><Check size={18} /> Optional app for scheduling — never required</li>
              <li><Check size={18} /> 7-day returns and a 2-year warranty</li>
            </ul>
            <Link to="/product" className="btn btn-primary">Choose yours <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section reviews-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Real homes, real dogs</span>
            <h2>Quietly obsessed <em>customers.</em></h2>
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

      <section className="section mini-faq">
        <div className="container mini-faq-grid">
          <div>
            <span className="eyebrow">Good questions</span>
            <h2>Everything you<br /><em>might be wondering.</em></h2>
            <p>Still curious? Our full FAQ covers safety, cleaning, treats and the dreaded “what if my dog ignores it?” question.</p>
            <Link to="/faq" className="btn btn-outline">Read all FAQs <ArrowRight size={18} /></Link>
          </div>
          <Accordion items={FAQS.slice(0, 4)} initialOpen={0} />
        </div>
      </section>

      <section className="section pricing-section" id="pricing">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Clear, simple pricing</span>
            <h2>Pick your <em>price, pay once.</em></h2>
            <p>No subscription, no surprise fees. Free standard delivery across India and a 7-day return window on every option.</p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className={`price-card ${plan.featured ? 'is-featured' : ''}`} key={plan.id}>
                {plan.featured && <span className="price-badge">Most popular</span>}
                <h3>{plan.name}</h3>
                <p className="price-tagline">{plan.tagline}</p>
                <div className="price-amount">{formatINR(plan.price)}<small> one-time</small></div>
                <ul className="price-features">
                  {plan.features.map((feature) => <li key={feature}><Check size={16} /> {feature}</li>)}
                </ul>
                <button type="button" className={`btn btn-block ${plan.featured ? 'btn-primary' : 'btn-outline'}`} onClick={() => choosePlan(plan)}>
                  Choose {plan.name} <ArrowRight size={17} />
                </button>
              </article>
            ))}
          </div>
          <p className="pricing-note">All prices in INR and inclusive of 18% GST. Free standard delivery across India; express delivery ₹149. UPI, cards and cash on delivery accepted.</p>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta-inner">
          <div>
            <span className="eyebrow eyebrow-light">A better alone-time starts here</span>
            <h2>Give them something<br />to look forward to.</h2>
            <p>One Sniffari. Hours of happy. A much calmer goodbye.</p>
          </div>
          <Link to="/product" className="btn btn-cream btn-lg">Shop Sniffari <ArrowRight size={18} /></Link>
        </div>
      </section>
    </>
  )
}
