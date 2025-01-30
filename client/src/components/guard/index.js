import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import jwt from "jsonwebtoken";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("accessToken"); // Obtén el token del almacenamiento
      if (!token) {
        navigate("/"); // Redirige si no hay token
        return;
      }

      try {
        const decoded = jwt.verify(token, "your-secret-key"); // Verifica el token
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("accessToken"); // Limpia el token expirado
          navigate("/"); // Redirige al usuario
        }
      } catch (err) {
        console.error("Token inválido:", err.message);
        localStorage.removeItem("accessToken"); // Limpia el token inválido
        navigate("/"); // Redirige al usuario
      }
    };

    checkToken();
  }, [navigate]);

  return <>{children}</>; // Renderiza los hijos si el token es válido
};

export default AuthGuard;
