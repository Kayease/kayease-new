import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const CTASection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  const consultationFeatures = [
    {
      icon: "Users",
      title: "Expert Consultation",
      description: "Meet with our senior developers and strategists",
    },
    {
      icon: "FileText",
      title: "Custom Proposal",
      description: "Receive a detailed project roadmap and timeline",
    },
    {
      icon: "DollarSign",
      title: "Transparent Pricing",
      description: "Get clear, upfront pricing with no hidden costs",
    },
    {
      icon: "Clock",
      title: "Quick Turnaround",
      description: "Start your project within 1-2 weeks",
    },
  ];

  const quickActions = [
    {
      title: "View Portfolio",
      description: "See our latest projects and case studies",
      icon: "Briefcase",
      link: "/portfolio",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Our Services",
      description: "Explore our comprehensive service offerings",
      icon: "Settings",
      link: "/services",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "About Us",
      description: "Learn about our team and company culture",
      icon: "Users",
      link: "/about",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
            Ready to <span className="brand-gradient-text">Start</span> Your
            Project?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-xl sm:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4">
            Transform your digital vision into reality with Kayease. Get a free
            consultation and discover how we can accelerate your growth.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
            <Link to="/contact">
              <Button
                variant="default"
                size="xl"
                className="cta-button text-white font-bold px-10 py-5 text-lg min-w-[250px]"
                iconName="Calendar"
                iconPosition="left"
                iconSize={24}
                onClick={() => navigate("/contact")}
              >
                Book Our Services
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Consultation Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {consultationFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                <Icon
                  name={feature.icon}
                  size={28}
                  color="white"
                  strokeWidth={2}
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 group cursor-pointer"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon
                    name={action.icon}
                    size={28}
                    color="white"
                    strokeWidth={2}
                  />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {action.title}
                </h4>
                <p className="text-blue-200 text-sm leading-relaxed mb-4">
                  {action.description}
                </p>
                <div className="flex items-center justify-center text-white group-hover:text-secondary transition-colors duration-300">
                  <span className="text-sm font-medium mr-2">Learn More</span>
                  <Icon name="ArrowRight" size={16} />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20 pt-12 border-t border-white/20"
        >
          <h4 className="text-xl font-bold text-white mb-6">
            Prefer to Talk Directly?
          </h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center text-blue-200">
              <Icon name="Phone" size={20} className="mr-3" />
              <span>
                <a href="tel:+919887664666">+91 98876 64666</a>
              </span>
            </div>
            <div className="flex items-center text-blue-200">
              <Icon name="Mail" size={20} className="mr-3" />
              <span>
                <a href="mailto:sales@kayease.com">sales@kayease.com</a>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
