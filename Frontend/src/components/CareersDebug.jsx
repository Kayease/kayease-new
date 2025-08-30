import React, { useState } from 'react';
import { useCareers } from '../hooks/useCareers';
import { testApiConnection } from '../utils/testApi';

const CareersDebug = () => {
  const [apiTestResult, setApiTestResult] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  
  const {
    jobOpenings,
    departments,
    isLoading,
    error,
    stats,
    refetch
  } = useCareers();

  const handleApiTest = async () => {
    setIsTestingApi(true);
    const result = await testApiConnection();
    setApiTestResult(result);
    setIsTestingApi(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Careers Debug Info</h3>
      
      <div className="space-y-2">
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Job Openings Count:</strong> {jobOpenings.length}</p>
        <p><strong>Departments Count:</strong> {departments.length}</p>
        <p><strong>Stats:</strong> {JSON.stringify(stats, null, 2)}</p>
        
        <div className="space-x-2">
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refetch Data
          </button>
          <button 
            onClick={handleApiTest}
            disabled={isTestingApi}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isTestingApi ? 'Testing...' : 'Test API'}
          </button>
        </div>
        
        {apiTestResult && (
          <div className="mt-4">
            <h4 className="font-semibold">API Test Result:</h4>
            <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(apiTestResult, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-4">
          <h4 className="font-semibold">Job Openings:</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(jobOpenings, null, 2)}
          </pre>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold">Departments:</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(departments, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CareersDebug;