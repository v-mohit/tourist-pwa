'use client'

import { useAuth } from '@/features/auth/context/AuthContext'

interface CtaSectionProps {
  onBook: () => void
}

export default function CtaSection({ onBook }: CtaSectionProps) {
  const { user } = useAuth()

  if (user) return null
  return (
    <section
      className="text-center"
      style={{
        padding: '60px clamp(22px, 5vw, 60px)',
        background: 'linear-gradient(135deg, var(--sf) 0%, var(--sf2) 100%)',
      }}
    >
      <h2
        className="text-white"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          marginBottom: 14,
        }}
      >
        Ready to explore Rajasthan?
      </h2>

      <p
        style={{ fontSize: 15, color: 'rgba(255,255,255,.8)', marginBottom: 32, lineHeight: 1.7 }}
      >
        Book tickets, plan safaris, and discover the Land of Kings — all in one place.
      </p>

      <button className="btn-p" onClick={onBook} style={{ background: '#fff', color: 'var(--sf)', boxShadow: '0 4px 20px rgba(0,0,0,.18)' }}>
        🎟 Start Booking
      </button>
    </section>
  )
}
