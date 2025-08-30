import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import api from "../../utils/axiosConfig";

const ApiTest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const testEndpoints = [
    {
      name: "Health Check",
      endpoint: "/api/health",
      method: "GET",
      description: "Check if server is running"
    },
    {
      name: "Get Current User",
      endpoint: "/api/auth/me",
      method: "GET",
      description: "Get authenticated user info"
    },
    {
      name: "Admin Dashboard",
      endpoint: "/api/admin/dashboard",
      method: "GET",
      description: "Get admin dashboard data"
    },
    {
      name: "Get All Users",
      endpoint: "/api/admin/users",
      method: "GET",
      description: "Get all users (admin only)"
    }
  ];

  const runTest = async (endpoint) => {
    setIsLoading(true);
    try {
      const startTime = Date.now();
      const response = await api.get(endpoint.endpoint);
      const endTime = Date.now();
      const duration = endTime - startTime;

      setTestResults(prev => ({
        ...prev,
        [endpoint.name]: {
          status: 'success',
          statusCode: response.status,
          duration: `${duration}ms`,
          data: response.data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));

      toast.success(`${endpoint.name} test passed!`);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpoint.name]: {
          status: 'error',
          statusCode: error.response?.status || 'Network Error',
          error: error.response?.data?.message || error.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));

      toast.error(`${endpoint.name} test failed!`);
    } finally {
      setIsLoading(false);
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    for (const endpoint of testEndpoints) {
      await runTest(endpoint);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults({});
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">API Test Panel</h1>
            <p className="text-slate-600">Test API endpoints and check connectivity</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={clearResults}
              variant="outline"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
            >
              Clear Results
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={runAllTests}
              disabled={isLoading}
              iconName={isLoading ? "Loader2" : "Play"}
              iconPosition="left"
            >
              {isLoading ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </div>
        </div>

        {/* API Endpoints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testEndpoints.map((endpoint) => (
            <div
              key={endpoint.name}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    {endpoint.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {endpoint.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      endpoint.method === 'GET' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                      {endpoint.endpoint}
                    </code>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runTest(endpoint)}
                  disabled={isLoading}
                  iconName="Play"
                  iconPosition="left"
                >
                  Test
                </Button>
              </div>

              {/* Test Results */}
              {testResults[endpoint.name] && (
                <div className={`border rounded-lg p-4 ${
                  testResults[endpoint.name].status === 'success'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={testResults[endpoint.name].status === 'success' ? 'CheckCircle' : 'XCircle'} 
                        size={16} 
                        className={
                          testResults[endpoint.name].status === 'success' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        } 
                      />
                      <span className={`text-sm font-medium ${
                        testResults[endpoint.name].status === 'success' 
                          ? 'text-green-800' 
                          : 'text-red-800'
                      }`}>
                        {testResults[endpoint.name].status === 'success' ? 'Success' : 'Failed'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {testResults[endpoint.name].timestamp}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Status Code:</span>
                      <span className={`font-mono ${
                        testResults[endpoint.name].statusCode === 200 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {testResults[endpoint.name].statusCode}
                      </span>
                    </div>
                    
                    {testResults[endpoint.name].duration && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Duration:</span>
                        <span className="font-mono text-slate-700">
                          {testResults[endpoint.name].duration}
                        </span>
                      </div>
                    )}
                    
                    {testResults[endpoint.name].error && (
                      <div className="text-xs">
                        <span className="text-slate-600">Error:</span>
                        <p className="text-red-600 mt-1">
                          {testResults[endpoint.name].error}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Test Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {Object.keys(testResults).length}
                </div>
                <div className="text-sm text-slate-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(testResults).filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-slate-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(testResults).filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-slate-600">Failed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ApiTest