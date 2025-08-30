// Simple API test utility
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const testApiConnection = async () => {
  try {
    
    // Test health endpoint first
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    
    const healthData = await healthResponse.json();
    
    // Test careers endpoint
    const careersResponse = await fetch(`${API_BASE_URL}/api/careers`);
    
    if (!careersResponse.ok) {
      throw new Error(`Careers API failed: ${careersResponse.status}`);
    }
    
    const careersData = await careersResponse.json();
    
    // Test stats endpoint
    const statsResponse = await fetch(`${API_BASE_URL}/api/careers/stats/overview`);
    
    if (!statsResponse.ok) {
      throw new Error(`Stats API failed: ${statsResponse.status}`);
    }
    
    const statsData = await statsResponse.json();
    
    return {
      success: true,
      health: healthData,
      careers: careersData,
      stats: statsData
    };
    
  } catch (error) {
    console.error('API test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};