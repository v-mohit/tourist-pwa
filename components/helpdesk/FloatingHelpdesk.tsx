"use client";

import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '@/app/actions/chat';
import SosPopup from '@/components/modals/SosPopup';
import { useAuth } from '@/features/auth/context/AuthContext';

const FloatingHelpdesk = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'FAQ' | 'Contact' | 'Chat' | 'ChatbotAI'>('Chat');
  const [messages, setMessages] = useState<{sender: 'user'|'bot', text: string}[]>([{sender: 'bot', text: 'Hi! I am your AI assistant. How can I help you today?'}]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleQueryClick = (query: string) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    // Logic for handling queries after login will go here
    console.log(`Handling query: ${query}`);
  };

  const faqs = [
    {
      question: "When will my boarding pass be available?",
      answer: "Your boarding pass will be generated 1-2 hours before your scheduled shift time."
    },
    {
      question: "How will I know when my boarding pass is ready?",
      answer: "You will receive an SMS notification once your boarding pass has been generated."
    },
    {
      question: "How can I download my boarding pass?",
      answer: "You can download your boarding pass from the 'My Booking' section by clicking on the three dots, or from the details page of booked place. To do this, enter your booking ID and the last four digits of the ID card of any one tourist."
    },
    {
      question: "How to book a ticket?",
      answer: "1. Search for the desired location and view the details.\n2. Click the Book Now button.\n3. Select the citizen type and quantity of tickets.\n4. Review the payment details. If everything looks correct, click the Make Payment button.\n5. Once the payment is successful, you can find your ticket in the My Bookings section of your account on our portal."
    },
    {
      question: "How do I view a booked ticket?",
      answer: "To check your booked ticket, log in using the ID you used for the booking. Go to the 'My Bookings' section and use the date-wise filter to select your visit date. You will be able to see your booking details."
    },
    {
      question: "How do I cancel a booked ticket?",
      answer: "If the cancellation policy applies to your booking, go to the 'My Bookings' section. Click the three dots next to the booked ticket, and you will see the option to cancel it. Please review the cancellation policy before proceeding."
    },
    {
      question: "What should I do if I haven't received a refund for my canceled ticket?",
      answer: "If you haven't received your refund, please contact our help-desk for assistance or you can email the Forest Department to request your refund."
    },
    {
      question: "What should I do if the payment is deducted but I haven't received the ticket?",
      answer: "If your booking fails and the amount is deducted, it will be automatically refunded to the same payment method used for the transaction."
    },
    {
      question: "What if I don't have an SSO ID?",
      answer: "If you do not have an SSO ID, you can book a ticket by using the guest login with your mobile number or email address."
    },
    {
      question: "Do we accept international payment methods?",
      answer: "Yes, we accept all major international payment cards. You can make payments securely from anywhere in the world. If you encounter any issues while processing your payment, please ensure that your card is enabled for international transactions, and check with your bank for any restrictions that may apply."
    },
    {
      question: "How can I give feedback?",
      answer: "In the 'My Booking' section, click on the three dots to find the 'Feedback' option. You can share your experience regarding the vehicle, driver, guide, and place."
    },
    {
      question: "How can I submit a grievance?",
      answer: "You can click on the help icon on the home page or in the 'My Booking' section. Follow the prompts to submit your issue. Alternatively, you can email us or contact our helpdesk number for assistance."
    }
  ];

  const contactOptions = [
    { title: "Call Us", desc: "01412923486, 01412921311", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg> },
    { title: "Email Us", desc: "helpdesk.tourist@rajasthan.gov.in", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg> },
    { title: "Live Chat", desc: "Available 24/7 for urgent queries", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" /></svg> },
    { title: "Visit Office", desc: "123 Heritage Lane, Jaipur", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg> }
  ];

  useEffect(() => {
    if (activeTab === 'ChatbotAI') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage);
      if (response.success && response.answer) {
        setMessages(prev => [...prev, { sender: 'bot', text: response.answer }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: response.error || 'Sorry, I could not understand the response.' }]);
      }
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      <SosPopup isOpen={isSosOpen} setIsOpen={setIsSosOpen} />
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Helpdesk Modal */}
      {isOpen && (
        <div className="helpdesk-modal">
          {/* Header */}
          <div className="helpdesk-header">
            <h3 className="font-bold text-lg">Helpdesk Support</h3>
            <div className="flex gap-4">
              <button className="hover:opacity-80 transition-opacity">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              <button onClick={toggleModal} className="hover:opacity-80 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white">
            {['FAQ', 'Contact', 'Chat', 'ChatbotAI'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={activeTab === tab ? "helpdesk-tab helpdesk-tab-active" : "helpdesk-tab"}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="helpdesk-content">
            {activeTab === 'Chat' && (
              <>
                <div className="helpdesk-chat-bubble-bot">
                  Hi! How can I help you?
                </div>
                
                <div className="flex flex-col gap-3 mt-3">
                  <button 
                    onClick={() => handleQueryClick('View Last 5 Transaction')}
                    className="helpdesk-quick-action-btn"
                  >
                    View Last 5 Transaction
                  </button>
                  <button 
                    onClick={() => handleQueryClick('Download Ticket')}
                    className="helpdesk-quick-action-btn"
                  >
                    Download Ticket
                  </button>
                  <button 
                    onClick={() => handleQueryClick('Download Boarding Pass')}
                    className="helpdesk-quick-action-btn"
                  >
                    Download Boarding Pass
                  </button>
                  <button 
                    onClick={() => handleQueryClick('View Cancelled Data')}
                    className="helpdesk-quick-action-btn"
                  >
                    View Cancelled Data
                  </button>
                  <button 
                    onClick={() => handleQueryClick('Refund Status')}
                    className="helpdesk-quick-action-btn"
                  >
                    Refund Status
                  </button>
                  <button 
                    onClick={() => handleQueryClick('Grievance')}
                    className="helpdesk-quick-action-btn"
                  >
                    Grievance
                  </button>
                </div>
              </>
            )}
            {activeTab === 'FAQ' && (
              <div className="flex flex-col">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="helpdesk-faq-item">
                    <button 
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="helpdesk-faq-question"
                    >
                      <span className="helpdesk-faq-question-text">{faq.question}</span>
                      <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedFaq === idx ? 'rotate-180' : ''}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedFaq === idx && (
                      <div className="helpdesk-faq-answer">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'Contact' && (
              <div className="flex flex-col gap-4">
                {contactOptions.map((contact, idx) => (
                  <div key={idx} className="helpdesk-contact-card">
                    <div className="helpdesk-contact-icon-wrapper">
                      {contact.icon}
                    </div>
                    <div>
                      <div className="helpdesk-contact-title">{contact.title}</div>
                      <div className="helpdesk-contact-desc">{contact.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'ChatbotAI' && (
              <div className="helpdesk-ai-container">
                <div className="helpdesk-ai-messages">
                  {messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={msg.sender === 'user' ? "helpdesk-chat-bubble-user" : "helpdesk-chat-bubble-bot"}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="helpdesk-typing-indicator">
                      <span className="helpdesk-typing-dot"></span>
                      <span className="helpdesk-typing-dot delay-100"></span>
                      <span className="helpdesk-typing-dot delay-200"></span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="helpdesk-chat-footer">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="helpdesk-chat-input"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="helpdesk-chat-send-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Buttons Group */}
      <div className="flex flex-col items-end gap-4">
        
        {/* Chat Bot Button */}
        <button 
          onClick={toggleModal}
          className="fab-main"
        >
          <svg width="40" height="40" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M47.7666 46.5813C46.9563 44.1884 45.9478 41.1523 42.0314 41.1523H39.9106C40.5438 40.6457 41.1183 40.0695 41.5712 39.3945H42.0314C44.4544 39.3945 46.4259 37.423 46.4259 35C46.4259 33.7278 46.4259 32.7565 46.4259 31.4844C46.4259 25.1844 41.3001 20 35.0001 20C28.5565 20 23.4873 25.3563 23.5752 31.6329C23.5741 33.5683 23.5743 32.8646 23.5743 35C23.5743 37.423 25.5458 39.3945 27.9689 39.3945H28.429C28.8819 40.0695 29.4564 40.0695 30.0896 41.1523H27.9689C24.0524 41.1523 23.0439 44.1884 22.2336 46.5805C21.6607 48.2714 22.9886 50 24.7571 50H45.2432C47.0176 50 48.3377 48.2652 47.7666 46.5813ZM27.1788 30.6055H26.211C25.929 30.6055 25.6623 30.6617 25.4073 30.7441C25.8112 25.457 30.1452 21.7578 35.0001 21.7578C40.0852 21.7578 44.2563 25.7649 44.6312 30.7559C44.3652 30.6654 44.0853 30.6055 43.7892 30.6055H42.8214C42.3777 26.6612 39.0611 23.5156 35.0001 23.5156C30.9391 23.5156 27.6225 26.6612 27.1788 30.6055ZM35.0001 47.656L31.4841 42.9102H38.516L35.0001 47.656ZM35.0001 41.1523C31.6081 41.1523 28.8478 38.392 28.8478 35V34.1211H31.4845C32.9271 34.1211 34.1984 33.413 35.0001 32.3362C35.8018 33.413 37.0731 34.1211 38.5157 34.1211H41.1524V35C41.1524 35.9472 40.9194 36.8344 40.5353 37.6367H36.7579C36.2721 37.6367 35.879 38.0298 35.879 38.5156C35.879 39.0014 36.2721 39.3887 36.7579 39.3887H39.2922C38.1825 40.4726 36.6699 41.1523 35.0001 41.1523Z" fill="#E8631A" />
          </svg>
        </button>
        
        <div className="flex items-end gap-3">
          {/* Scroll Indicator */}
          <div className="flex flex-col items-center mr-2 mb-2">
            <div className="scroll-indicator-fab">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8631A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
            </div>
            <span className="text-white text-[12px] font-medium tracking-wide drop-shadow-md leading-tight text-center max-w-[80px]">
              Scroll Page to view more
            </span>
          </div>

          {/* SOS Button */}
          <button 
            onClick={() => setIsSosOpen(true)}
            className="fab-sos">
            SOS
          </button>
        </div>

      </div>
    </div>
    </>
  );
};

export default FloatingHelpdesk;

