import { ReactNode } from 'react'

interface SectionWrapperProps {
  id?: string
  /** Tailwind / CSS-var background e.g. 'bg-[var(--cream)]' */
  bgClass?: string
  /** Small uppercase eyebrow text */
  label: string
  /** Colour of the label — defaults to saffron (--sf) */
  labelColorClass?: string
  /** Main section heading (can include <br /> or JSX) */
  title: ReactNode
  /** Heading colour class — defaults to charcoal (--ch) */
  titleColorClass?: string
  /** "See all" link text */
  seeAllText?: string
  /** Colour class for see-all link */
  seeAllColorClass?: string
  children: ReactNode
}

/**
 * Wraps every home page section with consistent padding,
 * the sec-hd label + title, and an optional "see all" link.
 *
 * Keeps individual section components free of layout boilerplate.
 */
export default function SectionWrapper({
  id,
  bgClass = 'bg-[var(--cream)]',
  label,
  labelColorClass = 'text-[var(--sf)]',
  title,
  titleColorClass = 'text-[var(--ch)]',
  seeAllText,
  seeAllColorClass = 'text-[var(--sf)]',
  children,
}: SectionWrapperProps) {
  return (
    <section id={id} className={`sec ${bgClass}`}>
      {/* Section header row */}
      <div className="sec-hd">
        <div>
          <div className={`sec-lbl ${labelColorClass}`}>{label}</div>
          <h2 className={`sec-ttl ${titleColorClass}`}>{title}</h2>
        </div>

        {seeAllText && (
          <a
            href="#"
            className={`see-all ${seeAllColorClass === 'text-[var(--gold)]' ? 'sag' : ''}`}
          >
            {seeAllText}
          </a>
        )}
      </div>

      {children}
    </section>
  )
}
