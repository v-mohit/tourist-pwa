'use client'

const StatsBar = () => {
  const stats = [
    { icon: '🌆', num: '34+', label: 'Cities' },
    { icon: '🏯', num: '60+', label: 'Monuments' },
    { icon: '🐯', num: '20+', label: 'Wildlife Parks' },
    { icon: '🎫', num: '10', label: 'Darshan Packages' },
    { icon: '🏛', num: '30+', label: 'Museums' },
    { icon: '🌿', num: '5+', label: 'City Parks' },
  ]

  return (
    <div className="stats-bar">
      {stats.map((stat, idx) => (
        <div key={idx} className="si">
          <span className="si-ico">{stat.icon}</span>
          <div>
            <div className="si-n">{stat.num}</div>
            <div className="si-l">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsBar
