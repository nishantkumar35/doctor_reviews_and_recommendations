import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading, otpPending } = useAuth();
  const location = useLocation();

  if (loading) return <div className="py-20 text-center animate-pulse text-slate-400">Verifying session...</div>;
  
  // If OTP is pending, always redirect to verify-otp
  if (otpPending && location.pathname !== '/verify-otp') {
    return <Navigate to="/verify-otp" replace />;
  }

  if (!user && !otpPending) {
    return <Navigate to="/login" replace />;
  }

  if (user) {
    if (role && user.role !== role) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
