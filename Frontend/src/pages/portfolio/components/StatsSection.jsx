import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const StatsSection = () => {
  const stats = [
    {
      icon: 'Briefcase',
      value: '150+',
      label: 'Projects Delivered',
      description: 'Successfully completed projects across various industries'
    },
    {
      icon: 'TrendingUp',
      value: '85%',
      label: 'Average Performance Boost',
      description: 'Average improvement in site speed and user engagement'
    },
    {
      icon: 'Users',
      value: '98%',
      label: 'Client Retention Rate',
      description: 'Clients who continue working with us for ongoing projects'
    },
    {
      icon: 'Award',
      value: '25+',
      label: 'Industry Awards',
      description: 'Recognition for excellence in digital design and development'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Our Track Record
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Numbers that speak to our commitment to delivering exceptional digital solutions
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
                  <Icon 
                    name={stat.icon} 
                    size={32} 
                    className="text-primary group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-pulse"></div>
              </div>
              
              <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                {stat.value}
              </div>
              
              <div className="text-lg font-semibold text-gray-700 mb-2">
                {stat.label}
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;