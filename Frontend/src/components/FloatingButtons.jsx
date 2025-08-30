import React from 'react';
import { useLocation } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import CallbackButton from './CallbackButton';

const FloatingButtons = () => {
  const location = useLocation();
  
  // Don't show floating buttons on admin pages, auth pages, or 404 page
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isNotFoundPage = location.pathname === '*';
  
  if (isAdminPage || isAuthPage || isNotFoundPage) {
    return null;
  }
  
  return (
    <>
      <WhatsAppButton />
      <CallbackButton />
    </>
  );
};

export default FloatingButtons;
