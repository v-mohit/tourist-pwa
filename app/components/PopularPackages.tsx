'use client'

const PopularPackages = () => {
  const packages = [
    {
      id: 1,
      name: 'Jaipur Darshan',
      image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80',
      rating: '4.8',
      price: '180',
      info: ['🏯 10 Monuments', '🕐 Full Day', '🚌 Transport Incl.', '🎟 Entry Tickets'],
      type: 'COMPOSITE'
    },
    {
      id: 2,
      name: 'Jodhpur Darshan',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80',
      rating: '4.7',
      price: '150',
      info: ['🏯 Mehrangarh Fort', '🕐 Full Day', '🚌 Transport Incl.', '🎟 Entry Tickets'],
      type: 'COMPOSITE'
    },
    {
      id: 3,
      name: 'Jaisalmer Darshan',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=80',
      rating: '4.9',
      price: '120',
      info: ['🏰 Fort & Havelis', '🕐 Full Day', '🚌 Transport Incl.', '🎟 Entry Tickets'],
      type: 'COMPOSITE'
    },
    {
      id: 4,
      name: 'Udaipur Darshan',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
      rating: '4.8',
      price: '200',
      info: ['🌊 City of Lakes', '🕐 Full Day', '⛵ Boat Ride Incl.', '🎟 Entry Tickets'],
      type: 'COMPOSITE'
    },
    {
      id: 5,
      name: 'Bundi Darshan',
      image: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576c7?w=600&auto=format&fit=crop&q=80',
      rating: '4.6',
      price: '50',
      info: ['🏛 4 Heritage Sites', '🕐 Half Day', '🚶 Walking Tour', '🎟 Entry Tickets'],
      type: 'COMPOSITE'
    },
    {
      id: 6,
      name: 'Bharatpur Darshan',
      image: 'https://images.unsplash.com/photo-1614267861476-3bde44e0bc6c?w=600&auto=format&fit=crop&q=80',
      rating: '4.7',
      price: '30',
      info: ['🦅 Keoladeo Park', '🕐 Half Day', '🚲 Cycle Rickshaw', '🎟 Entry Tickets'],
      type: 'UNESCO SITE'
    }
  ]

  return (
    <section id="packages" style={{ background: 'var(--ch)' }} className="sec">
      <div className="sec-hd rv">
        <div>
          <div className="sec-lbl" style={{ color: 'var(--gold)' }}>✦ Popular Packages</div>
          <h2 className="sec-ttl sec-ttl-w">Curated Darshan<br />Experiences</h2>
        </div>
        <a href="#" className="see-all sag">See all →</a>
      </div>
      <div className="pkg-grid rv">
        {packages.map((pkg) => (
          <div key={pkg.id} className="pkg-card">
            <div className="pkg-img">
              <div className="dimg" style={{ backgroundImage: `url('${pkg.image}')` }}></div>
              <div className="pkg-grad"></div>
              <div className="pkg-rating">⭐ {pkg.rating}</div>
              <div className="pkg-badge">
                <div className="amt">₹{pkg.price}</div>
                <div className="per">per person</div>
              </div>
            </div>
            <div className="pkg-body">
              <h3>{pkg.name}</h3>
              <div className="pkg-info">
                {pkg.info.map((item, idx) => (
                  <div key={idx} className="pkg-ii">{item.split(' ').slice(1).join(' ')}</div>
                ))}
              </div>
              <div className="pkg-foot">
                <span className="tag tg" style={{ fontSize: '9px' }}>{pkg.type}</span>
                <button className="btn-s">Book →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PopularPackages
