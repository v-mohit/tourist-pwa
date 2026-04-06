const WILD_CARDS = [
  {
    img: 'https://images.unsplash.com/photo-1608023136037-626dad6df359?w=500&auto=format&fit=crop&q=80',
    tag: '🐆 Leopard',
    name: 'Jhalana Leopard Park',
    meta: '📍 Jaipur · 30+ Leopards',
  },
  {
    img: 'https://images.unsplash.com/photo-1614267861476-3bde44e0bc6c?w=500&auto=format&fit=crop&q=80',
    tag: '🦅 UNESCO',
    name: 'Keoladeo National Park',
    meta: '📍 Bharatpur · 380+ Bird Species',
  },
  {
    img: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=500&auto=format&fit=crop&q=80',
    tag: '🐘 Bio Park',
    name: 'Nahargarh Biological Park',
    meta: '📍 Jaipur · Big Cats Zone',
  },
  {
    img: 'https://images.unsplash.com/photo-1612428085659-de9c5c765fe6?w=500&auto=format&fit=crop&q=80',
    tag: '🐅 Tiger Reserve',
    name: 'Ramgarh Vishdhari Reserve',
    meta: '📍 Bundi · Newest Reserve',
  },
]

export default function WildlifeSection(data: any) {
  return (
    <section className="sec" id="wildlife" style={{ background: '#0B1A12' }}>
      {/* Header */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl" style={{ color: '#22C55E' }}>✦ Top Wildlife</div>
          <h2 className="sec-ttl sec-ttl-w">Into the Wild</h2>
        </div>
        <a href="#" className="see-all" style={{ color: '#22C55E', borderColor: '#22C55E' }}>
          See all →
        </a>
      </div>

      {/* Featured hero banner — Sariska */}
      <div className="wild-hero">
        <div
          className="dimg"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1400&auto=format&fit=crop&q=85')",
          }}
        />
        <div className="wild-hero-grad" />
        <div className="wild-hero-body">
          <span className="tag tn">🐯 Project Tiger Reserve</span>
          <h2>Sariska Tiger Reserve</h2>
          <div className="wild-facts">
            <div className="wf">📍 <b>Alwar</b></div>
            <div className="wf">🌿 <b>800 km²</b></div>
            <div className="wf">🐯 <b>30+ Tigers</b></div>
            <div className="wf">📅 <b>Oct–Jun</b></div>
          </div>
          <p className="wild-hero-desc">
            India&apos;s first reserve to successfully relocate tigers. Home to leopards, hyenas and
            200+ bird species.
          </p>
          <div className="wild-hero-btns">
            <button className="btn-p">Book Safari →</button>
            <button className="btn-g">View Details</button>
          </div>
        </div>
      </div>

      {/* 4-card grid */}
      <div className="wild-grid">
        {WILD_CARDS.map(({ img, tag, name, meta }) => (
          <div key={name} className="wild-card">
            <div className="dimg" style={{ backgroundImage: `url('${img}')` }} />
            <div className="wild-grad" />
            <div className="wild-top">
              <span className="tag tn" style={{ fontSize: 9 }}>{tag}</span>
            </div>
            <div className="wild-foot">
              <h4>{name}</h4>
              <div className="wild-bar">
                <span>{meta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
