"use client";

import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '@/app/actions/chat';
import SosPopup from '@/components/modals/SosPopup';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getCookie } from 'cookies-next';
import { AUTHENTICATION_TOKEN } from '@/utils/constants/common.constants';
import {
  ChatBotBookingAction,
  GetChatBotCancelledData,
  GetChatBotTranstactionData
} from '@/services/apiCalls/booking.services';
import { showErrorToastMessage } from '@/utils/toast.utils';
import ReactMarkdown from 'react-markdown';

const FloatingHelpdesk = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'FAQ' | 'Contact' | 'Chat' | 'ChatbotAI'>('Chat');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot', text: string, isTxn?: boolean, txnId?: string }[]>([{ sender: 'bot', text: 'Hi! How can I help you?' }]);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([{ sender: 'bot', text: 'Hi! I am your AI assistant. How can I help you today?' }]);
  const [inputValue, setInputValue] = useState('');
  const [chatInputValue, setChatInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatTabEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, openLoginModal, user } = useAuth();

  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [bookingPrompt, setBookingPrompt] = useState(false);
  const [showMainOptions, setShowMainOptions] = useState(true);
  const [txnFlow, setTxnFlow] = useState(false);
  const [subFlow, setSubFlow] = useState(false);
  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);
  const [subOptions, setSubOptions] = useState<{ label: string, value: string }[]>([]);

  const userId = user?.sub || "";

  // ChatBot Services
  const { mutate: chatBotMutate } = ChatBotBookingAction(
    (res: any) => {
      setIsChatLoading(false);
      if (res?.ticketBookingDetailDtos?.length) {
        setChatMessages(prev => [...prev, { sender: 'bot', text: "Ticket details found. Processing your request..." }]);
      } else if (res?.finalResponse) {
        setChatMessages(prev => [...prev, { sender: 'bot', text: `Payment Status - ${res?.finalResponse.eMitraStatus}` }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'bot', text: "Booking Id not found or something went wrong." }]);
      }
    },
    () => {
      setIsChatLoading(false);
      setChatMessages(prev => [...prev, { sender: 'bot', text: "Something went wrong while processing your request." }]);
    }
  );

  const { mutate: chatBotTransactionMutate } = GetChatBotTranstactionData(
    (res: any) => {
      setIsChatLoading(false);
      if (res?.length > 0) {
        const txnMsgs = res.slice(0, 5).map((txn: any, idx: number) => ({
          sender: 'bot',
          text: `${idx + 1}. Booking ID: ${txn.bookingId}\nStatus: ${txn.paymentStatus}\nDate: ${new Date(txn.bookingDate).toLocaleDateString()}`,
          isTxn: true,
          txnId: txn.bookingId
        }));
        setChatMessages(prev => [...prev, ...txnMsgs]);
        setTxnFlow(true);
      } else {
        setChatMessages(prev => [...prev, { sender: 'bot', text: "No transactions found." }]);
      }
    },
    () => {
      setIsChatLoading(false);
      setChatMessages(prev => [...prev, { sender: 'bot', text: "Failed to fetch transactions." }]);
    }
  );

  const { mutate: chatBotCancelledMutate } = GetChatBotCancelledData(
    (res: any) => {
      setIsChatLoading(false);
      if (res?.length > 0) {
        const txnMsgs = res.map((txn: any, idx: number) => ({
          sender: 'bot',
          text: `${idx + 1}. Booking ID: ${txn.bookingId}\nStatus: Cancelled\nDate: ${new Date(txn.bookingDate).toLocaleDateString()}`,
          isTxn: true,
          txnId: txn.bookingId
        }));
        setChatMessages(prev => [...prev, ...txnMsgs]);
        setTxnFlow(true);
      } else {
        setChatMessages(prev => [...prev, { sender: 'bot', text: "No cancelled data found." }]);
      }
    },
    () => {
      setIsChatLoading(false);
      setChatMessages(prev => [...prev, { sender: 'bot', text: "Failed to fetch cancelled data." }]);
    }
  );

  const handleOptionSelect = (option: { label: string, value: string }) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    setChatMessages(prev => [...prev, { sender: 'user', text: option.label }]);
    setSelectedIntent(option.value);
    setShowMainOptions(false);

    if (option.value === 'last_5_transaction') {
      setIsChatLoading(true);
      chatBotTransactionMutate({ userId });
    } else if (option.value === 'view_cancelled_data') {
      setIsChatLoading(true);
      chatBotCancelledMutate({ userId });
    } else if (option.value === 'grievance') {
      window.location.href = '/query-tickets';
    } else {
      setChatMessages(prev => [...prev, { sender: 'bot', text: 'Please enter Booking Id' }]);
      setBookingPrompt(true);
    }
  };

  const handleTxnClick = (txnId: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: `Selected Booking Id - ${txnId}` }]);
    setSelectedTxnId(txnId);
    setTxnFlow(false);

    // In a real app, you might fetch specific options for this txn
    const dynamicOptions = [
      { label: 'Download Ticket', value: 'download_ticket' },
      { label: 'Refund Status', value: 'refund_status' }
    ];
    setSubOptions(dynamicOptions);
    setSubFlow(true);
  };

  const handleSubOptionSelect = (option: { label: string, value: string }) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: option.label }]);
    setIsChatLoading(true);
    chatBotMutate({
      userId,
      action: option.value,
      bookingId: selectedTxnId || ""
    });
    setSubFlow(false);
  };

  const handleChatSendMessage = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (!chatInputValue.trim() || !bookingPrompt) return;

    const userMsg = chatInputValue.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInputValue('');
    setBookingPrompt(false);
    setIsChatLoading(true);

    chatBotMutate({
      userId,
      action: selectedIntent || "",
      bookingId: userMsg
    });
  };

  const handleQueryClick = (query: string) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    const option = [
      { label: 'View Last 5 Transaction', value: 'last_5_transaction' },
      { label: 'Download Ticket', value: 'download_ticket' },
      { label: 'Download Boarding Pass', value: 'download_boarding_pass' },
      { label: 'View Cancelled Data', value: 'view_cancelled_data' },
      { label: 'Refund Status', value: 'refund_status' },
      { label: 'Grievance', value: 'grievance' },
    ].find(o => o.label === query);

    if (option) handleOptionSelect(option);
  };

  const clearChat = () => {
    setChatMessages([{ sender: 'bot', text: 'Hi! How can I help you?' }]);
    setMessages([{ sender: 'bot', text: 'Hi! I am your AI assistant. How can I help you today?' }]);
    setShowMainOptions(true);
    setTxnFlow(false);
    setSubFlow(false);
    setBookingPrompt(false);
    setChatInputValue('');
    setInputValue('');
    setExpandedFaq(null);
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
    } else if (activeTab === 'Chat') {
      chatTabEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatMessages, activeTab]);

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
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
      {/* Helpdesk Modal - Vertically Centered on Right */}
      {isOpen && (
        <div className="helpdesk-modal-wrapper">
          <div className="helpdesk-modal">
            {/* Header */}
            <div className="helpdesk-header">
              <h3 className="font-bold text-lg">Helpdesk Support</h3>
              <div className="flex gap-4">
                <button
                  onClick={clearChat}
                  className="hover:opacity-80 transition-opacity"
                  title="Clear Chat"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                </button>
                <button onClick={toggleModal} className="hover:opacity-80 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white">
              {['FAQ', 'Contact', 'Chat', 'ChatbotAI'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    if ((tab === 'Chat' || tab === 'ChatbotAI') && !isAuthenticated) {
                      openLoginModal();
                      return;
                    }
                    setActiveTab(tab as any);
                  }}
                  className={activeTab === tab ? "helpdesk-tab helpdesk-tab-active" : "helpdesk-tab"}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="helpdesk-content">
              {activeTab === 'Chat' && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto pr-1 flex flex-col">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        onClick={() => msg.isTxn && msg.txnId && handleTxnClick(msg.txnId)}
                        className={msg.sender === 'user' ? "helpdesk-chat-bubble-user" : "helpdesk-chat-bubble-bot"}
                        style={msg.isTxn ? { cursor: 'pointer', border: '2px solid #E8631A', backgroundColor: '#FFF5F0' } : {}}
                      >
                        {msg.sender === 'bot' ? (
                          <div className="markdown-content">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                    ))}

                    {isChatLoading && (
                      <div className="helpdesk-typing-indicator mb-4">
                        <span className="helpdesk-typing-dot"></span>
                        <span className="helpdesk-typing-dot delay-100"></span>
                        <span className="helpdesk-typing-dot delay-200"></span>
                      </div>
                    )}

                    {showMainOptions && !isChatLoading && (
                      <div className="flex flex-col mb-4">
                        {[
                          { label: 'View Last 5 Transaction', value: 'last_5_transaction' },
                          { label: 'Download Ticket', value: 'download_ticket' },
                          { label: 'Download Boarding Pass', value: 'download_boarding_pass' },
                          { label: 'View Cancelled Data', value: 'view_cancelled_data' },
                          { label: 'Refund Status', value: 'refund_status' },
                          { label: 'Grievance', value: 'grievance' },
                        ].map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(option)}
                            className="helpdesk-quick-action-btn"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {subFlow && !isChatLoading && (
                      <div className="flex flex-col mb-4">
                        {subOptions.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSubOptionSelect(option)}
                            className="helpdesk-quick-action-btn border-[#20C1D6] bg-[#E9FBFC] text-[#0A6A78] hover:bg-[#D4F4F7]"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div ref={chatTabEndRef} />
                  </div>

                  {!showMainOptions && !txnFlow && !subFlow && (
                    <div className="helpdesk-chat-footer -mx-4 -mb-4 mt-auto">
                      <input
                        type="text"
                        value={chatInputValue}
                        onChange={(e) => setChatInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSendMessage()}
                        placeholder={bookingPrompt ? "Enter Booking ID" : "Type message..."}
                        className="helpdesk-chat-input"
                      />
                      <button
                        onClick={handleChatSendMessage}
                        disabled={isChatLoading || !chatInputValue.trim()}
                        className="helpdesk-chat-send-btn"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                      </button>
                    </div>
                  )}

                  {(txnFlow || subFlow || !showMainOptions) && (
                    <button
                      onClick={() => {
                        setShowMainOptions(true);
                        setTxnFlow(false);
                        setSubFlow(false);
                        setBookingPrompt(false);
                      }}
                      className="text-[12px] text-[#E8631A] font-bold py-2 hover:underline self-center flex-shrink-0"
                    >
                      ← Back to Main Menu
                    </button>
                  )}
                </div>
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
                <div className="flex flex-col">
                  {contactOptions.map((contact, idx) => (
                    <div key={idx} className="helpdesk-contact-card">
                      <div className="helpdesk-contact-icon-wrapper">
                        {contact.icon}
                      </div>
                      <div className="flex-1">
                        <div className="helpdesk-contact-title">{contact.title}</div>
                        <div className="helpdesk-contact-desc">{contact.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'ChatbotAI' && (
                <div className="helpdesk-ai-container">
                  <div className="helpdesk-ai-messages flex-1">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={msg.sender === 'user' ? "helpdesk-chat-bubble-user" : "helpdesk-chat-bubble-bot"}
                      >
                        {msg.sender === 'bot' ? (
                          <div className="markdown-content">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="helpdesk-typing-indicator mb-4">
                        <span className="helpdesk-typing-dot"></span>
                        <span className="helpdesk-typing-dot delay-100"></span>
                        <span className="helpdesk-typing-dot delay-200"></span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="helpdesk-chat-footer -mx-4 -mb-4 mt-auto">
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
        </div>
      )}

      {/* Floating Buttons Group - Bottom Right */}
      <div className="fixed bottom-3 right-6 z-[9999] flex flex-col items-end gap-4">

        {/* Floating Buttons Group */}
        <div className="helpdesk-fab-container">

          {/* Chat Bot Button */}
          <button
            onClick={toggleModal}
            className={`fab-main ${isOpen ? 'active' : ''}`}
            aria-label="Open Chatbot"
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="white">
              <path d="M27.7666 26.5813C26.9563 24.1884 25.9478 21.1523 22.0314 21.1523H19.9106C20.5438 20.6457 21.1183 20.0695 21.5712 19.3945H22.0314C24.4544 19.3945 26.4259 17.423 26.4259 15C26.4259 13.7278 26.4259 12.7565 26.4259 11.4844C26.4259 5.1844 21.3001 0 15.0001 0C8.5565 0 3.4873 5.3563 3.5752 11.6329C3.5741 13.5683 3.5743 12.8646 3.5743 15C3.5743 17.423 5.5458 19.3945 7.9689 19.3945H8.429C8.8819 20.0695 9.4564 20.0695 10.0896 21.1523H7.9689C4.0524 21.1523 3.0439 24.1884 2.2336 26.5805C1.6607 28.2714 2.9886 30 4.7571 30H25.2432C27.0176 30 28.3377 28.2652 27.7666 26.5813Z"/>
            </svg>
          </button>

          <div className="flex items-end gap-3">
            {/* Scroll Indicator */}
            {/* <div className="flex flex-col items-center mr-2 mb-2">
            <div className="scroll-indicator-fab">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8631A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
            </div>
            <span className="text-white text-[12px] font-medium tracking-wide drop-shadow-md leading-tight text-center max-w-[80px]">
              Scroll Page to view more
            </span>
          </div> */}

            {/* SOS Button */}
            {/* <button 
            onClick={() => setIsSosOpen(true)}
            className="fab-sos">
            SOS
          </button> */}
          </div>

        </div>
      </div>
    </>
  );
};

export default FloatingHelpdesk;

