import RegForm from 'components/RegForm';
import React from 'react';
import { useLocation } from 'react-router-dom';

export const SignUp = () => {
  const location = useLocation();
  const regType = location.pathname.slice(1).toLowerCase();
  return <RegForm type={regType} />;
};
