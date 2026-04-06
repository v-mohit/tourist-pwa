const FEATURES = [
  {
    icon: '🎟',
    title: 'Instant Booking',
    desc: 'Book entry tickets for all attractions without waiting in queues.',
  },
  {
    icon: '🗺',
    title: 'Explore Everything',
    desc: 'Discover monuments, wildlife parks, museums, and cultural venues.',
  },
  {
    icon: '🆘',
    title: '24/7 Support',
    desc: 'Emergency assistance available anytime, anywhere in Rajasthan.',
  },
]

export default function FeaturesSection(data: any) {
  return (
    <section className="sec bg-[var(--cream)]">
      {/* Centered heading */}
      <div className="sec-ctr">
        <div className="sec-lbl">✦ Why Book Here</div>
        <h2
          className="sec-ttl text-[var(--ch)]"
          style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16 }}
        >
          Welcome to Rajasthan Tourism OBMS
        </h2>
        <p
          className="text-[var(--mu)] mx-auto leading-relaxed"
          style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', maxWidth: 560 }}
        >
          Your official gateway to book tickets for forts, wildlife safaris, museums, light &amp;
          sound shows, and more. Enjoy seamless online booking with instant confirmations.
        </p>
      </div>

      {/* Feature cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}
      >
        {FEATURES.map(({ icon, title, desc }) => (
          <div key={title} className="feature-card">
            <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
            <h3
              className="text-[var(--ch)]"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}
            >
              {title}
            </h3>
            <p className="text-[var(--mu)]" style={{ fontSize: 13, lineHeight: 1.7 }}>
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
