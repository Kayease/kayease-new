import React from 'react';
import { Helmet } from 'react-helmet';
import ServiceHero from './components/ServiceHero';
import ServiceCategories from './components/ServiceCategories';
import ProcessVisualization from './components/ProcessVisualization';
import TechnologyShowcase from './components/TechnologyShowcase';

const Services = () => {
  // JSON-LD structured data for services page
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://kayease.com/#organization",
        "name": "Kayease Global",
        "url": "https://kayease.com"
      },
      {
        "@type": "WebPage",
        "@id": "https://kayease.com/services/#webpage",
        "url": "https://kayease.com/services",
        "name": "What We Do | Kayease Global Services - End-to-End Digital Solutions",
        "description": "Comprehensive digital services including web development, mobile app development, digital marketing, UI/UX design, and custom software solutions.",
        "isPartOf": {
          "@id": "https://kayease.com/#website"
        },
        "about": {
          "@id": "https://kayease.com/#organization"
        }
      },
      {
        "@type": "Service",
        "@id": "https://kayease.com/services/#web-development",
        "name": "Web Development",
        "description": "Custom website development, e-commerce solutions, and web applications using modern technologies like React, Next.js, Laravel, and Django.",
        "provider": {
          "@id": "https://kayease.com/#organization"
        },
        "serviceType": "Web Development",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Web Development Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Custom Website Development",
                "description": "Responsive websites built with modern frameworks"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "E-commerce Development",
                "description": "Online stores and shopping platforms"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Web Applications",
                "description": "Custom web applications and dashboards"
              }
            }
          ]
        }
      },
      {
        "@type": "Service",
        "@id": "https://kayease.com/services/#mobile-development",
        "name": "Mobile App Development",
        "description": "Native and cross-platform mobile applications for iOS and Android platforms using React Native, Flutter, and native technologies.",
        "provider": {
          "@id": "https://kayease.com/#organization"
        },
        "serviceType": "Mobile App Development",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Mobile Development Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "iOS App Development",
                "description": "Native iOS applications using Swift and SwiftUI"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Android App Development",
                "description": "Native Android applications using Kotlin and Java"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Cross-Platform Development",
                "description": "React Native and Flutter applications"
              }
            }
          ]
        }
      },
      {
        "@type": "Service",
        "@id": "https://kayease.com/services/#digital-marketing",
        "name": "Digital Marketing",
        "description": "Comprehensive digital marketing services including SEO, SEM, social media marketing, content marketing, and email marketing campaigns.",
        "provider": {
          "@id": "https://kayease.com/#organization"
        },
        "serviceType": "Digital Marketing",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Digital Marketing Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Search Engine Optimization (SEO)",
                "description": "On-page and off-page SEO optimization"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Search Engine Marketing (SEM)",
                "description": "Google Ads and PPC campaigns"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Social Media Marketing",
                "description": "Social media strategy and management"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Content Marketing",
                "description": "Content strategy and creation"
              }
            }
          ]
        }
      },
      {
        "@type": "Service",
        "@id": "https://kayease.com/services/#ui-ux-design",
        "name": "UI/UX Design",
        "description": "User interface and user experience design services including wireframing, prototyping, and design systems for web and mobile applications.",
        "provider": {
          "@id": "https://kayease.com/#organization"
        },
        "serviceType": "UI/UX Design",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "UI/UX Design Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "User Interface Design",
                "description": "Modern and intuitive interface design"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "User Experience Design",
                "description": "User research and experience optimization"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Prototyping",
                "description": "Interactive prototypes and wireframes"
              }
            }
          ]
        }
      },
      {
        "@type": "Service",
        "@id": "https://kayease.com/services/#custom-software",
        "name": "Custom Software Development",
        "description": "Bespoke software solutions including enterprise applications, APIs, database design, and system integration services.",
        "provider": {
          "@id": "https://kayease.com/#organization"
        },
        "serviceType": "Custom Software Development",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Custom Software Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Enterprise Software",
                "description": "Custom enterprise applications and systems"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "API Development",
                "description": "RESTful APIs and microservices"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "System Integration",
                "description": "Third-party integrations and data migration"
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>What We Do | Kayease Global Services - End-to-End Digital Solutions</title>
        <meta name="description" content="Discover Kayease Global's comprehensive digital services: web development, mobile apps, digital marketing, UI/UX design, and custom software solutions. Transform your business with our expertise." />
        <meta name="keywords" content="web development services, mobile app development, digital marketing services, UI/UX design, custom software development, e-commerce development, SEO services, social media marketing, React development, Laravel development, enterprise software, API development" />
        
        {/* Open Graph */}
        <meta property="og:title" content="What We Do | Kayease Global Services - End-to-End Digital Solutions" />
        <meta property="og:description" content="Discover Kayease Global's comprehensive digital services: web development, mobile apps, digital marketing, UI/UX design, and custom software solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kayease.com/services" />
        <meta property="og:image" content="https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="What We Do | Kayease Global Services - End-to-End Digital Solutions" />
        <meta name="twitter:description" content="Discover Kayease Global's comprehensive digital services: web development, mobile apps, digital marketing, UI/UX design, and custom software solutions." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://kayease.com/services" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <ServiceHero />
        <ServiceCategories />
        <ProcessVisualization />
        <TechnologyShowcase />
      </div>
    </>
  );
};

export default Services;
