import React, { useState } from "react";
import { motion } from "framer-motion";
import Icon from "../../../components/AppIcon";

const ProcessVisualization = () => {
  const [activeStep, setActiveStep] = useState(0);

  const processSteps = [
    {
      id: "discovery",
      title: "Discovery & Strategy",
      icon: "Search",
      description:
        "We dive deep into your business goals, target audience, and technical requirements to create a comprehensive project roadmap.",
      activities: [
        "Stakeholder interviews",
        "Market research & analysis",
        "Technical requirements gathering",
        "Competitive analysis",
        "User persona development",
        "Project scope definition",
      ],
      deliverables: [
        "Project Brief",
        "Technical Specification",
        "Timeline & Milestones",
      ],
    },
    {
      id: "design",
      title: "Design & Prototyping",
      icon: "Palette",
      description:
        "Our design team creates intuitive user experiences and stunning visual designs that align with your brand identity.",
      activities: [
        "Wireframe creation",
        "User experience design",
        "Visual design system",
        "Interactive prototypes",
        "Design system documentation",
        "Client feedback integration",
      ],
      deliverables: [
        "Wireframes",
        "High-fidelity Designs",
        "Interactive Prototype",
        "Design System",
      ],
    },
    {
      id: "development",
      title: "Development & Testing",
      icon: "Code",
      description:
        "Our developers bring designs to life using modern technologies, following best practices for performance and scalability.",
      activities: [
        "Frontend development",
        "Backend architecture",
        "Database design",
        "API development",
        "Quality assurance testing",
        "Performance optimization",
      ],
      deliverables: [
        "Functional Application",
        "Test Reports",
        "Documentation",
        "Source Code",
      ],
    },
    {
      id: "launch",
      title: "Launch & Deployment",
      icon: "Rocket",
      description:
        "We handle the complete deployment process, ensuring your application goes live smoothly with proper monitoring in place.",
      activities: [
        "Production environment setup",
        "Domain & SSL configuration",
        "Performance monitoring",
        "Security implementation",
        "Analytics integration",
        "Go-live support",
      ],
      deliverables: [
        "Live Application",
        "Monitoring Dashboard",
        "Launch Report",
        "Training Materials",
      ],
    },
    {
      id: "optimization",
      title: "Optimization & Support",
      icon: "TrendingUp",
      description:
        "Post-launch, we continuously monitor, optimize, and support your application to ensure peak performance and user satisfaction.",
      activities: [
        "Performance monitoring",
        "User behavior analysis",
        "A/B testing",
        "Feature enhancements",
        "Security updates",
        "Technical support",
      ],
      deliverables: [
        "Monthly Reports",
        "Performance Insights",
        "Update Releases",
        "24/7 Support",
      ],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            Our Proven <span className="brand-gradient-text">Process</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            From initial concept to ongoing optimization, our structured
            approach ensures successful project delivery every time.
          </motion.p>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-300 rounded-full"></div>

          {/* Process Steps */}
          <div className="space-y-12 md:space-y-24">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Step Content */}
                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <div
                    className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                      activeStep === index
                        ? "border-blue-500"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Icon name={step.icon} size={28} color="white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Activities */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                          <Icon
                            name="CheckCircle"
                            size={18}
                            className="text-green-500 mr-2"
                          />
                          Key Activities
                        </h4>
                        <ul className="space-y-2">
                          {step.activities.map((activity, actIndex) => (
                            <li
                              key={actIndex}
                              className="flex items-start text-sm text-slate-600"
                            >
                              <Icon
                                name="ArrowRight"
                                size={14}
                                className="text-slate-400 mr-2 mt-0.5 flex-shrink-0"
                              />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Deliverables */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                          <Icon
                            name="Package"
                            size={18}
                            className="text-blue-500 mr-2"
                          />
                          Deliverables
                        </h4>
                        <ul className="space-y-2">
                          {step.deliverables.map((deliverable, delIndex) => (
                            <li
                              key={delIndex}
                              className="flex items-center text-sm text-slate-600"
                            >
                              <Icon
                                name="FileText"
                                size={14}
                                className="text-blue-400 mr-2 flex-shrink-0"
                              />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step Number Circle */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white border-4 border-blue-500 rounded-full items-center justify-center z-10">
                  <span className="text-2xl font-bold text-blue-600">
                    {index + 1}
                  </span>
                </div>

                {/* Mobile Step Number */}
                <div className="md:hidden w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-white">
                    {index + 1}
                  </span>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Process Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-white rounded-2xl p-8 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Why Our Process Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "Target",
                title: "Clear Milestones",
                description:
                  "Every phase has defined goals and deliverables for complete transparency",
              },
              {
                icon: "Users",
                title: "Collaborative Approach",
                description:
                  "Regular check-ins and feedback loops keep you involved throughout",
              },
              {
                icon: "Shield",
                title: "Quality Assurance",
                description:
                  "Rigorous testing and review processes ensure exceptional results",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={benefit.icon} size={24} color="white" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessVisualization;
