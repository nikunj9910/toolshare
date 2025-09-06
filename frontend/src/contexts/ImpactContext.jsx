import { createContext, useContext, useState, useEffect } from 'react';

const ImpactContext = createContext();

export const useImpact = () => {
  const context = useContext(ImpactContext);
  if (!context) {
    throw new Error('useImpact must be used within an ImpactProvider');
  }
  return context;
};

export const ImpactProvider = ({ children }) => {
  const [kg, setKg] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('kg') || 0);
    }
    return 0;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kg', kg.toString());
    }
  }, [kg]);

  const addImpact = (amount) => {
    setKg(prev => prev + amount);
  };

  return (
    <ImpactContext.Provider value={{ kg, addImpact }}>
      {children}
    </ImpactContext.Provider>
  );
};

