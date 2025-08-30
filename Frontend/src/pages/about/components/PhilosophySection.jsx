import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const PhilosophySection = () => {
  const [activePhilosophy, setActivePhilosophy] = useState(0);

  // Digital Journey Steps
  const philosophySteps = [
    {
      title: "Discover the Challenge",
      description:
        "Understand your business, goals, and user needs.",
      icon: "Search",
      color: "from-blue-500 to-blue-600",
      illustration:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      title: "Build the Right Solution",
      description:
        "Design tailored strategies, apps, or web platforms.",
      icon: "Key",
      color: "from-purple-500 to-purple-600",
      illustration:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80",
    },
    {
      title: "Execute with Impact",
      description:
        "Develop, launch, and market with precision.",
      icon: "Zap",
      color: "from-green-500 to-green-600",
      illustration:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      title: "Optimize & Scale",
      description:
        "Analyze performance and evolve continuously.",
      icon: "TrendingUp",
      color: "from-orange-500 to-orange-600",
      illustration:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
  ];

  // What We Believe In
  const coreBeliefs = [
    {
      title: "Technology with Strategy",
      description:
        "We blend marketing, design, and development to deliver complete results.",
      icon: "Layers",
    },
    {
      title: "ROI-First Approach",
      description:
        "Whether it's a campaign or product, it must deliver value.",
      icon: "BarChart2",
    },
    {
      title: "Partnership Over Projects",
      description:
        "We grow only when you grow. Your KPIs become ours.",
      icon: "Users",
    },
    {
      title: "Transparency Always",
      description:
        "Clear reports, open communication, and shared success.",
      icon: "Eye",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 mb-6 shadow-lg">
            <Icon name="Lightbulb" size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              The Digital Journey
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Your Full-Funnel Digital Journey Starts Here
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We guide you from discovery to growth—combining strategy, technology, and marketing for end-to-end digital success.
          </p>
        </div>

        {/* Philosophy Journey */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Your Digital Journey
          </h3>

          {/* Step Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {philosophySteps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActivePhilosophy(index)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activePhilosophy === index
                    ? "bg-primary text-white shadow-lg transform scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-50 shadow-md"
                }`}
              >
                <Icon name={step.icon} size={16} />
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{index + 1}</span>
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Content Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${philosophySteps[activePhilosophy].color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon
                      name={philosophySteps[activePhilosophy].icon}
                      size={24}
                      color="white"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">
                      Step {activePhilosophy + 1} of {philosophySteps.length}
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900">
                      {philosophySteps[activePhilosophy].title}
                    </h4>
                  </div>
                </div>

                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {philosophySteps[activePhilosophy].description}
                </p>

                {/* Progress Indicators */}
                <div className="flex space-x-2">
                  {philosophySteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === activePhilosophy
                          ? "bg-primary w-8"
                          : "bg-slate-200 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Illustration Side */}
              <div className="relative h-64 lg:h-auto">
                <Image
                  src={philosophySteps[activePhilosophy].illustration}
                  alt={philosophySteps[activePhilosophy].title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${philosophySteps[activePhilosophy].color} opacity-20`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Beliefs */}
        <div>
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Our Beliefs Drive Our Work
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {coreBeliefs.map((belief, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name={belief.icon} size={20} color="white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">
                      {belief.title}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {belief.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
