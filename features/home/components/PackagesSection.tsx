const PACKAGES = [
  {
    img: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80',
    rating: '⭐ 4.8',
    price: '₹180',
    name: 'Jaipur Darshan',
    infos: ['🏯 10 Monuments', '🕐 Full Day', '🚌 Transport Incl.', '🎟 Entry Tickets'],
    badge: { label: 'COMPOSITE', cls: 'tg' },
  },
  {
    img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80',
    rating: '⭐ 4.7',
    price: '₹150',
    name: 'Jodhpur Darshan',
    infos: ['🏯 Mehrangarh Fort', '🕐 Full Day', '🚌 Transport Incl.', '🎟 Entry Tickets'],
    badge: { label: 'COMPOSITE', cls: 'tg' },
  },
  {
    img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=80',
    rating: '⭐ 4.9',
    price: '₹120',
    name: 'Jaisalmer Darshan',
    infos: ['🏰 Fort & Havelis', '🕐 Full Day', '🚌 Transport Incl.', '🎟 Entry Tickets'],
    badge: { label: 'COMPOSITE', cls: 'tg' },
  },
  {
    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
    rating: '⭐ 4.8',
    price: '₹200',
    name: 'Udaipur Darshan',
    infos: ['🌊 City of Lakes', '🕐 Full Day', '⛵ Boat Ride Incl.', '🎟 Entry Tickets'],
    badge: { label: 'COMPOSITE', cls: 'tg' },
  },
  {
    img: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576c7?w=600&auto=format&fit=crop&q=80',
    rating: '⭐ 4.6',
    price: '₹50',
    name: 'Bundi Darshan',
    infos: ['🏛 4 Heritage Sites', '🕐 Half Day', '🚶 Walking Tour', '🎟 Entry Tickets'],
    badge: { label: 'COMPOSITE', cls: 'tg' },
  },
  {
    img: 'https://images.unsplash.com/photo-1614267861476-3bde44e0bc6c?w=600&auto=format&fit=crop&q=80',
    rating: '⭐ 4.7',
    price: '₹30',
    name: 'Bharatpur Darshan',
    infos: ['🦅 Keoladeo Park', '🕐 Half Day', '🚲 Cycle Rickshaw', '🎟 Entry Tickets'],
    badge: { label: 'UNESCO SITE', cls: 'tn' },
  },
]

export default function PackagesSection(data: any) {
  return (
    <section className="sec bg-[var(--ch)]" id="packages">
      {/* Header */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl text-[var(--gold)]">✦ Popular Packages</div>
          <h2 className="sec-ttl sec-ttl-w">
            Curated Darshan<br />Experiences
          </h2>
        </div>
        <a href="#" className="see-all sag">See all →</a>
      </div>

      {/* Grid */}
      <div className="pkg-grid">
        {PACKAGES.map(({ img, rating, price, name, infos, badge }) => (
          <div key={name} className="pkg-card">
            {/* Image */}
            <div className="pkg-img">
              <div className="dimg" style={{ backgroundImage: `url('${img}')` }} />
              <div className="pkg-grad" />
              <div className="pkg-rating">{rating}</div>
              <div className="pkg-badge">
                <div className="amt">{price}</div>
                <div className="per">per person</div>
              </div>
            </div>

            {/* Body */}
            <div className="pkg-body">
              <h3>{name}</h3>
              <div className="pkg-info">
                {infos.map((info) => (
                  <div key={info} className="pkg-ii">{info}</div>
                ))}
              </div>
              <div className="pkg-foot">
                <span className={`tag ${badge.cls}`} style={{ fontSize: 9 }}>{badge.label}</span>
                <button className="btn-s">Book →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
