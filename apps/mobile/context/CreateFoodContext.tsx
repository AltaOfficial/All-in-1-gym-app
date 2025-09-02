import { createContext, useState, ReactNode } from 'react';

interface CreateFoodContextType {
  // Basic food information
  brandName: string;
  description: string;
  servingSize: string;
  servingUnit: string;
  
  // Methods
  setBrandName: (brandName: string) => void;
  setDescription: (description: string) => void;
  setServingSize: (servingSize: string) => void;
  setServingUnit: (servingUnit: string) => void;
  clearContext: () => void;
}

export const CreateFoodContext = createContext<CreateFoodContextType>({
    // Basic food information
    brandName: '',
    description: '',
    servingSize: '',
    servingUnit: 'g',
    
    // Methods
    setBrandName: () => {},
    setDescription: () => {},
    setServingSize: () => {},
    setServingUnit: () => {},
    clearContext: () => {},
  });

export const CreateFoodProvider = ({ children }: {children: ReactNode}) => {
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [servingUnit, setServingUnit] = useState('g');


  const clearContext = () => {
    setBrandName('');
    setDescription('');
    setServingSize('');
    setServingUnit('g');
  };

  const value: CreateFoodContextType = {
    brandName,
    description,
    servingSize,
    servingUnit,
    setBrandName,
    setDescription,
    setServingSize,
    setServingUnit,
    clearContext,
  };

  return (
    <CreateFoodContext.Provider value={value}>
      {children}
    </CreateFoodContext.Provider>
  );
};
