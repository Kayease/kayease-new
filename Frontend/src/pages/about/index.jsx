import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from './components/HeroSection';
import PhilosophySection from './components/PhilosophySection';
import TeamSpotlight from './components/TeamSpotlight';
import CompanyCulture from './components/CompanyCulture';
import ValuesSection from './components/ValuesSection';

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // JSON-LD structured data for about page
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
        "description": "Kayease Global is a leading digital solutions company founded in 2020, specializing in web development, mobile apps, digital marketing, and custom software solutions. We transform businesses through innovative technology.",
        "foundingDate": "2020",
        "funder": {
          "@type": "Organization",
          "name": "Kayease Global Founders"
        },
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
        ],
        "knowsAbout": [
          "Web Development",
          "Mobile App Development",
          "Digital Marketing",
          "UI/UX Design",
          "Custom Software Development",
          "E-commerce Solutions",
          "SEO and SEM",
          "React Development",
          "Laravel Development",
          "API Development"
        ],
        "award": [
          "Digital Innovation Excellence",
          "Best Web Development Company",
          "Top Mobile App Developer"
        ],
        "numberOfEmployees": "10-50",
        "industry": "Technology",
        "slogan": "Smart Digital Solutions From Code to Conversions"
      },
      {
        "@type": "AboutPage",
        "@id": "https://kayease.com/about/#aboutpage",
        "url": "https://kayease.com/about",
        "name": "About Us | Kayease Global - Our Story, Team & Values",
        "description": "Learn about Kayease Global's journey from startup to leading digital solutions provider. Discover our story, meet our team, and understand our values and mission.",
        "isPartOf": {
          "@id": "https://kayease.com/#website"
        },
        "about": {
          "@id": "https://kayease.com/#organization"
        },
        "mainEntity": {
          "@id": "https://kayease.com/#organization"
        }
      },
      {
        "@type": "Person",
        "@id": "https://kayease.com/about/#founder",
        "name": "Kayease Global Team",
        "jobTitle": "Digital Solutions Team",
        "worksFor": {
          "@id": "https://kayease.com/#organization"
        },
        "description": "Our team of experienced developers, designers, and digital marketers passionate about creating innovative solutions.",
        "knowsAbout": [
          "Web Development",
          "Mobile App Development",
          "Digital Marketing",
          "UI/UX Design",
          "Software Development"
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>About Us | Kayease Global - Our Story, Team & Values</title>
        <meta name="description" content="Learn about Kayease Global's journey from startup to leading digital solutions provider. Discover our story, meet our team, and understand our values and mission to transform businesses through technology." />
        <meta name="keywords" content="about Kayease Global, digital solutions company, web development company, mobile app development company, digital marketing agency, software development company, Jaipur, Rajasthan, India, company story, team, values" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About Us | Kayease Global - Our Story, Team & Values" />
        <meta property="og:description" content="Learn about Kayease Global's journey from startup to leading digital solutions provider. Discover our story, meet our team, and understand our values and mission." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kayease.com/about" />
        <meta property="og:image" content="https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Kayease Global - Our Story, Team & Values" />
        <meta name="twitter:description" content="Learn about Kayease Global's journey from startup to leading digital solutions provider. Discover our story, meet our team, and understand our values and mission." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://kayease.com/about" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <HeroSection />
        <PhilosophySection />
        <TeamSpotlight />
        <CompanyCulture />
        <ValuesSection />
      </div>
    </>
  );
};

export default About;