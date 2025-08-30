import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import { teamApi } from "../../../utils/teamApi";

const TeamSpotlight = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await teamApi.getActiveMembers();
      setTeamMembers(response.teamMembers || []);
    } catch (error) {
      console.error("Error loading team members:", error);
      setError("Failed to load team members");
      // Fallback to static data if API fails
      setTeamMembers([
        {
          _id: 1,
          name: "Sunny Dhalia",
          role: "Chief Technical Officer",
          expertise: ["Team Leadership", "Innovation Strategy"],
          experience: "15+ years",
          avatar: "/team/sunny.png",
        },
        {
          _id: 2,
          name: "Amit Trivedi",
          role: "Chief Operations Officer",
          expertise: ["Workflow Automation", "Strategic Operations"],
          experience: "12+ years",
          avatar: "/team/amit.png",
        },
        {
          _id: 3,
          name: "Chanda Kumawat",
          role: "Business Analyst",
          expertise: ["Data Analysis", "Market Research"],
          experience: "1+ years",
          avatar: "/team/chanda.png",
        },
        {
          _id: 4,
          name: "Rustam Khan",
          role: "Full-Stack Developer",
          expertise: ["React Development", "Full-Stack Development"],
          experience: "4+ years",
          avatar: "/team/rustam.png",
        },
        {
          _id: 5,
          name: "Pradeependra Pratap",
          role: "Backend Developer",
          expertise: ["Code Optimization", "Backend Development"],
          experience: "4+ years",
          avatar: "/team/pp.png",
        },
        {
          _id: 6,
          name: "Manish Kumar",
          role: "Backend Developer",
          expertise: ["Django Framework", "PHP Development"],
          experience: "5+ years",
          avatar: "/team/manish.png",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-10 sm:py-14 lg:py-18 xl:py-20 xxl:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 xxl:px-10 xxxl:px-16">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10 xl:mb-12">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 mb-6 shadow-lg">
            <Icon name="User" size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              Meet the Experts
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl xxl:text-7xl font-bold text-slate-900 mb-2 sm:mb-3 lg:mb-4">
            The <span className="brand-gradient-text">Experts</span> Behind Your
            Success
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl  text-slate-600 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
            Our team combines marketers, developers, designers, and analysts—all
            working together to drive growth and build technology that performs.
          </p>
        </div>

        {/* Team Snapshot Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-4 sm:p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-900 text-center mb-4">
            Team Snapshot
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 xl:gap-8">
            {[
              {
                number: `${teamMembers.length}+`,
                label: "Team Members",
                icon: "Users",
              },
              { number: "50+", label: "Certifications", icon: "Award" },
              { number: "15+", label: "Technologies Mastered", icon: "Code" },
              { number: "5+", label: "Key Roles", icon: "Briefcase" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
                  <Icon name={stat.icon} size={18} className="text-primary" />
                </div>
                <div className="text-xl sm:text-2xl font-bold brand-gradient-text mb-1">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="w-full bg-slate-200 aspect-[4/6] sm:aspect-[3/5] md:aspect-[4/4]"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded mb-4 w-3/4"></div>
                  <div className="h-6 bg-slate-200 rounded mb-4 w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-200 rounded w-20"></div>
                    <div className="h-6 bg-slate-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))
          ) : teamMembers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Icon
                name="Users"
                size={48}
                className="text-slate-300 mx-auto mb-4"
              />
              <p className="text-slate-600">No team members found</p>
            </div>
          ) : (
            teamMembers.map((member) => (
              <div
                key={member._id || member.id}
                className="bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer overflow-hidden"
              >
                <div>
                  <div className="relative overflow-hidden aspect-[4/4] sm:aspect-[3/5] md:aspect-[4/4] bg-slate-100">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover object-[50%_20%] sm:object-[80%_20%]"
                    />
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div> */}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-4">
                      {member.role}
                    </p>
                    {/* Experience Badge */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {member.experience} Experience
                      </span>
                    </div>
                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.expertise.slice(0, 2).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-primary text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Want to Join Our Amazing Team?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              We're always looking for passionate individuals who share our
              vision of making digital transformation accessible and impactful.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                className="cta-button px-8 py-3 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300"
                onClick={() => (window.location.href = "/careers")}
              >
                View Open Positions
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSpotlight;
