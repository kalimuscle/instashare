import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  // Estado global
  const [data, setData] = useState(() => {
    // Cargar datos iniciales desde localStorage
    const storedData = localStorage.getItem('appData');
    return storedData ? JSON.parse(storedData) : null;
  });

  // Actualizar localStorage cuando cambie `data`
  useEffect(() => {
    if (data) {
      localStorage.setItem('appData', JSON.stringify(data));
    }
    else {
        localStorage.removeItem('appData');
      }
  }, [data]);


  // Proveer valores y funciones a los componentes hijos
  return (
    <AppContext.Provider value={{ data, setData }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
