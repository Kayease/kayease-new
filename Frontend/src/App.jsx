import React from "react";
import { AuthProvider } from './contexts/AuthContext';
import Routes from "./Routes";
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
