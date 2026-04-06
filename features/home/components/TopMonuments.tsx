const MONUMENTS = [
  {
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed31f5e?w=500&auto=format&fit=crop&q=80',
    tag: { label: '🏆 UNESCO', cls: 'tg' },
    name: 'Amber Fort',
    loc: 'Jaipur',
    chips: ['🏯 Fort', '16th Century'],
    time: '8AM–5:30PM',
    fee: '₹200',
  },
  {
    img: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=500&auto=format&fit=crop&q=80',
    tag: { label: '🌸 Iconic', cls: 'to' },
    name: 'Hawa Mahal',
    loc: 'Jaipur',
    chips: ['953 Windows', 'Pink City'],
    time: '9AM–5PM',
    fee: '₹50',
  },
  {
    img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&auto=format&fit=crop&q=80',
    tag: { label: '🔵 Blue City', cls: 'tb' },
    name: 'Mehrangarh Fort',
    loc: 'Jodhpur',
    chips: ['15th Century', 'Museum'],
    time: '9AM–5PM',
    fee: '₹100',
  },
  {
    img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=500&auto=format&fit=crop&q=80',
    tag: { label: '🏜 Desert Fort', cls: 'tg' },
    name: 'Jaisalmer Fort',
    loc: 'Jaisalmer',
    chips: ['Living Fort', '12th Century'],
    time: '9AM–6PM',
    fee: '₹70',
  },
  {
    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80',
    tag: { label: '🌊 Lakeside', cls: 'tb' },
    name: 'City Palace, Udaipur',
    loc: 'Udaipur',
    chips: ['Palace', 'Museum'],
    time: '9:30AM–5:30PM',
    fee: '₹300',
  },
  {
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&auto=format&fit=crop&q=80',
    tag: { label: '🏆 UNESCO', cls: 'tg' },
    name: 'Jantar Mantar',
    loc: 'Jaipur',
    chips: ['🔭 Observatory', '18th Century'],
    time: '9AM–4:30PM',
    fee: '₹40',
  },
  {
    img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&auto=format&fit=crop&q=80',
    tag: { label: '🌅 Sunset Point', cls: 'to' },
    name: 'Nahargarh Fort',
    loc: 'Jaipur',
    chips: ['City View', 'Wax Museum'],
    time: '10AM–5:30PM',
    fee: '₹50',
  },
  {
    img: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576c7?w=500&auto=format&fit=crop&q=80',
    tag: { label: '💎 Hidden Gem', cls: 'tw' },
    name: 'Taragarh Fort, Bundi',
    loc: 'Bundi',
    chips: ['14th Century', 'Step Wells'],
    time: '8AM–5PM',
    fee: '₹30',
  },
]

export default function TopMonuments(data: any) {
  return (
    <section className="sec bg-[var(--cream)]" id="monuments">
      {/* Header */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl">✦ Top Monuments</div>
          <h2 className="sec-ttl">Royal Heritage &amp; Architecture</h2>
        </div>
        <a href="#" className="see-all">See all →</a>
      </div>

      {/* Grid */}
      <div className="mon-grid">
        {MONUMENTS.map(({ img, tag, name, loc, chips, time, fee }) => (
          <div key={name} className="mon-card">
            {/* Image */}
            <div className="mon-img">
              <div className="dimg" style={{ backgroundImage: `url('${img}')` }} />
              <div className="mon-img-grad" />
              <div className="mon-img-tag">
                <span className={`tag ${tag.cls}`} style={{ fontSize: 8 }}>{tag.label}</span>
              </div>
            </div>

            {/* Body */}
            <div className="mon-body">
              <div className="mon-name">{name}</div>
              <div className="mon-loc">📍 {loc}</div>
              <div className="mon-chips">
                {chips.map((c) => <span key={c} className="mon-chip">{c}</span>)}
              </div>
              <div className="mon-foot">
                <span className="mon-time">⏰ {time}</span>
                <span className="mon-fee">{fee}</span>
              </div>
              <button className="btn-sm btn-sm--full">Book Entry →</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
