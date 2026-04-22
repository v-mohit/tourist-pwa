'use client';
import React, { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    id: 1,
    question: "When will my boarding pass be available?",
    answer: `Your boarding pass will be generated 1-2 hours before your scheduled shift time.`
  },
  {
    id: 2,
    question: "How will I know when my boarding pass is ready?",
    answer: `You will receive an SMS notification once your boarding pass has been generated.`
  },
  {
    id: 3,
    question: "How can I download my boarding pass?",
    answer: `You can download your boarding pass from the "My Booking" section by clicking on the three dots, or from the details page of booked place. To do this, enter your booking ID and the last four digits of the ID card of any one tourist.`
  },
  {
    id: 4,
    question: "How to book a ticket?",
    answer: `1. Search for the desired location and view the details.\n
             2. Click the Book Now button.\n
             3. Select the citizen type and quantity of tickets.\n
             4. Review the payment details. If everything looks correct, click the Make Payment button.\n
             5. Once the payment is successful, you can find your ticket in the My Bookings section of your account on our portal.`
  },
  {
    id: 5,
    question: "How do I view a booked ticket?",
    answer: `To check your booked ticket, log in using the ID you used for the booking. Go to the "My Bookings" section and use the date-wise filter to select your visit date. You will be able to see your booking details.`
  },
  {
    id: 6,
    question: " How do I cancel a booked ticket?",
    answer: `If the cancellation policy applies to your booking, go to the "My Bookings" section. Click the three dots next to the booked ticket, and you will see the option to cancel it. Please review the cancellation policy before proceeding.`
  },
  {
    id: 7,
    question: "What should I do if I haven't received a refund for my canceled ticket?",
    answer: ` If you haven't received your refund, please contact our help-desk for assistance or you can email the Forest Department to request your refund.`
  },
  {
    id: 8,
    question: "What should I do if the payment is deducted but I haven't received the ticket?",
    answer: `If your booking fails and the amount is deducted, it will be automatically refunded to the same payment method used for the transaction.`
  },
  {
    id: 9,
    question: "What if I don't have an SSO ID? How can I book a ticket?",
    answer: ` If you do not have an SSO ID, you can book a ticket by using the guest login with your mobile number or email address.`
  },
  {
    id: 10,
    question: "Do we accept international payment methods?",
    answer: `Yes, we accept all major international payment cards.You can make payments securely from anywhere in the world. If you encounter any issues while processing your payment, please ensure that your card is enabled for international transactions, and check with your bank for any restrictions that may apply.`
  },
  {
    id: 11,
    question: "How can I give  feedback?",
    answer: `In the "My Booking" section, click on the three dots to find the "Feedback" option. You can share your experience regarding the vehicle, driver, guide, and place.`
  },
  {
    id: 12,
    question: "How can I submit a grievance?",
    answer: `You can click on the help icon on the home page or in the "My Booking" section. Follow the prompts to submit your issue. Alternatively, you can email us or contact our helpdesk number for assistance.`
  },
];

const FAQPage = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-[#FDF8F1] min-h-screen">
      <main className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="see-all">
              ← Back to Home
            </Link>
          </div>
          <h1 className="font-['Playfair Display',serif] text-4xl md:text-5xl font-bold text-[#18120E] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#7A6A58] max-w-2xl mx-auto text-sm md:text-base">
            Everything you need to know about booking, boarding passes, refunds, and more. If you can&apos;t find your answer here, please reach out to our helpdesk.
          </p>
          <div className="w-20 h-1 bg-[#E8631A] mx-auto rounded-full mt-8"></div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                openId === faq.id ? 'border-[#E8631A] shadow-lg' : 'border-[#E8DAC5] shadow-sm hover:border-[#D4A017]'
              }`}
            >
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full text-left p-6 md:p-7 flex justify-between items-center gap-4 group"
              >
                <span className={`font-bold text-base md:text-lg transition-colors ${
                  openId === faq.id ? 'text-[#E8631A]' : 'text-[#18120E] group-hover:text-[#E8631A]'
                }`}>
                  {faq.question}
                </span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  openId === faq.id ? 'bg-[#E8631A] text-white rotate-180' : 'bg-[#FDF8F1] text-[#7A6A58]'
                }`}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openId === faq.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-6 md:p-7 pt-0 border-t border-[#F5E8CC] text-[#2C2017] leading-relaxed text-sm md:text-base whitespace-pre-line font-medium">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-[#18120E] rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl md:text-2xl font-['Playfair Display',serif] font-bold mb-2">Still have questions?</h3>
            <p className="text-[rgba(255,255,255,0.6)] text-sm md:text-base">We&apos;re here to help you with your journey.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a 
              href="mailto:helpdesk.tourist@rajasthan.gov.in" 
              className="bg-[#E8631A] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#C04E0A] transition-colors text-sm shadow-lg shadow-[rgba(232,99,26,0.3)]"
            >
              Contact Support
            </a>
            <Link 
              href="/about" 
              className="bg-white/10 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/20 transition-colors text-sm border border-white/20"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
