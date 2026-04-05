'use client'

const TopWildlife = () => {
  const wildlifeList = [
    { name: 'Jhalana Leopard Park', image: 'https://images.unsplash.com/photo-1608023136037-626dad6df358?w=500&auto=format&fit=crop&q=80', tag: '🐆 Leopard', info: '📍 Jaipur · 30+ Leopards' },
    { name: 'Keoladeo National Park', image: 'https://images.unsplash.com/photo-1614267861476-3bde44e0bc6c?w=500&auto=format&fit=crop&q=80', tag: '🦅 UNESCO', info: '📍 Bharatpur · 380+ Bird Species' },
    { name: 'Nahargarh Biological Park', image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=500&auto=format&fit=crop&q=80', tag: '🐘 Bio Park', info: '📍 Jaipur · Big Cats Zone' },
    { name: 'Ramgarh Vishdhari Reserve', image: 'https://images.unsplash.com/photo-1612428085659-de9c5c765fe6?w=500&auto=format&fit=crop&q=80', tag: '🐅 Tiger Reserve', info: '📍 Bundi · Newest Reserve' },
  ]

  return (
    <section id="wildlife" className="sec" style={{ background: '#0B1A12' }}>
      <div className="sec-hd rv">
        <div>
          <div className="sec-lbl" style={{ color: '#22C55E' }}>✦ Top Wildlife</div>
          <h2 className="sec-ttl sec-ttl-w">Into the Wild</h2>
        </div>
        <a href="#" className="see-all" style={{ color: '#22C55E', borderColor: '#22C55E' }}>See all →</a>
      </div>

      {/* Featured Hero Card */}
      <div className="rv" style={{ borderRadius: 'var(--rl)', overflow: 'hidden', position: 'relative', height: '370px', marginBottom: '16px', cursor: 'pointer', background: '#1a2e20' }}>
        <div className="dimg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1400&auto=format&fit=crop&q=85')" }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(11,26,18,.93) 0%, rgba(11,26,18,.3) 55%, transparent 100%)' }}></div>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '36px 40px', maxWidth: '440px' }}>
          <span className="tag tn">🐯 Project Tiger Reserve</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(22px,2.8vw,34px)', color: '#fff', margin: '10px 0 8px', lineHeight: 1.2 }}>Sariska Tiger Reserve</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,.65)', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', padding: '5px 10px' }}><b>📍 Alwar</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,.65)', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', padding: '5px 10px' }}><b>🌿 800 km²</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,.65)', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', padding: '5px 10px' }}><b>🐯 30+ Tigers</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,.65)', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', padding: '5px 10px' }}><b>📅 Oct–Jun</b></div>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', lineHeight: 1.7, marginBottom: '20px' }}>India's first reserve to successfully relocate tigers. Home to leopards, hyenas and 200+ bird species.</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn-p">Book Safari →</button>
            <button className="btn-g">View Details</button>
          </div>
        </div>
      </div>

      {/* Wildlife Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }} className="rv">
        {wildlifeList.map((wild, idx) => (
          <div key={idx} style={{ borderRadius: 'var(--r)', overflow: 'hidden', position: 'relative', height: '210px', cursor: 'pointer', background: '#1a2e20' }}>
            <div className="dimg" style={{ backgroundImage: `url('${wild.image}')` }}></div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,26,18,.9) 0%, rgba(11,26,18,.08) 55%, transparent 100%)' }}></div>
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <span className="tag tn" style={{ fontSize: '9px' }}>{wild.tag}</span>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '13px 14px' }}>
              <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: '14px', color: '#fff', marginBottom: '2px' }}>{wild.name}</h4>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,.58)' }}>{wild.info}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TopWildlife
