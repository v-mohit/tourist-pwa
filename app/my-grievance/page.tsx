'use client';

import Link from 'next/link';

export default function MyGrievancePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#E8631A] to-[#D4A017] flex items-center justify-center text-4xl mb-6 shadow-[0_8px_24px_rgba(232,99,26,0.25)]">
        📋
      </div>
      <h1 className="font-['Playfair_Display',serif] text-3xl font-bold text-[#2C2017] mb-3">
        My Grievance
      </h1>
      <p className="text-[#7A6A58] text-base max-w-sm mb-8">
        Your grievance tickets will appear here. This feature is coming soon.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-[#E8631A] text-white font-semibold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(232,99,26,0.3)]"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
