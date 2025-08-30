import React from 'react';
import { PendingCountsProvider } from '../../contexts/PendingCountsContext';

const AdminWrapper = ({ children }) => {
  return (
    <PendingCountsProvider>
      {children}
    </PendingCountsProvider>
  );
};

export default AdminWrapper;
