const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Select Template',
      description: 'Submit your message template for WhatsApp approval'
    },
    {
      number: '02',
      title: 'Upload Contacts',
      description: 'Import your contact list via CSV or API integration'
    },
    {
      number: '03',
      title: 'Send Campaign',
      description: 'Schedule and send your bulk message campaign'
    }
  ];

  return (
    <section className="bg-white py-10 xl:py-20">
      <div className="container paddingContainer">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-black mb-2 lg:mb-3">
            How It Works
          </h2>
          <p className="text-[16px] lg:text-lg text-[#454545]">
            Get started in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Number Badge */}
              <div className="flex justify-center mb-2 sm:mb-6">
                <div className="w-14 h-14 bg-[#4ED35C] rounded-full flex items-center justify-center  border-4 border-[#ECE5DB]">
                  <span className="text-white text-lg font-bold">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-medium text-black mb-1.5 sm:mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[#454545] text-sm sm:text-[16px] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;