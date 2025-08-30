import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const ValuesSection = () => {
  const [expandedValue, setExpandedValue] = useState(null);

  const coreValues = [
    {
      id: "innovation",
      title: "Innovation",
      subtitle: "Pushing Boundaries",
      description:
        "We embrace cutting-edge technologies and creative solutions to solve complex challenges.",
      expandedContent: `Innovation isn't just about using the latest technology—it's about finding creative solutions that truly make a difference. We encourage our team to think outside the box, experiment with new approaches, and challenge conventional wisdom. Every project is an opportunity to push boundaries and create something extraordinary.`,
      icon: "Lightbulb",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      caseStudy: {
        title: "AI-Powered E-commerce Platform",
        description:
          "We developed a revolutionary AI-driven recommendation engine that increased client sales by 40%.",
        image:
          "https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        results: [
          "40% increase in sales",
          "60% better user engagement",
          "25% reduction in cart abandonment",
        ],
      },
      principles: [
        "Embrace emerging technologies",
        "Challenge conventional approaches",
        "Foster creative problem-solving",
        "Encourage experimentation",
      ],
    },
    {
      id: "reliability",
      title: "Reliability",
      subtitle: "Consistent Excellence",
      description:
        "We deliver dependable solutions that our clients can trust to perform flawlessly.",
      expandedContent: `Reliability is the foundation of trust. Our clients depend on us to deliver solutions that work consistently, perform under pressure, and scale with their business. We achieve this through rigorous testing, robust architecture, and a commitment to quality that never wavers.`,
      icon: "Shield",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      caseStudy: {
        title: "Healthcare Management System",
        description:
          "Built a mission-critical healthcare platform with 99.9% uptime serving 50,000+ patients.",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        results: [
          "99.9% uptime achieved",
          "50,000+ patients served",
          "Zero security incidents",
        ],
      },
      principles: [
        "Rigorous testing protocols",
        "Robust system architecture",
        "Proactive monitoring",
        "Continuous improvement",
      ],
    },
    {
      id: "growth",
      title: "Growth",
      subtitle: "Scaling Together",
      description:
        "We build solutions that grow with our clients and invest in our team's continuous development.",
      expandedContent: `Growth is a journey we take together with our clients and team members. We design scalable solutions that adapt to changing needs and invest in continuous learning to stay ahead of industry trends. Success is measured not just by project completion, but by long-term value creation.`,
      icon: "TrendingUp",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      caseStudy: {
        title: "Startup to Enterprise Transformation",
        description:
          "Helped a startup scale from 1,000 to 100,000 users with our scalable architecture.",
        image:
          "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        results: [
          "100x user growth supported",
          "99% performance maintained",
          "50% cost reduction achieved",
        ],
      },
      principles: [
        "Scalable architecture design",
        "Continuous learning culture",
        "Long-term value focus",
        "Adaptive solutions",
      ],
    },
    {
      id: "partnership",
      title: "Partnership",
      subtitle: "Collaborative Success",
      description:
        "We believe in building lasting relationships based on trust, transparency, and mutual success.",
      expandedContent: `True partnership goes beyond client-vendor relationships. We become an extension of our clients' teams, sharing their vision and working collaboratively toward common goals. Our success is measured by our clients' success, creating a foundation for long-term relationships.`,
      icon: "Handshake",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      caseStudy: {
        title: "5-Year Strategic Partnership",
        description:
          "Long-term collaboration with a Fortune 500 company resulting in digital transformation.",
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2084&q=80",
        results: [
          "5-year partnership maintained",
          "15 successful projects delivered",
          "300% ROI achieved",
        ],
      },
      principles: [
        "Transparent communication",
        "Shared vision alignment",
        "Mutual success focus",
        "Long-term commitment",
      ],
    },
  ];

  const toggleExpanded = (valueId) => {
    setExpandedValue(expandedValue === valueId ? null : valueId);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-6 py-3 mb-6">
            <Icon name="Compass" size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">Core Principles</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Principles That Guide Our Work
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our core principles aren't just words on a wall—they're the foundation of every decision we make, every solution we build, and every relationship we nurture.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {coreValues.map((value) => (
            <div
              key={value.id}
              className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                expandedValue === value.id ? "lg:col-span-2" : ""
              }`}
            >
              {/* Value Card Header */}
              <div className={`${value.bgColor} p-8`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon name={value.icon} size={24} color="white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">
                        {value.title}
                      </h3>
                      <p className={`font-medium ${value.textColor}`}>
                        {value.subtitle}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpanded(value.id)}
                    className={`w-10 h-10 ${value.textColor} hover:bg-white/50 rounded-full flex items-center justify-center transition-all duration-300`}
                  >
                    <Icon
                      name={
                        expandedValue === value.id ? "ChevronUp" : "ChevronDown"
                      }
                      size={20}
                    />
                  </button>
                </div>

                <p className="text-slate-700 mt-4 leading-relaxed">
                  {value.description}
                </p>
              </div>

              {/* Expanded Content */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  expandedValue === value.id
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-8 border-t border-slate-200">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Detailed Description & Principles */}
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-4">
                        Our Approach
                      </h4>
                      <p className="text-slate-600 leading-relaxed mb-6">
                        {value.expandedContent}
                      </p>

                      <h5 className="font-semibold text-slate-800 mb-3">
                        Key Principles:
                      </h5>
                      <ul className="space-y-2">
                        {value.principles.map((principle, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <Icon
                              name="Check"
                              size={16}
                              className={value.textColor}
                            />
                            <span className="text-slate-600">{principle}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Case Study */}
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-4">
                        Value in Action
                      </h4>
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <div className="relative mb-4">
                          <Image
                            src={value.caseStudy.image}
                            alt={value.caseStudy.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                        </div>

                        <h5 className="font-bold text-slate-900 mb-2">
                          {value.caseStudy.title}
                        </h5>
                        <p className="text-slate-600 text-sm mb-4">
                          {value.caseStudy.description}
                        </p>

                        <div className="space-y-2">
                          {value.caseStudy.results.map((result, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <Icon
                                name="TrendingUp"
                                size={14}
                                className="text-green-500"
                              />
                              <span className="text-sm text-slate-600">
                                {result}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Values Impact Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-3xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Values in Numbers
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "98%", label: "Client Retention Rate", icon: "Heart" },
              { number: "150+", label: "Projects Delivered", icon: "CheckCircle" },
              { number: "24/7", label: "Support", icon: "Clock" },
              { number: "5+", label: "Years of Excellence", icon: "Award" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon name={stat.icon} size={24} className="text-primary" />
                </div>
                <div className="text-3xl font-bold brand-gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Experience Our Values in Action
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Ready to work with a team that lives by these principles? Let's
              discuss how our values-driven approach can transform your digital
              presence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                className="cta-button px-8 py-3 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300"
                onClick={() => (window.location.href = "/contact")}
              >
                Start Your Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
