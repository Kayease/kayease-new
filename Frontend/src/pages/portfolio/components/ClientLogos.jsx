import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "../../../components/AppImage";
import { clientApi } from "../../../utils/clientApi"; // Make sure this path is correct

const ClientLogos = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch clients with a reasonable limit for homepage display
        const clientsResponse = await clientApi.getClients({
          limit: 50,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        setClients(clientsResponse.clients || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching client data:", err);
        setError(err.message);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-slide functionality for mobile
  useEffect(() => {
    if (clients.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === clients.length - 1 ? 0 : prevIndex + 1
        );
      }, 2000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [clients.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === clients.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? clients.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            Trusted by Industry Leaders
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            We've had the privilege of working with amazing companies across
            various industries
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            {/* Desktop View - Grid Layout */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-8">
              {clients.map((client, index) => (
                <motion.div
                  key={client._id || client.id || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="relative p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="aspect-[2/1] flex items-center justify-center">
                      <Image
                        src={client.logo}
                        alt={`${client.name} logo`}
                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-gray-300">
                        {client.industry}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile View - Carousel */}
            <div className="md:hidden">
              <div className="relative">
                {/* Carousel Container */}
                <div className="relative overflow-hidden rounded-xl bg-gray-50">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="relative p-8"
                  >
                    <div className="aspect-[2/1] flex items-center justify-center mb-4">
                      <Image
                        src={clients[currentIndex]?.logo}
                        alt={`${clients[currentIndex]?.name} logo`}
                        className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    {/* Client Info */}
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 text-lg mb-1">
                        {clients[currentIndex]?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {clients[currentIndex]?.industry}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Navigation Buttons - Made more prominent */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300 z-20"
                  aria-label="Previous client"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300 z-20"
                  aria-label="Next client"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dots Indicator */}
                {clients.length > 1 && (
                  <div className="flex justify-center mt-6 space-x-3">
                    {clients.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-primary scale-125' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Slide Counter */}
                {clients.length > 1 && (
                  <div className="text-center mt-3 text-sm text-gray-500">
                    {currentIndex + 1} of {clients.length}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Ready to join our list of successful clients?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-button px-8 py-3 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() =>
              window.location.href = "/contact"
            }
          >
            Start Your Project
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientLogos;
