import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="w-24 h-24 rounded-[24px] bg-gradient-to-br from-[#E8631A] to-[#D4A017] flex items-center justify-center text-5xl mb-6 shadow-[0_8px_32px_rgba(232,99,26,0.25)]">
        🏯
      </div>

      {/* 404 number */}
      <p className="text-[80px] font-bold leading-none text-[#F5E8CC] mb-2 select-none">
        404
      </p>

      {/* Heading */}
      <h1 className="font-['Playfair_Display',serif] text-2xl md:text-3xl font-bold text-[#2C2017] mb-3">
        Page Not Found
      </h1>

      {/* Subtext */}
      <p className="text-[#7A6A58] text-base max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to exploring Rajasthan.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="px-8 py-3 bg-[#E8631A] text-white font-semibold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(232,99,26,0.3)]"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
