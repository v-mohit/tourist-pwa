'use client';
import React from "react";
import Link from "next/link";

const AboutUsPage = () => {
  return (
    <div className="bg-[#FDF8F1] min-h-screen">
      <main className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="see-all">
              ← Back to Home
            </Link>
          </div>
          <h1 className="font-['Playfair Display',serif] text-4xl md:text-5xl font-bold text-[#18120E] mb-4">
            About Us
          </h1>
          <div className="w-20 h-1 bg-[#E8631A] mx-auto rounded-full"></div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-[#E8DAC5] leading-relaxed text-[#2C2017]">
          <p className="mb-8 text-lg font-medium text-[#18120E]">
            Welcome to the Online Booking Management System (OBMS), the official online ticket booking platform by the Government of Rajasthan, powered by DoIT&C (Department of Information Technology and Communication).
          </p>

          <p className="mb-8">
            OBMS serves as a comprehensive platform, bringing together captivating destinations across Tourism, Forest, Archaeology & Museums. Whether you&apos;re drawn to the stunning wildlife sanctuaries and exciting safaris, the historical significance of museums, forts, palaces, and monuments, or the charm of parks and cafeterias throughout Rajasthan, OBMS offers real-time availability and instant booking for all.
          </p>

          <p className="mb-8">
            Beyond booking, OBMS provides reliable and up-to-date information about each location, empowering you to make informed decisions and enrich your travel experiences. Our official OBMS Mobile App acts as your convenient travel companion, offering real-time availability, immediate confirmation, and detailed destination insights. With our QR-based ticketing system, you&apos;ll receive a unique QR code upon booking, allowing for direct entry at various points and eliminating the need for queues, so you can maximize your exploration time. We also facilitate online boarding passes generation, online boarding pass verification, entry/exit verification, tracking of vehicle movement etc.
          </p>

          <p className="mb-8">
            To further enhance your journey, OBMS offers thoughtfully designed Single Composite Packages for various cities. These packages combine multiple attractions into a single, seamless booking, providing an effortless way to experience the best of Rajasthan’s culture, history, and wildlife.
          </p>

          <p className="mb-10 border-b border-[#F5E8CC] pb-10">
            OBMS caters to diverse travelers with special pricing for Indian citizens, foreign nationals, and students. Bookings and transactions are ensured through the secured payment gateway, accepting both national and international payment methods for all transactions. Our transparent cancellation policy ensures prompt refund processing for any cancellations. Additionally, our dedicated helpdesk is available to assist travelers with any pre-booking and post-booking inquiries, ensuring a smooth and hassle-free experience.
          </p>

          {/* Quick Info Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-5 rounded-2xl bg-[#FDF8F1] border border-[#F5E8CC] transition-transform hover:translate-y-[-4px]">
              <h3 className="font-bold text-[#18120E] mb-3 flex items-center gap-2">
                <span className="text-[#E8631A]">🌿</span> Wildlife & National Parks
              </h3>
              <p className="text-xs md:text-sm text-[#7A6A58]">
                Sariska Wildlife Sanctuary in Alwar, Mount Abu Wildlife Sanctuary in the Aravalli Hills, Keoladeo Ghana National Park in Bharatpur, Jhalana Leopard Reserve in Jaipur, Kumbalgarh Wildlife Sanctuary in Rajsamand and 16 more.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FDF8F1] border border-[#F5E8CC] transition-transform hover:translate-y-[-4px]">
              <h3 className="font-bold text-[#18120E] mb-3 flex items-center gap-2">
                <span className="text-[#E8631A]">🏛️</span> Museums
              </h3>
              <p className="text-xs md:text-sm text-[#7A6A58]">
                Albert Hall Museum in Jaipur, Bangad Government Museum in Pali, Kishori Mahal in Bharatpur, Government Museum in Udaipur and 19 more.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FDF8F1] border border-[#F5E8CC] transition-transform hover:translate-y-[-4px]">
              <h3 className="font-bold text-[#18120E] mb-3 flex items-center gap-2">
                <span className="text-[#E8631A]">🏰</span> Monuments & Forts
              </h3>
              <p className="text-xs md:text-sm text-[#7A6A58]">
                Amber Fort in Jaipur, Gagron Fort in Jhalawar, Hawa Mahal in Jaipur, Nahargarh Fort in Jaipur, Patwa Havelies in Jaisalmer and 8 more.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FDF8F1] border border-[#F5E8CC] transition-transform hover:translate-y-[-4px]">
              <h3 className="font-bold text-[#18120E] mb-3 flex items-center gap-2">
                <span className="text-[#E8631A]">☕</span> Parks and Cafeterias
              </h3>
              <p className="text-xs md:text-sm text-[#7A6A58]">
                Sisodia Rani Garden & Palace, Sawan Bhado, and Kishan Bagh in Jaipur, RTDC Durg Cafeteria at Nahargarh Fort and Masala Chowk in Jaipur and many more.
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-[#18120E] p-8 md:p-10 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm text-[rgba(255,255,255,0.7)] leading-relaxed mb-6 italic">
                &quot;As an initiative by the DoIT&C and Government of Rajasthan, OBMS is dedicated to leveraging technology to elevate your travel experience.&quot;
              </p>

              <p className="text-base font-semibold text-white mb-6">
                For more details and assistance, please refer to our FAQ section or reach out to our helpdesk.
              </p>

              <div className="flex flex-col md:flex-row md:items-center gap-8 pt-8 border-t border-[rgba(255,255,255,0.1)]">
                <div>
                  <span className="block text-[10px] uppercase tracking-[1.5px] font-bold text-[#D4A017] mb-1.5">Call Support</span>
                  <span className="text-xl font-bold text-white">0141-2923486</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-[1.5px] font-bold text-[#D4A017] mb-1.5">Official Email</span>
                  <a
                    href="mailto:helpdesk.tourist@rajasthan.gov.in"
                    className="text-white font-semibold hover:text-[#E8631A] transition-colors"
                  >
                    helpdesk.tourist@rajasthan.gov.in
                  </a>
                </div>
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#E8631A] opacity-10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUsPage;
