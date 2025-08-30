import React, { createContext, useContext, useState, useEffect } from 'react';
import { contactApi } from '../utils/contactApi';
import { jobApplicationApi } from '../utils/jobApplicationApi';
import { callbackRequestApi } from '../utils/callbackRequestApi';

const PendingCountsContext = createContext();

export const usePendingCounts = () => {
  const context = useContext(PendingCountsContext);
  if (!context) {
    throw new Error('usePendingCounts must be used within a PendingCountsProvider');
  }
  return context;
};

export const PendingCountsProvider = ({ children }) => {
  const [pendingCounts, setPendingCounts] = useState({
    contacts: 0,
    applications: 0,
    callbackRequests: 0
  });
  const [loading, setLoading] = useState(true);

  const loadPendingCounts = async () => {
    try {
      setLoading(true);

      // Load pending contacts (new and unread)
      const [contactsResponse, applicationsResponse, callbackRequestsResponse] = await Promise.all([
        contactApi.getAll({ status: 'new', isRead: false, limit: 1000 }),
        jobApplicationApi.getAll({ status: 'pending', limit: 1000 }),
        callbackRequestApi.getAll({ status: 'new', limit: 1000 })
      ]);

      setPendingCounts({
        contacts: contactsResponse.contacts?.length || 0,
        // jobApplicationApi.getAll returns { success, data: { applications, ... } }
        applications: (applicationsResponse?.data?.applications?.length) || 0,
        callbackRequests: callbackRequestsResponse.requests?.length || 0
      });
    } catch (error) {
      console.error('Error loading pending counts:', error);
      // Set default values on error
      setPendingCounts({ contacts: 0, applications: 0, callbackRequests: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Refresh counts when called
  const refreshCounts = () => {
    loadPendingCounts();
  };

  // Update specific count
  const updateCount = (type, newCount) => {
    setPendingCounts(prev => ({
      ...prev,
      [type]: Math.max(0, newCount) // Ensure count is never negative
    }));
  };

  // Increment/decrement specific count
  const adjustCount = (type, adjustment) => {
    setPendingCounts(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + adjustment)
    }));
  };

  // Load counts on mount
  useEffect(() => {
    loadPendingCounts();
  }, []);

  const value = {
    pendingCounts,
    loading,
    refreshCounts,
    updateCount,
    adjustCount
  };

  return (
    <PendingCountsContext.Provider value={value}>
      {children}
    </PendingCountsContext.Provider>
  );
};
