const MUSEUMS = [
  {
    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80',
    imgTag: { label: '🏆 Heritage', cls: 'tg' },
    estd: 'Est. 1876',
    name: 'Govt. Central Museum (Albert Hall)',
    desc: 'Rajasthani art, textiles, jewellery and a rare Egyptian mummy.',
    tags: ['🎨 Art', '🏺 Archaeology', '📜 Manuscripts'],
    time: '9AM–5PM',
    fee: '₹40/adult',
  },
  {
    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
    imgTag: { label: '🌊 Lakeside', cls: 'tw' },
    estd: 'Est. 1890',
    name: 'Government Museum, Udaipur',
    desc: 'Sculptures, miniature paintings and artifacts from the Mewar region.',
    tags: ['🖼 Paintings', '🗿 Sculptures', '👑 Royal Artifacts'],
    time: '9:30AM–5:30PM',
    fee: '₹100/adult',
  },
  {
    img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80',
    imgTag: { label: '🏛 State Museum', cls: 'tg' },
    estd: 'Est. 1937',
    name: 'Ganga Govt. Museum, Bikaner',
    desc: 'Terracotta art, stone sculptures, Rajput & Mughal weaponry and rare coins.',
    tags: ['⚔ Weaponry', '🏺 Terracotta', '🪙 Coins'],
    time: '10AM–5PM',
    fee: '₹20/adult',
  },
]

export default function MuseumsSection(data: any) {
  return (
    <section className="sec bg-[var(--sand)]" id="museums">
      {/* Header */}
      <div className="sec-hd">
        <div>
          <div className="sec-lbl">✦ Top Museums</div>
          <h2 className="sec-ttl">Preserving History</h2>
        </div>
        <a href="#" className="see-all">See all →</a>
      </div>

      {/* Grid */}
      <div className="mus-grid">
        {MUSEUMS.map(({ img, imgTag, estd, name, desc, tags, time, fee }) => (
          <div key={name} className="mus-card">
            {/* Image */}
            <div className="mus-img">
              <div className="dimg" style={{ backgroundImage: `url('${img}')` }} />
              <div className="mus-img-grad" />
              <div className="mus-img-foot">
                <span className={`tag ${imgTag.cls}`} style={{ fontSize: 9 }}>{imgTag.label}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.7)' }}>{estd}</span>
              </div>
            </div>

            {/* Body */}
            <div className="mus-body">
              <h4>{name}</h4>
              <p>{desc}</p>
              <div className="mus-tags">
                {tags.map((t) => <span key={t} className="mus-tag">{t}</span>)}
              </div>
              <div className="mus-foot">
                <span className="mus-time">⏰ {time}</span>
                <span className="mus-fee">{fee}</span>
              </div>
              <button className="btn-sm btn-sm--full-mus">Book Tickets →</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
