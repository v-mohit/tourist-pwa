'use client'

const TopDestinations = () => {
  const destinations = [
    { id: 1, name: 'Jaipur', image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=900&auto=format&fit=crop&q=85', tag: '⭐ Most Popular', tagClass: 'tg', meta1: '📍 The Pink City', meta2: '🏯 12 Monuments' },
    { id: 2, name: 'Udaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=700&auto=format&fit=crop&q=85', tag: '🌊 Lakes', tagClass: 'tw', meta1: '📍 City of Lakes', meta2: '🏛 9 Attractions' },
    { id: 3, name: 'Jodhpur', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&auto=format&fit=crop&q=85', tag: '🏯 Fort City', tagClass: 'tw', meta1: '📍 The Blue City', meta2: '🏯 8 Attractions' },
    { id: 4, name: 'Jaisalmer', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=700&auto=format&fit=crop&q=85', tag: '🏜 Desert', tagClass: 'tg', meta1: '📍 Golden City', meta2: '🏰 6 Attractions' },
    { id: 5, name: 'Alwar', image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=700&auto=format&fit=crop&q=85', tag: '🐯 Wildlife', tagClass: 'tn', meta1: '📍 Sariska Tiger Reserve', meta2: '🌿 Wildlife Zone' },
  ]

  return (
    <section id="destinations" className="sec" style={{ background: 'var(--cream)' }}>
      <div className="sec-hd rv">
        <div>
          <div className="sec-lbl">✦ Top Destinations</div>
          <h2 className="sec-ttl">Where do you want<br />to explore?</h2>
        </div>
        <a href="#" className="see-all">View all cities →</a>
      </div>
      <div className="dest-grid rv">
        {destinations.map((dest) => (
          <div key={dest.id} className="dest-card">
            <div className="dimg" style={{ backgroundImage: `url('${dest.image}')` }}></div>
            <div className="dest-grad"></div>
            <div className="dest-top">
              <span className={`tag ${dest.tagClass}`}>{dest.tag}</span>
              <div className="dest-arr">→</div>
            </div>
            <div className="dest-foot">
              <h3>{dest.name}</h3>
              <div className="dest-meta">
                <span>{dest.meta1}</span>
                <span>{dest.meta2}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TopDestinations
