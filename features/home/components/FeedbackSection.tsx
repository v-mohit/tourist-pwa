import React from 'react';

const FeedbackSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Ananya Sharma",
      location: "Delhi · Apr 2025",
      avatar: "A",
      avatarBg: "linear-gradient(135deg,#E8631A,#D4A017)",
      stars: "⭐⭐⭐⭐⭐",
      quote: "The OBMS portal made our entire Jaipur trip seamless. Booked Amber Fort, Hawa Mahal and the Light & Sound show in one sitting — no queues, no hassle at the gate.",
      tag: "🏯 Jaipur Darshan Package"
    },
    {
      id: 2,
      name: "Rahul Mehta",
      location: "Mumbai · Mar 2025",
      avatar: "R",
      avatarBg: "linear-gradient(135deg,#1A6B3C,#22C55E)",
      stars: "⭐⭐⭐⭐⭐",
      quote: "Sariska Tiger Safari booking through OBMS was incredibly easy. The confirmation came instantly and the QR code worked perfectly at the entry gate. Saw 3 tigers!",
      tag: "🐯 Sariska Safari Booking"
    },
    {
      id: 3,
      name: "Priya Nair",
      location: "Bengaluru · Feb 2025",
      avatar: "P",
      avatarBg: "linear-gradient(135deg,#1A5276,#60A5FA)",
      stars: "⭐⭐⭐⭐⭐",
      quote: "Udaipur Darshan composite ticket gave us access to City Palace, Fateh Sagar and the boat ride. Amazing value! The SOS feature in the app gave us peace of mind throughout.",
      tag: "🌊 Udaipur Darshan Package"
    },
    {
      id: 4,
      name: "Suresh Patel",
      location: "Ahmedabad · Jan 2025",
      avatar: "S",
      avatarBg: "linear-gradient(135deg,#7C3AED,#C084FC)",
      stars: "⭐⭐⭐⭐☆",
      quote: "Booked Keoladeo National Park for our birding trip. Saw over 120 species in one day! The OBMS app had the park map offline — very useful inside the sanctuary.",
      tag: "🦅 Bharatpur Darshan"
    },
    {
      id: 5,
      name: "Meera Joshi",
      location: "Pune · Dec 2024",
      avatar: "M",
      avatarBg: "linear-gradient(135deg,#C04E0A,#E8631A)",
      stars: "⭐⭐⭐⭐⭐",
      quote: "The Kumbhalgarh Light & Sound show was breathtaking. So glad I booked in advance — the show was sold out! OBMS saved our entire trip plan.",
      tag: "✨ Kumbhalgarh L&S Show"
    },
    {
      id: 6,
      name: "Karan Singh",
      location: "Jaipur · Nov 2024",
      avatar: "K",
      avatarBg: "linear-gradient(135deg,#9A7D0A,#D4A017)",
      stars: "⭐⭐⭐⭐⭐",
      quote: "As a local, I use OBMS regularly for JKK events. The new events listing section is fantastic — I discovered the folk music festival through it and the tickets were just ₹150!",
      tag: "🎭 JKK Events"
    }
  ];

  const stats = [
    { label: "Overall Rating", value: "4.7", stars: "⭐⭐⭐⭐⭐" },
    { label: "Total Reviews", value: "12K+" },
    { label: "Recommend OBMS", value: "96%" },
    { label: "Avg. Booking Time", value: "2 Min" }
  ];

  return (
    <section className="sec" id="feedback">
      <div className="sec-hd">
        <div>
          <div className="sec-lbl">✦ Visitor Reviews</div>
          <h2 className="sec-ttl">What Tourists<br />Are Saying</h2>
        </div>
        <a href="#" className="see-all">View all reviews →</a>
      </div>

      <div className="feedback-stats">
        {stats.map((stat, idx) => (
          <div key={idx} className="fbstat">
            <div className="fbstat-n">{stat.value}</div>
            {stat.stars && <div style={{ fontSize: '18px', margin: '6px 0' }}>{stat.stars}</div>}
            <div className="fbstat-l">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-head">
              <div className="reviewer">
                <div 
                  className="reviewer-avatar" 
                  style={{ background: review.avatarBg }}
                >
                  {review.avatar}
                </div>
                <div>
                  <div className="reviewer-name">{review.name}</div>
                  <div className="reviewer-loc">📍 {review.location}</div>
                </div>
              </div>
              <div className="review-stars">{review.stars}</div>
            </div>
            <div className="review-quote">{review.quote}</div>
            <div className="review-tag">{review.tag}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '36px',
        padding: '28px',
        background: '#fff',
        borderRadius: 'var(--rl)',
        border: '1px solid var(--bdr)',
        boxShadow: 'var(--sh0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--ch)', marginBottom: '6px' }}>
            Visited a Rajasthan attraction?
          </div>
          <div style={{ fontSize: '13px', color: 'var(--mu)' }}>
            Share your experience and help other travellers plan their perfect trip.
          </div>
        </div>
        <button className="btn-p">⭐ Write a Review →</button>
      </div>
    </section>
  );
};

export default FeedbackSection;