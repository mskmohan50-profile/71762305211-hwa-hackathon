import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Accordion } from '../components/ui.jsx'
import { FAQS } from '../data.js'

export default function FAQ() {
  return (
    <section className="section faq-section container">
      <div className="page-heading centered-heading">
        <span className="eyebrow">Answers, no wagging around</span>
        <h1>Frequently asked <em>questions.</em></h1>
        <p>Everything people ask us before welcoming a Sniffari into their home.</p>
      </div>
      <div className="faq-layout">
        <div className="faq-side">
          <h2>Still stuck?</h2>
          <p>Real humans answer our emails, usually within one business day. Ask us anything — especially if your dog is a bit of a puzzle.</p>
          <Link to="/contact" className="btn btn-outline">Ask a question <ArrowRight size={17} /></Link>
          <div className="faq-side-note">Most orders ship the next working day.</div>
        </div>
        <Accordion items={FAQS} initialOpen={0} />
      </div>
    </section>
  )
}
