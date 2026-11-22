export const PRODUCTS = {
  sniffari: {
    id: 'sniffari',
    name: 'Sniffari',
    tagline: 'The self-resetting scent adventure',
    image: '/images/sniffari-product.jpg',
    price: 5999,
  },
  refill: {
    id: 'refill',
    name: 'Botanical Scent Refill',
    tagline: 'Three new scents for the next chapter',
    image: '/images/dog-food.jpg',
    price: 699,
  },
  cover: {
    id: 'cover',
    name: 'Spare Felt Cover',
    tagline: 'Swap in a fresh one in under a minute',
    image: '/images/sniffari-product.jpg',
    price: 999,
  },
}

export const SIZES = [
  { id: 'mini', label: 'Mini', price: 4999, detail: 'Dogs up to 10 kg · 32 cm wide' },
  { id: 'original', label: 'Original', price: 5999, detail: 'Dogs 10–35 kg · 40 cm wide' },
]

export const COLORS = [
  { id: 'moss', label: 'Moss', hex: '#708b68' },
  { id: 'clay', label: 'Clay', hex: '#c4785b' },
  { id: 'slate', label: 'Slate', hex: '#64727a' },
]

export const SHIPPING = [
  { id: 'standard', label: 'Standard delivery', detail: 'Free · 3–5 working days across India', price: 0 },
  { id: 'express', label: 'Express delivery', detail: '1–2 working days · metro cities', price: 149 },
]

export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', detail: 'GPay, PhonePe, Paytm or any UPI app', tag: 'Instant' },
  { id: 'card', label: 'Card', detail: 'Credit or debit card · Visa, Mastercard, RuPay', tag: 'Secure' },
  { id: 'cod', label: 'Cash on delivery', detail: 'Pay the courier when your Sniffari arrives', tag: 'No fee' },
]

export const PROMO_CODES = { NOSEWORK10: 0.1, FIRSTSNIFF: 0.15 }
// Indian retail prices are shown inclusive of 18% GST.
export const TAX_RATE = 0.18

export const FAQS = [
  {
    id: 'playtime',
    q: 'How long does a play session actually last?',
    a: 'Most dogs get 2–4 hours of calm, nose-led engagement from a single session. Sniffari quietly resets the hidden treat pockets every 90 seconds (you can adjust this), so the hunt keeps going long after a normal puzzle toy has been solved. Appetite and sniffing drive vary, so we include a guide to finding your dog’s sweet spot.',
  },
  {
    id: 'app',
    q: 'Does my dog need to figure out a screen or an app?',
    a: 'No. Sniffari works completely on its own — no phone, no account, no pairing. The optional app is only for scheduling sessions away from home, checking activity and changing the reset timing.',
  },
  {
    id: 'safety',
    q: 'Is it safe to leave my dog with it unsupervised?',
    a: 'Yes, when introduced as directed. There are no lasers, no fast-moving parts and no small loose pieces: treats sit inside enclosed pods in a soft, rounded body. The outer cover is machine washable and the bumper is food-safe silicone. Always supervise the first few sessions and choose the right size for your dog.',
  },
  {
    id: 'adaptive',
    q: 'How does the adaptive challenge work?',
    a: 'Tiny sensors in each pocket register when a treat is found. If your dog clears the toy quickly, the next reset hides treats deeper and shortens the interval. If they take their time, Sniffari eases off so the game stays rewarding instead of frustrating.',
  },
  {
    id: 'treats',
    q: 'What treats can I use?',
    a: 'Any small, dry treat about 1 cm across, or the reusable scent pods we include. Avoid wet or sticky treats — they can gum up the mechanism. A sprinkle of kibble from their daily allowance works brilliantly and keeps calories in check.',
  },
  {
    id: 'cleaning',
    q: 'How do I clean it?',
    a: 'Unclip the felt cover and machine wash it cold on a gentle cycle. Wipe the inner shell with a damp cloth. The cover dries quickly and is ready to go again in a few hours.',
  },
  {
    id: 'battery',
    q: 'What is the battery life?',
    a: 'About four hours of continuous play per USB-C charge, with automatic shut-down when a session ends. Many people charge it once every few days.',
  },
  {
    id: 'shipping',
    q: 'How fast is delivery, and what does it cost?',
    a: 'Standard delivery is free across India and usually takes 3–5 working days. Express delivery is ₹149 and reaches most metro cities in 1–2 working days. Every parcel ships from our Bengaluru studio with a GST invoice and a tracking link.',
  },
  {
    id: 'returns',
    q: 'What if my dog just isn’t interested?',
    a: 'Try the included starter scent pods and place a treat partly visible in one pocket for the first session. Most dogs catch on within a few minutes because sniffing is instinctive. If it is not a match, request a return within 7 days of delivery for a full refund — we arrange the pickup and ask no awkward questions.',
  },
  {
    id: 'payment',
    q: 'Can I pay by UPI or cash on delivery?',
    a: 'Yes. Pay by UPI, credit or debit card, or choose cash on delivery at checkout. UPI and card payments are confirmed instantly. Cash on delivery has no extra fee and is available on orders up to ₹15,000.',
  },
]

export const REVIEWS = [
  {
    name: 'Maya R.',
    dog: 'Border collie, 3 · Bengaluru',
    rating: 5,
    title: 'The first thing that has actually tired him out',
    body: 'I leave for a full work day and come home to a calm, sleepy dog instead of a chewed skirting board. The little pockets resetting is genuinely clever — he never seems to work it out fully.',
  },
  {
    name: 'Tom & Biscuit',
    dog: 'Cocker spaniel, 5 · Pune',
    rating: 5,
    title: 'Quieter than the TV',
    body: 'We live in a flat and were nervous about a motorised toy. It is barely audible. Biscuit noses away at it while we cook dinner, and the cover goes straight in the wash.',
  },
  {
    name: 'Priya S.',
    dog: 'Rescue terrier, 2 · Hyderabad',
    rating: 5,
    title: 'Worth it for the guilt alone',
    body: 'She used to pace the door the second we left. Now she waits by her Sniffari. The adaptive thing really works — she got faster at it in a week and it got harder with her.',
  },
]
