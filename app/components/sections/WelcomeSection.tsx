'use client'

const WelcomeSection = () => {
  const features = [
    {
      icon: '🎟',
      title: 'Instant Booking',
      desc: 'Book entry tickets for all attractions without waiting in queues.',
    },
    {
      icon: '🗺',
      title: 'Explore Everything',
      desc: 'Discover monuments, wildlife parks, museums, and cultural venues.',
    },
    {
      icon: '🆘',
      title: '24/7 Support',
      desc: 'Emergency assistance available anytime, anywhere in Rajasthan.',
    },
  ]

  return (
    <section className="px-6 md:px-8 py-16 md:py-24 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-['Playfair Display',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C2017] mb-4">
          Welcome to Rajasthan Tourism OBMS
        </h2>
        <p className="text-base md:text-lg text-[#7A6A58] max-w-2xl mx-auto leading-relaxed">
          Your official gateway to book tickets for forts, wildlife safaris, museums, light & sound shows, and more. Enjoy seamless online booking with instant confirmations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-8 bg-white rounded-[22px] shadow-[0_4px_20px_rgba(24,18,14,0.10)] hover:shadow-[0_12px_48px_rgba(24,18,14,0.16)] transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="font-['Playfair Display',serif] text-xl font-bold text-[#2C2017] mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-[#7A6A58] leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WelcomeSection
