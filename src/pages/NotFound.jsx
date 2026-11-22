import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="section empty-page container">
      <span className="empty-icon">🐾</span>
      <h1>This trail went cold.</h1>
      <p>We couldn’t find that page, but there’s a very good sniffari waiting back home.</p>
      <Link to="/" className="btn btn-primary btn-lg">Back home <ArrowRight size={18} /></Link>
    </section>
  )
}
