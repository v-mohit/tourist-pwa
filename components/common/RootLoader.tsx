'use client'

import { useState, useEffect } from 'react'

export default function RootLoader() {
  const [isHiding, setIsHiding] = useState(false)

  useEffect(() => {
    // Hide loader when page is fully loaded or after timeout
    const timer = setTimeout(() => {
      setIsHiding(true)
    }, 1500)

    const handleLoad = () => {
      setIsHiding(true)
    }

    window.addEventListener('load', handleLoad)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  return (
    <div className={`loader-overlay ${isHiding ? 'loader-hiding' : ''}`}>
      <div className="loader-container">
        {/* Circular progress bar */}
        <svg className="loader-svg" viewBox="0 0 100 100">
          <circle className="loader-progress-circle" cx="50" cy="50" r="45" />
        </svg>

        {/* App icon */}
        <div className="loader-icon">
          🏯
        </div>
      </div>

      <style jsx>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(253, 248, 241, 0.98);
          z-index: 9999;
          backdrop-filter: blur(8px);
          opacity: 1;
          visibility: visible;
          transition: opacity 0.4s ease-out, visibility 0.4s ease-out;
        }

        .loader-overlay.loader-hiding {
          opacity: 0;
          visibility: hidden;
        }

        .loader-container {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-svg {
          position: absolute;
          width: 120px;
          height: 120px;
          transform: rotate(-90deg);
        }

        .loader-progress-circle {
          fill: none;
          stroke: url(#loaderGradient);
          stroke-width: 3;
          stroke-linecap: round;
          stroke-dasharray: 282.7;
          stroke-dashoffset: 282.7;
          animation: loaderSpin 1.2s ease-in-out infinite;
        }

        @keyframes loaderSpin {
          0% {
            stroke-dashoffset: 282.7;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        .loader-icon {
          position: relative;
          z-index: 2;
          width: 60px;
          height: 60px;
          border-radius: 10px;
          background: linear-gradient(135deg, #E8631A 0%, #D4A017 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          box-shadow: 0 4px 12px rgba(232, 99, 26, 0.3);
          flex-shrink: 0;
        }
      `}</style>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8631A" />
            <stop offset="100%" stopColor="#D4A017" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
