import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CompanyCulture = () => {
  const [activeTab, setActiveTab] = useState('workspace');

  const cultureHighlights = [
    {
      id: 'workspace',
      title: 'Our Workspace',
      description: 'A collaborative environment designed for creativity and innovation',
      images: [
        {
          src: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          alt: "Modern office space with collaborative areas"
        },
        {
          src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          alt: "Team meeting in modern conference room"
        },
        {
          src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          alt: "Relaxation area with comfortable seating"
        }
      ]
    },
    {
      id: 'events',
      title: 'Team Events',
      description: 'Regular team building activities and celebrations that bring us together',
      images: [
        {
          src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
          alt: "Team celebration and awards ceremony"
        },
        {
          src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
          alt: "Team building outdoor activities"
        },
        {
          src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          alt: "Holiday party and team bonding"
        }
      ]
    },
    {
      id: 'learning',
      title: 'Learning & Growth',
      description: 'Continuous learning opportunities and professional development programs',
      images: [
        {
          src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          alt: "Team learning session and workshops"
        },
        {
          src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          alt: "Professional development training"
        },
        {
          src: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          alt: "Conference attendance and knowledge sharing"
        }
      ]
    }
  ];

  const employeeTestimonials = [
    {
      name: "Jennifer Martinez",
      role: "Senior Developer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      testimonial: "Kayease isn\'t just a workplace—it\'s a community where innovation thrives. The collaborative environment and growth opportunities have accelerated my career beyond what I thought possible.",
      rating: 5,
      tenure: "2 years"
    },
    {
      name: "Robert Chen",
      role: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      testimonial: "The creative freedom and support I receive here is incredible. Every project is an opportunity to push boundaries and create something meaningful. The team genuinely cares about each other's success.",
      rating: 5,
      tenure: "1.5 years"
    },
    {
      name: "Amanda Foster",
      role: "Project Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      testimonial: "The work-life balance and professional development opportunities at Kayease are outstanding. Leadership truly invests in our growth, and the collaborative culture makes every day enjoyable.",
      rating: 5,
      tenure: "3 years"
    }
  ];

  const cultureValues = [
    {
      title: "Work-Life Harmony",
      description: "We believe in sustainable success that doesn't compromise personal well-being",
      icon: "Scale",
      features: ["Flexible working hours", "Remote work options", "Mental health support", "Unlimited PTO policy"]
    },
    {
      title: "Continuous Learning",
      description: "Investment in growth through education, conferences, and skill development",
      icon: "BookOpen",
      features: ["Learning budget for each employee", "Conference attendance", "Internal knowledge sharing", "Certification support"]
    },
    {
      title: "Innovation Freedom",
      description: "Encouraging creative thinking and experimentation in all aspects of work",
      icon: "Lightbulb",
      features: ["20% time for personal projects", "Innovation challenges", "Cross-team collaboration", "Idea implementation support"]
    },
    {
      title: "Inclusive Environment",
      description: "Celebrating diversity and creating an environment where everyone thrives",
      icon: "Users",
      features: ["Diverse hiring practices", "Inclusive team activities", "Equal growth opportunities", "Open communication culture"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 mb-6 shadow-lg">
            <Icon name="Heart" size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">Culture</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Where <span className="brand-gradient-text">Passion</span> Meets Purpose
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our culture is built on collaboration, innovation, and genuine care for each other's success. Discover what makes Kayease a place where talented people love to work and grow.
          </p>
        </div>

        {/* Culture Gallery */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex flex-wrap border-b border-slate-200">
              {[
                { id: 'workspace', title: 'Our Workspace' },
                { id: 'events', title: 'Team Events' },
                { id: 'learning', title: 'Learning & Growth' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 px-6 py-4 text-center font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-blue-50' :'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {cultureHighlights.map((tab) => (
                <div
                  key={tab.id}
                  className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {tab.title}
                    </h3>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                      {tab.description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {tab.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm font-medium">{image.alt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Why Businesses Choose Kayease
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Integrated Services',
                description: 'Marketing, design, and development—under one roof.',
                icon: 'Layers',
              },
              {
                title: 'Performance-Driven',
                description: 'Every decision aligns with your goals.',
                icon: 'BarChart2',
              },
              {
                title: 'Creative Meets Technical',
                description: 'Beautiful interfaces backed by robust systems and smart campaigns.',
                icon: 'Monitor',
              },
              {
                title: 'Flexible Collaboration',
                description: 'Modular services or full-stack delivery—we adapt to you.',
                icon: 'Repeat',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name={value.icon} size={20} color="white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-slate-900 mb-3">
                      {value.title}
                    </h4>
                    <p className="text-slate-600 mb-4">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyCulture;