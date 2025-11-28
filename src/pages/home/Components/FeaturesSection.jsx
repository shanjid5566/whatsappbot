
import { BiBarChart, BiMessageSquare, BiShield } from 'react-icons/bi';
import { FiZap } from 'react-icons/fi';

const FeaturesSection = () => {
  const features = [
    {
      icon: BiMessageSquare,
      iconBg: 'bg-yellow-400',
      title: 'Bulk Messaging',
      description: 'Send thousands of WhatsApp messages to your customers instantly with our powerful bulk messaging system.'
    },
    {
      icon: FiZap,
      iconBg: 'bg-pink-500',
      title: 'Lightning Fast',
      description: 'Our platform delivers messages at incredible speeds, ensuring your campaigns reach customers when it matters most.'
    },
    {
      icon: BiBarChart,
      iconBg: 'bg-blue-500',
      title: 'Advanced Analytics',
      description: 'Track delivery rates, read receipts, and campaign performance with detailed analytics and reporting. help you reach '
    },
    {
      icon: BiShield,
      iconBg: 'bg-green-500',
      title: 'Enterprise Security',
      description: 'Your data is protected with enterprise-grade security and compliance with WhatsApp Business API policies.'
    }
  ];

  return (
    <section className="bg-[#F5F2EC] py-10 xl:py-20">
      <div className="container paddingContainer">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-black mb-2 lg:mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-[16px] lg:text-lg text-[#454545]">
            Powerful features designed to help you reach your customers effectively
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 lg:gap-6">
          {features?.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Icon */}
              <div className={`lg:w-14 sm:w-12 w-8 h-8 lg:h-14 sm:h-12 ${feature.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-6`}>
                <feature.icon className="sm:w-6 sm:h-6 text-white" strokeWidth={2} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-medium text-black mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[#454545] text-sm sm:text-[16px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;