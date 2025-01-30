import React from 'react';
import { Navigate } from 'react-router';
import { useContext } from 'react';
import { AppContext } from '../../context/app';

function isTokenValid(token) {
  if (!token || !token.exp) {
      return false; // Si el token no existe o no tiene "exp", consideramos que no es válido
  }

  const currentTime = Math.floor(Date.now() / 1000); // Convertir a segundos
  return token.exp > currentTime;
}

const PrivateRoute = ({ children }) => {
  const { data } = useContext(AppContext);
  
  if (!isTokenValid(data)) {
    return <Navigate to="/signin"/>
  }

  // If the user is authenticated, show the protected content
  return children;
};

export default PrivateRoute;
