import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [displayText, setDisplayText] = useState("");
  const fullText = "Unlocking Digital Potential";

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let index = 0;
    const typewriterInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typewriterInterval);
      }
    }, 100);

    return () => clearInterval(typewriterInterval);
  }, []);

  const geometricElements = [
    { id: 1, size: 60, delay: 0, x: 20, y: 30 },
    { id: 2, size: 40, delay: 0.2, x: 80, y: 20 },
    { id: 3, size: 80, delay: 0.4, x: 70, y: 70 },
    { id: 4, size: 50, delay: 0.6, x: 10, y: 80 },
    { id: 5, size: 35, delay: 0.8, x: 90, y: 60 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 brand-gradient opacity-90"
        style={{
          background: `
    linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 50%),
    radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, #5e90f0 0%, #00B2FF 50%, #0057FF 100%)
  `,
        }}
      />

      {/* Floating Geometric Elements */}
      {geometricElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.2, rotate: 45 }}
        />
      ))}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full min-h-screen flex flex-col justify-center py-8 sm:py-12 pt-20 sm:pt-24 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 sm:space-y-12 lg:space-y-16"
        >
          {/* Main Headline with Typewriter Effect */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <h1
              className="
                text-3xl
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
                xl:text-7xl
                2xl:text-8xl
                font-black
                mb-4 sm:mb-6 lg:mb-8
                text-center
                leading-tight
                tracking-tight
                px-2 sm:px-4
              "
              style={{ color: '#111', wordBreak: 'break-word' }}
            >
              {displayText}
            </h1>
            <h2
              className="
                text-lg
                sm:text-xl
                md:text-2xl
                lg:text-3xl
                xl:text-4xl
                font-bold
                mb-4 sm:mb-6 lg:mb-8
                text-center
                leading-relaxed
                px-2 sm:px-4 lg:px-8
                max-w-4xl
                mx-auto
              "
              style={{ color: '#333', wordBreak: 'break-word' }}
            >
              Smart, Scalable Solutions From Code to Conversions
            </h2>
          </div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.8 }}
            className="
              text-base
              sm:text-lg
              md:text-xl
              lg:text-2xl
              text-gray-200
              max-w-2xl
              sm:max-w-3xl
              lg:max-w-4xl
              xl:max-w-5xl
              mx-auto
              leading-relaxed
              px-4
              sm:px-6
              lg:px-8
              font-medium
            "
            style={{ wordBreak: 'break-word' }}
          >
            We architect digital ecosystems that scale with your ambition.
            Transform complex challenges into streamlined solutions with
            Kayease.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 0.8 }}
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-4
              sm:gap-6
              lg:gap-8
              pt-8
              sm:pt-12
              lg:pt-16
              px-4
              sm:px-6
              w-full
              max-w-2xl
              mx-auto
            "
          >
            <Link to="/contact" className="w-full sm:w-auto">
              <Button
                variant="default"
                size="lg"
                className="
                  cta-button
                  text-white
                  font-bold
                  px-6
                  sm:px-8
                  lg:px-12
                  py-4
                  sm:py-5
                  lg:py-6
                  text-lg
                  sm:text-xl
                  lg:text-2xl
                  w-full
                  sm:min-w-[200px]
                  lg:min-w-[240px]
                  rounded-xl
                  shadow-lg
                  hover:shadow-xl
                  transition-all
                  duration-300
                "
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={20}
              >
                Start Your Project
              </Button>
            </Link>

            <Link to="/portfolio" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="
                  border-2
                  border-white/30
                  text-white
                  hover:bg-white/10
                  backdrop-blur-sm
                  font-bold
                  px-6
                  sm:px-8
                  lg:px-12
                  py-4
                  sm:py-5
                  lg:py-6
                  text-lg
                  sm:text-xl
                  lg:text-2xl
                  w-full
                  sm:min-w-[200px]
                  lg:min-w-[240px]
                  rounded-xl
                  shadow-lg
                  hover:shadow-xl
                  transition-all
                  duration-300
                "
                iconName="Play"
                iconPosition="left"
                iconSize={20}
              >
                View Our Work
              </Button>
            </Link>
          </motion.div>

          {/* Stats Counter - Clean 2x2 Grid on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, duration: 0.8 }}
            className="
              grid
              grid-cols-2
              lg:grid-cols-4
              gap-6
              sm:gap-8
              lg:gap-12
              pt-12
              sm:pt-16
              lg:pt-20
              max-w-4xl
              lg:max-w-6xl
              mx-auto
              px-4
              sm:px-6
              w-full
            "
          >
            {[
              { number: "150+", label: "Projects Delivered" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "5+", label: "Years Experience" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 4.2 + index * 0.1, duration: 0.6 }}
                className="
                  text-center
                  p-4
                  sm:p-6
                  lg:p-8
                  bg-white/5
                  backdrop-blur-sm
                  rounded-2xl
                  border
                  border-white/10
                  hover:bg-white/10
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:shadow-lg
                "
              >
                <div className="
                  text-2xl
                  sm:text-3xl
                  lg:text-4xl
                  xl:text-5xl
                  font-black
                  text-white
                  mb-2
                  sm:mb-3
                  lg:mb-4
                  leading-none
                ">
                  {stat.number}
                </div>
                <div className="
                  text-white/90
                  text-sm
                  sm:text-base
                  lg:text-lg
                  xl:text-xl
                  font-medium
                  leading-tight
                  px-2
                ">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
