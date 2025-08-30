import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceCategories = () => {
  const [activeCategory, setActiveCategory] = useState('web-development');

  const categories = [
    {
      id: 'web-development',
      name: 'Web Development',
      icon: 'Globe',
      color: 'blue',
      description: 'Modern, scalable web applications built with cutting-edge technologies',
      services: [
        'Next.js Applications',
        'React Development',
        'Full-Stack Solutions',
        'Progressive Web Apps',
        'API Development',
        'Database Design'
      ],
      technologies: ['Next.js', 'React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      timeline: '4-12 weeks',
      startingPrice: '₹5,000'
    },
    {
      id: 'mobile-apps',
      name: 'Mobile Apps',
      icon: 'Smartphone',
      color: 'green',
      description: 'Native and cross-platform mobile applications for iOS and Android',
      services: [
        'React Native Apps',
        'iOS Development',
        'Android Development',
        'App Store Optimization',
        'Push Notifications',
        'Offline Functionality'
      ],
      technologies: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'Redux', 'Expo'],
      timeline: '6-16 weeks',
      startingPrice: '₹8,000'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      icon: 'ShoppingCart',
      color: 'purple',
      description: 'High-converting online stores with advanced features and integrations',
      services: [
        'Shopify Plus Development',
        'Custom E-commerce',
        'Payment Integration',
        'Inventory Management',
        'Multi-vendor Platforms',
        'Analytics & Reporting'
      ],
      technologies: ['Shopify Plus', 'WooCommerce', 'Stripe', 'PayPal', 'Klaviyo', 'Google Analytics'],
      timeline: '6-20 weeks',
      startingPrice: '₹10,000'
    },
    {
      id: 'digital-strategy',
      name: 'Digital Strategy',
      icon: 'TrendingUp',
      color: 'orange',
      description: 'Comprehensive digital transformation and growth strategies',
      services: [
        'Digital Audits',
        'UX/UI Strategy',
        'SEO Optimization',
        'Conversion Rate Optimization',
        'Analytics Setup',
        'Performance Monitoring'
      ],
      technologies: ['Google Analytics', 'Hotjar', 'Figma', 'Miro', 'Ahrefs', 'GTM'],
      timeline: '2-8 weeks',
      startingPrice: '₹3,000'
    },
    {
      id: 'maintenance',
      name: 'Maintenance & Support',
      icon: 'Settings',
      color: 'teal',
      description: 'Ongoing support, updates, and optimization for your digital assets',
      services: [
        'Regular Updates',
        'Security Monitoring',
        'Performance Optimization',
        'Bug Fixes',
        'Feature Enhancements',
        '24/7 Support'
      ],
      technologies: ['Monitoring Tools', 'Security Scanners', 'Backup Systems', 'CDN', 'SSL', 'Uptime Monitoring'],
      timeline: 'Ongoing',
      startingPrice: '₹500/month'
    }
  ];

  const activeService = categories.find(cat => cat.id === activeCategory);

  const getColorClasses = (color, type = 'bg') => {
    const colorMap = {
      blue: type === 'bg' ? 'bg-blue-500' : type === 'text' ? 'text-blue-600' : 'border-blue-500',
      green: type === 'bg' ? 'bg-green-500' : type === 'text' ? 'text-green-600' : 'border-green-500',
      purple: type === 'bg' ? 'bg-purple-500' : type === 'text' ? 'text-purple-600' : 'border-purple-500',
      orange: type === 'bg' ? 'bg-orange-500' : type === 'text' ? 'text-orange-600' : 'border-orange-500',
      teal: type === 'bg' ? 'bg-teal-500' : type === 'text' ? 'text-teal-600' : 'border-teal-500'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight px-4"
          >
            Our <span className="brand-gradient-text">Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto px-4"
          >
            Comprehensive digital solutions tailored to your business needs, 
            from concept to launch and beyond.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Category Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-3 flex flex-col h-full">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 flex-1 min-h-[120px] flex items-center ${
                    activeCategory === category.id
                      ? `${getColorClasses(category.color, 'border')} bg-slate-50 shadow-lg`
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${getColorClasses(category.color)} rounded-lg flex items-center justify-center`}>
                      <Icon name={category.icon} size={24} color="white" />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg ${
                        activeCategory === category.id ? getColorClasses(category.color, 'text') : 'text-slate-900'
                      }`}>
                        {category.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Service Details */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-50 rounded-2xl p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 ${getColorClasses(activeService.color)} rounded-xl flex items-center justify-center`}>
                    <Icon name={activeService.icon} size={32} color="white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{activeService.name}</h3>
                    <p className="text-slate-600">{activeService.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Services List */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                      <Icon name="CheckCircle" size={20} className="text-green-500 mr-2" />
                      What's Included
                    </h4>
                    <ul className="space-y-3">
                      {activeService.services.map((service, index) => (
                        <li key={index} className="flex items-center text-slate-700">
                          <Icon name="ArrowRight" size={16} className="text-slate-400 mr-3" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                      <Icon name="Code" size={20} className="text-blue-500 mr-2" />
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeService.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-700 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Info removed as per request */}

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button
                    variant="default"
                    className="cta-button text-white font-semibold px-6"
                    iconName="UserPlus"
                    iconPosition="left"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Hire Us
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50 flex items-center justify-center"
                    iconName="MessageCircle"
                    iconPosition="left"
                    style={{ backgroundColor: '#25D366', color: '#fff', borderColor: '#25D366' }}
                    onClick={() => window.open('https://wa.me/919887664666?text=Hi%20Kayease%20Team%2C%20I%20am%20interested%20in%20your%20services!', '_blank')}
                  >
                    <span className="font-semibold">WhatsApp</span>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;