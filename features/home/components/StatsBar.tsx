const STATS = [
  { icon: '🌆', num: '34+', label: 'Cities' },
  { icon: '🏯', num: '60+', label: 'Monuments' },
  { icon: '🐯', num: '20+', label: 'Wildlife Parks' },
  { icon: '🎫', num: '10',  label: 'Darshan Packages' },
  { icon: '🏛',  num: '30+', label: 'Museums' },
  { icon: '🌿', num: '5+',  label: 'City Parks' },
]

export default function StatsBar() {
  return (
    <div className="stats-bar">
      {STATS.map(({ icon, num, label }) => (
        <div key={label} className="si">
          <span className="si-ico">{icon}</span>
          <div>
            <div className="si-n">{num}</div>
            <div className="si-l">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
