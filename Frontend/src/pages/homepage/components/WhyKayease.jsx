import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const WhyKayease = () => {
  const valuePropositions = [
    {
      id: 1,
      icon: 'Code2',
      title: 'Technical Expertise',
      description: 'Our team of senior developers and architects bring years of experience with cutting-edge technologies and best practices.',
      features: [
        'Full-stack development mastery',
        'Cloud-native architecture',
        'Performance optimization',
        'Security-first approach'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      icon: 'Brain',
      title: 'Strategic Thinking',
      description: 'We don\'t just build software; we architect solutions that align with your business goals and drive measurable growth.',
      features: [
        'Business-driven development',
        'ROI-focused solutions',
        'Market analysis integration',
        'Competitive advantage building'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      icon: 'Zap',
      title: 'Scalable Solutions',
      description: 'Every solution we build is designed to grow with your business, from startup MVP to enterprise-scale applications.',
      features: [
        'Microservices architecture',
        'Auto-scaling infrastructure',
        'Modular design patterns',
        'Future-proof technology stack'
      ],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Strategy',
      description: 'We dive deep into your business goals, target audience, and technical requirements to create a comprehensive roadmap.',
      icon: 'Search'
    },
    {
      step: '02',
      title: 'Design & Architecture',
      description: 'Our team designs user-centric interfaces and robust system architecture that ensures optimal performance.',
      icon: 'Palette'
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'Using agile methodologies, we build and rigorously test your solution with continuous integration and deployment.',
      icon: 'Code'
    },
    {
      step: '04',
      title: 'Launch & Optimization',
      description: 'We ensure a smooth launch and provide ongoing optimization based on real-world performance and user feedback.',
      icon: 'Rocket'
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 sm:mb-6 leading-tight px-4">
            Why Choose <span className="brand-gradient-text">Kayease</span>?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
            We combine technical excellence with strategic insight to deliver solutions 
            that don't just work—they transform your business.
          </p>
        </motion.div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {valuePropositions.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                {/* Animated Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 mx-auto`}
                >
                  <Icon 
                    name={item.icon} 
                    size={36} 
                    color="white" 
                    strokeWidth={2}
                  />
                </motion.div>

                <h3 className="text-2xl font-bold text-text-primary mb-4 text-center">
                  {item.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed mb-6 text-center">
                  {item.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3">
                  {item.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: (index * 0.2) + (featureIndex * 0.1) }}
                      viewport={{ once: true }}
                      className="flex items-center text-text-secondary"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} mr-3 flex-shrink-0`} />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl lg:text-4xl font-bold text-text-primary mb-6">
            Our <span className="brand-gradient-text">Process</span>
          </h3>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            A proven methodology that ensures successful project delivery from concept to launch.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Connection Line */}
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0" />
              )}

              <div className="relative z-10 text-center">
                {/* Step Number */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                  <Icon 
                    name={step.icon} 
                    size={24} 
                    className="text-primary group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <h4 className="text-lg font-bold text-text-primary mb-3">
                  {step.title}
                </h4>
                
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Transform Your Digital Presence?
            </h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Let's discuss how Kayease can help you unlock your digital potential 
              and achieve measurable business growth.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = "mailto:sales@kayease.com"}
            >
              <span>Schedule Free Consultation</span>
              <Icon name="Calendar" size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyKayease;