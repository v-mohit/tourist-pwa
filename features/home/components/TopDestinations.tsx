const DESTINATIONS = [
  {
    img: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=900&auto=format&fit=crop&q=85',
    tag: { label: '⭐ Most Popular', cls: 'tg' },
    name: 'Jaipur',
    meta: [{ icon: '📍', text: 'The Pink City' }, { icon: '🏯', text: '12 Monuments' }],
  },
  {
    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=700&auto=format&fit=crop&q=85',
    tag: { label: '🌊 Lakes', cls: 'tw' },
    name: 'Udaipur',
    meta: [{ icon: '📍', text: 'City of Lakes' }, { icon: '🏛', text: '9 Attractions' }],
  },
  {
    img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&auto=format&fit=crop&q=85',
    tag: { label: '🏯 Fort City', cls: 'tw' },
    name: 'Jodhpur',
    meta: [{ icon: '📍', text: 'The Blue City' }, { icon: '🏯', text: '8 Attractions' }],
  },
  {
    img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=700&auto=format&fit=crop&q=85',
    tag: { label: '🏜 Desert', cls: 'tg' },
    name: 'Jaisalmer',
    meta: [{ icon: '📍', text: 'Golden City' }, { icon: '🏰', text: '6 Attractions' }],
  },
  {
    img: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=700&auto=format&fit=crop&q=85',
    tag: { label: '🐯 Wildlife', cls: 'tn' },
    name: 'Alwar',
    meta: [{ icon: '📍', text: 'Sariska Tiger Reserve' }, { icon: '🌿', text: 'Wildlife Zone' }],
  },
]

export default function TopDestinations() {
  return (
    <section className="sec bg-[var(--cream)]" id="destinations">
      {/* Header */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl">✦ Top Destinations</div>
          <h2 className="sec-ttl">
            Where do you want<br />to explore?
          </h2>
        </div>
        <a href="#" className="see-all">View all cities →</a>
      </div>

      {/* Grid */}
      <div className="dest-grid">
        {DESTINATIONS.map(({ img, tag, name, meta }) => (
          <div key={name} className="dest-card">
            <div className="dimg" style={{ backgroundImage: `url('${img}')` }} />
            <div className="dest-grad" />
            <div className="dest-top">
              <span className={`tag ${tag.cls}`}>{tag.label}</span>
              <div className="dest-arr">→</div>
            </div>
            <div className="dest-foot">
              <h3>{name}</h3>
              <div className="dest-meta">
                {meta.map((m, i) => (
                  <span key={i}>{m.icon} {m.text}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
