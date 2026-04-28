import React from 'react';

const HotelSection = () => {
  const hotels = [
    {
      id: 1,
      name: "Hotel Khasa Khoti",
      loc: "Jaipur — Near Railway Station",
      price: "₹2,200",
      star: "4.1",
      tags: ["Heritage Property", "4 Star"],
      amenities: ["Restaurant", "Pool", "Wi-Fi"],
      img: "/images/KhasaKoti.webp"
    },
    {
      id: 2,
      name: "Hotel Anand Bhawan",
      loc: "Udaipur — Near Lake",
      price: "₹4,500",
      star: "4.4",
      tags: ["Palace Hotel", "4 Star", "Lakeside"],
      amenities: ["Restaurant", "Boating", "Room Service"],
      img: "/images/AnandBhawan.webp"
    },
    {
      id: 3,
      name: "Hotel Gavdi Talab",
      loc: "Jhalawar",
      price: "₹1,400",
      star: "3.9",
      tags: ["Desert Stay", "Budget"],
      amenities: ["Cafeteria", "Wi-Fi", "Parking"],
      img: "/images/gavdiTalab.webp"
    },
    {
      id: 4,
      name: "Hotel Teej",
      loc: "Jaipur — City Centre",
      price: "₹2,800",
      star: "4.0",
      tags: ["Government Hotel", "3 Star"],
      amenities: ["Restaurant", "Wi-Fi", "Gym"],
      img: "/images/hotel-teej.webp"
    },
    {
      id: 5,
      name: "Hotel Lake Palace",
      loc: "Alwar-siliserh",
      price: "₹3,600",
      star: "4.3",
      tags: ["Lakeside Palace", "Heritage"],
      amenities: ["Fine Dining", "Boating", "Lake View"],
      img: "/images/lake-palace.webp"
    },
    {
      id: 6,
      name: "Hotel Jhoomar Baori",
      loc: "Sawai Madhopur",
      price: "₹1,800",
      star: "3.8",
      tags: ["Government Hotel", "Budget"],
      amenities: ["Restaurant", "Wi-Fi", "City View"],
      img: "/images/JhoomarBaori.webp"
    }
  ];

  return (
    <section className="sec" id="rtdc">
      <div className="sec-hd">
        <div>
          <div className="sec-lbl">✦ RTDC Heritage Hotels</div>
          <h2 className="sec-ttl">Stay in a Royal Government Hotel</h2>
        </div>
        {/* <a href="#" className="see-all">View all hotels →</a> */}
      </div>

      <div className="rtdc-grid">
        {hotels.map((hotel) => (
          <div className="rtdc-card" key={hotel.id}>
            <div className="rtdc-img">
              <div 
                className="dimg" 
                style={{ backgroundImage: `url('${hotel.img}')` }}
                role="img" 
                aria-label={hotel.name}
              ></div>
              <div className="rtdc-img-grad"></div>
              <div className="rtdc-img-foot">
                <span className="rtdc-badge">RTDC Official</span>
                <div className="rtdc-star">⭐ {hotel.star}</div>
              </div>
            </div>
            <div className="rtdc-body">
              <h4>{hotel.name}</h4>
              <div className="rtdc-loc">
                <img src="/icons/google-maps.png" width={12} height={12} alt="Location" className="loc-ico mr-1" />
                {hotel.loc}
              </div>
              <div className="rtdc-tags">
                {hotel.tags.map((tag, idx) => (
                  <span className="rtdc-tag" key={idx}>{tag}</span>
                ))}
              </div>
              <div className="rtdc-amenities">
                {hotel.amenities.map((am, idx) => (
                  <span className="rtdc-am" key={idx}>{am}</span>
                ))}
              </div>
              <div className="rtdc-foot">
                {/* <div className="rtdc-price">
                  <div className="rtdc-price-amt">{hotel.price}</div>
                  <div className="rtdc-price-per">per night onwards</div>
                </div> */}
                <button className="btn-s book-btn">Upcoming →</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RTDC Info Banner */}
      <div style={{ marginTop: '32px', padding: '24px 28px', background: 'linear-gradient(135deg, var(--ch), #2C1A0E)', borderRadius: 'var(--rl)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff', marginBottom: '6px' }}>
             25+ RTDC Properties Across Rajasthan
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.55)', lineHeight: '1.6' }}>
            Government-backed hotels, palaces & rest houses at every major destination. Trusted, affordable & officially bookable on OBMS.
          </div>
        </div>
        <button className="btn-p">Browse All RTDC Hotels →</button>
      </div>
    </section>
  );
};

export default HotelSection;