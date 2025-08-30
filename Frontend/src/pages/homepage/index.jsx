import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from './components/HeroSection';
import ServicesPreview from './components/ServicesPreview';
import PortfolioCarousel from './components/PortfolioCarousel';
import WhyKayease from './components/WhyKayease';
import SocialProof from './components/SocialProof';
import CTASection from './components/CTASection';
import TrustedPartners from './components/TrustedPartners';

const Homepage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // JSON-LD structured data for homepage
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
          "url": "https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png",
          "width": 200,
          "height": 60
        },
        "description": "Kayease Global is a leading digital solutions company specializing in web development, mobile apps, digital marketing, and custom software solutions. We transform businesses through innovative technology.",
        "foundingDate": "2020",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Jaipur",
          "addressRegion": "Rajasthan",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+919887664666",
          "contactType": "customer service",
          "email": "sales@kayease.com"
        },
        "sameAs": [
          "https://www.linkedin.com/company/kayease-global",
          "https://www.facebook.com/kayeaseglobal",
          "https://twitter.com/kayeaseglobal"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://kayease.com/#website",
        "url": "https://kayease.com",
        "name": "Kayease Global",
        "description": "Smart Digital Solutions From Code to Conversions",
        "publisher": {
          "@id": "https://kayease.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://kayease.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
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
        "priceRange": "₹₹",
        "serviceArea": {
          "@type": "Country",
          "name": "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Digital Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Web Development",
                "description": "Custom website development and e-commerce solutions"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Mobile App Development",
                "description": "iOS and Android mobile application development"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Digital Marketing",
                "description": "SEO, SEM, social media marketing and content strategy"
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
        <title>Kayease Global | Smart Digital Solutions From Code to Conversions</title>
        <meta name="title" content="Kayease Global | Smart Digital Solutions From Code to Conversions" />
        <meta name="description" content="Transform your business with Kayease Global's comprehensive digital solutions. From custom web development and mobile apps to digital marketing and software solutions. Based in Jaipur, serving globally." />
        <meta name="keywords" content="web development, mobile app development, digital marketing, software solutions, e-commerce, SEO, Jaipur, Rajasthan, India, custom software, UI/UX design, digital transformation" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Kayease Global | Smart Digital Solutions From Code to Conversions" />
        <meta property="og:description" content="Transform your business with Kayease Global's comprehensive digital solutions. From custom web development and mobile apps to digital marketing and software solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kayease.com" />
        <meta property="og:image" content="https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png" />
        <meta property="og:site_name" content="Kayease Global" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kayease Global | Smart Digital Solutions From Code to Conversions" />
        <meta name="twitter:description" content="Transform your business with Kayease Global's comprehensive digital solutions. From custom web development and mobile apps to digital marketing and software solutions." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://kayease.com" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <HeroSection />
        <ServicesPreview />
        <PortfolioCarousel />
        <TrustedPartners />
        <WhyKayease />
        <SocialProof />
        <CTASection />
      </div>
    </>
  );
};

export default Homepage;
