import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const ServicesPreview = () => {
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    {
      id: 1,
      title: "Web Development",
      description:
        "Custom websites and web applications built with cutting-edge technologies",
      icon: "Code",
      technologies: ["Next.js", "React", "Node.js", "TypeScript"],
      color: "from-blue-500 to-cyan-500",
      projects: "45+ Projects",
    },
    {
      id: 2,
      title: "Mobile Apps",
      description:
        "Native and cross-platform mobile applications for iOS and Android",
      icon: "Smartphone",
      technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
      color: "from-purple-500 to-pink-500",
      projects: "30+ Apps",
    },
    {
      id: 3,
      title: "Digital Strategy",
      description: "Comprehensive digital transformation and growth strategies",
      icon: "TrendingUp",
      technologies: ["Analytics", "SEO", "CRO", "Marketing"],
      color: "from-green-500 to-emerald-500",
      projects: "60+ Strategies",
    },
    {
      id: 4,
      title: "E-commerce",
      description: "Scalable online stores and marketplace solutions",
      icon: "ShoppingCart",
      technologies: ["Shopify", "WooCommerce", "Magento", "Custom"],
      color: "from-orange-500 to-red-500",
      projects: "25+ Stores",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Our <span className="brand-gradient-text">Services</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            From concept to conversion, we deliver comprehensive digital
            solutions that drive growth and transform businesses.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full flex flex-col">
                {/* Background Gradient on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon
                    name={service.icon}
                    size={28}
                    color="white"
                    strokeWidth={2}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-text-secondary mb-6 leading-relaxed flex-grow">
                  {service.description}
                </p>

                {/* Technologies */}
                <div className="space-y-4 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Explore All Services</span>
              <Icon name="ArrowRight" size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPreview;
