
import { BiCheck } from 'react-icons/bi';

const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses',
      price: '$29',
      period: '/month',
      features: [
        '5,000 messages/month',
        '5 approved templates',
        'Basic analytics',
        'Email support',
        'API access'
      ],
      popular: false,
      buttonStyle: 'border border-black text-gray-700 hover:bg-gray-50'
    },
    {
      name: 'Professional',
      description: 'For growing teams',
      price: '$99',
      period: '/month',
      features: [
        '25,000 messages/month',
        'Unlimited templates',
        'Advanced analytics',
        'Priority support',
        'API access',
        'Custom integrations'
      ],
      popular: true,
      buttonStyle: 'bg-[#4ED35C] text-white hover:bg-green-600'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      price: '$299',
      period: '/month',
      features: [
        '100,000 messages/month',
        'Unlimited templates',
        'Real-time analytics',
        '24/7 dedicated support',
        'API access',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: false,
      buttonStyle: 'border border-black text-[#454545] hover:bg-gray-50'
    }
  ];

  return (
    <section className="bg-[#F4F4F4] py-10 xl:pb-20 xl:pt-14">
      <div className="container paddingContainer">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-black mb-2 lg:mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-[16px] lg:text-lg text-[#454545]">
            Choose the plan that fits your business needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 xl:gap-6">
          {plans?.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-6 relative flex flex-col ${
                plan.popular ? 'border-2 border-[#4ED35C] shadow-lg' : 'border border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-6 right-6">
                  <span className="bg-[#FF0052] text-white text-xs xl:text-[16px] font-normal px-2 py-1 xl:px-4 xl:py-2 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-medium text-black mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm sm:text-[16px] text-[#454545]">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-2xl sm:text-3xl font-bold text-black">
                    {plan.price}
                  </span>
                  <span className="text-[#454545] ml-2">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="xl:space-y-3 space-y-2 mb-8 grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <BiCheck className="w-5 h-5 text-[#4ED35C] shrink-0 mt-0.5" />
                    <span className="text-[#454545] text-sm sm:text-[16px]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-3 rounded cursor-pointer font-normal text-sm lg:text-[16px] transition-colors duration-200 ${plan.buttonStyle}`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;