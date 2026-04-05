'use client'

const TopMonuments = () => {
  const monuments = [
    { id: 1, name: 'Amber Fort', city: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=500&auto=format&fit=crop&q=80', tag: '🏆 UNESCO', chips: ['🏯 Fort', '16th Century'], time: '⏰ 8AM–5:30PM', fee: '₹200' },
    { id: 2, name: 'Hawa Mahal', city: 'Jaipur', image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=500&auto=format&fit=crop&q=80', tag: '🌸 Iconic', chips: ['953 Windows', 'Pink City'], time: '⏰ 9AM–5PM', fee: '₹50' },
    { id: 3, name: 'Mehrangarh Fort', city: 'Jodhpur', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&auto=format&fit=crop&q=80', tag: '🔵 Blue City', chips: ['15th Century', 'Museum'], time: '⏰ 9AM–5PM', fee: '₹100' },
    { id: 4, name: 'Jaisalmer Fort', city: 'Jaisalmer', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=500&auto=format&fit=crop&q=80', tag: '🏜 Desert Fort', chips: ['Living Fort', '12th Century'], time: '⏰ 9AM–6PM', fee: '₹70' },
    { id: 5, name: 'City Palace, Udaipur', city: 'Udaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80', tag: '🌊 Lakeside', chips: ['Palace', 'Museum'], time: '⏰ 9:30AM–5:30PM', fee: '₹300' },
    { id: 6, name: 'Jantar Mantar', city: 'Jaipur', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&auto=format&fit=crop&q=80', tag: '🏆 UNESCO', chips: ['🔭 Observatory', '18th Century'], time: '⏰ 9AM–4:30PM', fee: '₹40' },
    { id: 7, name: 'Nahargarh Fort', city: 'Jaipur', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&auto=format&fit=crop&q=80', tag: '🌅 Sunset Point', chips: ['City View', 'Wax Museum'], time: '⏰ 10AM–5:30PM', fee: '₹50' },
    { id: 8, name: 'Taragarh Fort, Bundi', city: 'Bundi', image: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576c7?w=500&auto=format&fit=crop&q=80', tag: '💎 Hidden Gem', chips: ['14th Century', 'Step Wells'], time: '⏰ 8AM–5PM', fee: '₹30' },
  ]

  return (
    <section id="monuments" className="sec" style={{ background: 'var(--cream)' }}>
      <div className="sec-hd rv">
        <div>
          <div className="sec-lbl">✦ Top Monuments</div>
          <h2 className="sec-ttl">Royal Heritage & Architecture</h2>
        </div>
        <a href="#" className="see-all">See all →</a>
      </div>
      <div className="mon-grid rv">
        {monuments.map((mon) => (
          <div key={mon.id} className="mon-card">
            <div className="mon-img">
              <div className="dimg" style={{ backgroundImage: `url('${mon.image}')` }}></div>
              <div className="mon-img-grad"></div>
              <div className="mon-img-tag"><span className="tag tg" style={{ fontSize: '8px' }}>{mon.tag}</span></div>
            </div>
            <div className="mon-body">
              <div className="mon-name">{mon.name}</div>
              <div className="mon-loc">📍 {mon.city}</div>
              <div className="mon-chips">
                {mon.chips.map((chip, idx) => (
                  <span key={idx} className="mon-chip">{chip}</span>
                ))}
              </div>
              <div className="mon-foot">
                <span className="mon-time">{mon.time}</span>
                <span className="mon-fee">{mon.fee}</span>
              </div>
              <button className="btn-sm" style={{ width: '100%', marginTop: '10px', justifyContent: 'center' }}>Book Entry →</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TopMonuments
