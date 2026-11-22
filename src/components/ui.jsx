import { useState } from 'react'
import { ChevronDown, Minus, Plus, Star } from 'lucide-react'

export function Stars({ rating = 5, count, size = 15 }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={size} fill={index < Math.round(rating) ? 'currentColor' : 'none'} />
      ))}
      {count !== undefined && <span className="stars-count">{count}</span>}
    </span>
  )
}

export function Accordion({ items, initialOpen = null }) {
  const [open, setOpen] = useState(initialOpen)
  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = open === index
        return (
          <div className={`accordion-item ${isOpen ? 'is-open' : ''}`} key={item.q} id={item.id}>
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span>{item.q}</span>
              <ChevronDown size={20} />
            </button>
            {isOpen && <div className="accordion-panel"><p>{item.a}</p></div>}
          </div>
        )
      })}
    </div>
  )
}

export function QtyStepper({ value, onChange, min = 1, label = 'Quantity' }) {
  return (
    <div className="qty-stepper" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease quantity">
        <Minus size={16} />
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase quantity">
        <Plus size={16} />
      </button>
    </div>
  )
}
