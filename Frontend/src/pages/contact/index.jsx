import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';
import LocationMap from './components/LocationMap';
import LiveChat from './components/LiveChat';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const trustSignals = [
    {
      icon: 'Clock',
      title: '24-Hour Response',
      description: 'Guaranteed response within 24 hours'
    },
    {
      icon: 'Shield',
      title: 'Secure & Confidential',
      description: 'Your information is protected with SSL encryption'
    },
    {
      icon: 'Users',
      title: '500+ Happy Clients',
      description: 'Trusted by businesses worldwide'
    },
    {
      icon: 'Award',
      title: 'Industry Certified',
      description: 'Certified professionals with proven expertise'
    }
  ];

  // JSON-LD structured data for contact page
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://kayease.com/#organization",
        "name": "Kayease Global",
        "url": "https://kayease.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png"
        }
      },
      {
        "@type": "ContactPage",
        "@id": "https://kayease.com/contact/#contactpage",
        "url": "https://kayease.com/contact",
        "name": "Contact Us | Kayease Global - Let's Start Something Amazing",
        "description": "Get in touch with Kayease Global for your digital transformation needs. Contact us for web development, mobile apps, digital marketing, and custom software solutions.",
        "isPartOf": {
          "@id": "https://kayease.com/#website"
        },
        "about": {
          "@id": "https://kayease.com/#organization"
        },
        "mainEntity": {
          "@id": "https://kayease.com/#localbusiness"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://kayease.com/#localbusiness",
        "name": "Kayease Global",
        "image": "https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png",
        "description": "Leading digital solutions company in Jaipur, Rajasthan. We specialize in web development, mobile apps, digital marketing, and custom software solutions.",
        "url": "https://kayease.com",
        "telephone": "+919887664666",
        "email": "sales@kayease.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jaipur",
          "addressLocality": "Jaipur",
          "addressRegion": "Rajasthan",
          "postalCode": "302001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "26.9124",
          "longitude": "75.7873"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+919887664666",
            "contactType": "customer service",
            "email": "sales@kayease.com",
            "availableLanguage": "English"
          },
          {
            "@type": "ContactPoint",
            "telephone": "+919887664666",
            "contactType": "HR",
            "email": "hr@kayease.com",
            "availableLanguage": "English"
          }
        ],
        "sameAs": [
          "https://www.linkedin.com/company/kayease-global",
          "https://www.facebook.com/kayeaseglobal",
          "https://twitter.com/kayeaseglobal"
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Kayease Global - Let's Start Something Amazing</title>
        <meta
          name="description"
          content="Get in touch with Kayease Global for your digital transformation needs. Contact us for web development, mobile apps, digital marketing, and custom software solutions. Let's start something amazing together."
        />
        <meta
          name="keywords"
          content="contact Kayease Global, digital solutions contact, web development contact, mobile app development contact, digital marketing contact, software development contact, Jaipur, Rajasthan, India"
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contact Us | Kayease Global - Let's Start Something Amazing" />
        <meta
          property="og:description"
          content="Get in touch with Kayease Global for your digital transformation needs. Contact us for web development, mobile apps, digital marketing, and custom software solutions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kayease.com/contact" />
        <meta property="og:image" content="https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Kayease Global - Let's Start Something Amazing" />
        <meta name="twitter:description" content="Get in touch with Kayease Global for your digital transformation needs. Contact us for web development, mobile apps, digital marketing, and custom software solutions." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://kayease.com/contact" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <motion.section 
        className="pt-24 pb-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Icon name="MessageCircle" size={16} />
                <span>Let's Start Something Amazing</span>
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 sm:mb-6 leading-tight px-4"
            >
              Get In Touch With{' '}
              <span className="brand-gradient-text">Kayease</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-text-secondary mb-6 sm:mb-8 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4"
            >
              Ready to transform your digital presence? Let's discuss your project and explore how we can help you achieve your goals with cutting-edge solutions.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto px-4"
            >
              {trustSignals.map((signal, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Icon name={signal.icon} size={20} className="text-primary sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-semibold text-text-primary text-xs sm:text-sm mb-1 leading-tight">
                    {signal.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-text-secondary leading-tight">
                    {signal.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.section 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <ContactForm />
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <ContactInfo />
            </motion.div>
          </div>
        </div>
      </motion.section>

     

      {/* Location & FAQ */}
      <motion.section 
        className="py-16 w-full min-h-[400px] flex justify-center items-center bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="w-full max-w-5xl">
          <LocationMap />
        </motion.div>
      </motion.section>

    </div>
    </>
  );
};

export default Contact;