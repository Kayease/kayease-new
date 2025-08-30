import { useState, useEffect } from 'react';
import { careerApi } from '../utils/careerApi';
import { mockCareers, mockStats } from '../data/mockCareers';

export const useCareersSimple = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalDepartments: 0,
    teamMembers: 50,
    satisfaction: 95
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const transformCareerData = (career) => {
    if (!career || !career._id) {
      console.warn('Invalid career data:', career);
      return null;
    }

    return {
      id: career._id,
      title: career.title || 'Untitled Position',
      department: career.department ? career.department.charAt(0).toUpperCase() + career.department.slice(1) : 'Other',
      location: career.location || 'Location TBD',
      type: career.jobType === "remote" ? "Remote" : 
            career.jobType === "hybrid" ? "Hybrid" : 
            career.jobType === "in-office" ? "In-office" : 
            career.jobType === "onsite" ? "In-office" : 
            career.jobType ? career.jobType.charAt(0).toUpperCase() + career.jobType.slice(1) : 'Full-time',
      jobType: career.jobType || 'full-time',
      experience: career.experience || "Not specified",
      skills: Array.isArray(career.skills) ? career.skills.filter(skill => skill && skill.trim()) : [],
      description: career.description || "No description available",
      requirements: Array.isArray(career.requirements) ? career.requirements.filter(req => req && req.trim()) : [],
      responsibilities: Array.isArray(career.responsibilities) ? career.responsibilities.filter(resp => resp && resp.trim()) : [],
      benefits: Array.isArray(career.benefits) ? career.benefits.filter(benefit => benefit && benefit.trim()) : [],
      salary: career.salary || "Competitive",
      posted: formatDate(career.createdAt || career.postedDate),
      status: career.status || 'active',
      applicationCount: career.applicationCount || 0,
      viewCount: career.viewCount || 0,
    };
  };

  const loadCareersData = async () => {
    if (isLoading) return; // Prevent multiple simultaneous requests
    
    setIsLoading(true);
    setError("");

    try {
      const filters = { 
        status: 'active', 
        limit: 100, 
        sortBy: 'createdAt', 
        sortOrder: 'desc'
      };
      
      
      // Fetch careers and stats
      const [careersResponse, statsResponse] = await Promise.all([
        careerApi.getAll(filters),
        careerApi.getStats().catch(err => {
          console.warn('Failed to load stats:', err);
          return null;
        })
      ]);
      

      // Validate response structure
      if (!careersResponse || typeof careersResponse !== 'object') {
        throw new Error('Invalid response format from careers API');
      }

      const careers = Array.isArray(careersResponse.careers) ? careersResponse.careers : 
                     Array.isArray(careersResponse) ? careersResponse : [];

      // Filter and validate careers data
      const validCareers = careers.filter(career => {
        return career && 
               career._id && 
               career.title && 
               career.department && 
               career.location && 
               career.jobType &&
               career.status === 'active';
      });

      // Transform careers data and filter out null results
      const transformedCareers = validCareers
        .map(transformCareerData)
        .filter(career => career !== null);

      setJobOpenings(transformedCareers);

      // Create departments from stats with fallback
      const departmentColors = {
        engineering: "bg-blue-500",
        design: "bg-purple-500",
        marketing: "bg-green-500",
        sales: "bg-orange-500",
        operations: "bg-pink-500",
        hr: "bg-indigo-500",
        finance: "bg-yellow-500",
        other: "bg-gray-500",
      };

      if (statsResponse && statsResponse.departments && Array.isArray(statsResponse.departments) && statsResponse.departments.length > 0) {
        const transformedDepartments = statsResponse.departments
          .filter(dept => dept && dept._id)
          .map((dept) => ({
            name: dept._id.charAt(0).toUpperCase() + dept._id.slice(1),
            count: dept.activeCount || dept.count || 0,
            color: departmentColors[dept._id.toLowerCase()] || "bg-gray-500",
          }))
          .filter(dept => dept.count > 0);

        setDepartments(transformedDepartments);
      } else {
        // Fallback: create departments from actual job data
        const departmentCounts = {};
        transformedCareers.forEach(career => {
          if (career.department) {
            const deptKey = career.department.toLowerCase();
            departmentCounts[deptKey] = (departmentCounts[deptKey] || 0) + 1;
          }
        });

        const fallbackDepartments = Object.entries(departmentCounts).map(([key, count]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          count,
          color: departmentColors[key] || "bg-gray-500"
        }));

        setDepartments(fallbackDepartments);
      }

      // Update stats with fallbacks
      const departmentCount = statsResponse?.departments?.length || 
                             (transformedCareers.length > 0 ? 
                              new Set(transformedCareers.map(c => c.department)).size : 0);
      
      setStats(prevStats => ({
        ...prevStats,
        totalJobs: statsResponse?.overview?.active || transformedCareers.length,
        totalDepartments: departmentCount,
      }));

    } catch (error) {
      console.error("Error loading careers:", error);
      
      
      try {
        const mockTransformedCareers = mockCareers
          .map(transformCareerData)
          .filter(career => career !== null);
        
        setJobOpenings(mockTransformedCareers);
        
        const departmentColors = {
          engineering: "bg-blue-500",
          design: "bg-purple-500",
          marketing: "bg-green-500",
          sales: "bg-orange-500",
          operations: "bg-pink-500",
          hr: "bg-indigo-500",
          finance: "bg-yellow-500",
          other: "bg-gray-500",
        };

        const mockDepartments = mockStats.departments.map((dept) => ({
          name: dept._id.charAt(0).toUpperCase() + dept._id.slice(1),
          count: dept.activeCount || dept.count || 0,
          color: departmentColors[dept._id.toLowerCase()] || "bg-gray-500",
        }));

        setDepartments(mockDepartments);
        
        setStats(prevStats => ({
          ...prevStats,
          totalJobs: mockStats.overview.active,
          totalDepartments: mockStats.departments.length,
        }));
        
        setError("Using offline data - some information may not be current. Please check your internet connection.");
        
      } catch (mockError) {
        console.error("Failed to load mock data:", mockError);
        setError("Failed to load career opportunities. Please try again later.");
        setJobOpenings([]);
        setDepartments([]);
        setStats(prevStats => ({
          ...prevStats,
          totalJobs: 0,
          totalDepartments: 0,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadCareersData();
  }, []); // Empty dependency array - only run once on mount

  const refetch = () => {
    loadCareersData();
  };

  return {
    jobOpenings,
    departments,
    isLoading,
    error,
    stats,
    refetch,
    formatDate
  };
};