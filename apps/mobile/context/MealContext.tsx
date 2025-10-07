import { createContext, useState, ReactNode } from "react";
import { FoodType } from "../types/foodType";

interface MealContextType {
  mealItems: FoodType[];
  // Methods
  setMealItems: (mealItems: FoodType[]) => void;
  clearMealContext: () => void;
}

export const MealContext = createContext<MealContextType>({
  mealItems: [],
  // Methods
  setMealItems: (mealItems: FoodType[]) => {},
  clearMealContext: () => {},
});

export const MealProvider = ({ children }: { children: ReactNode }) => {
  const [mealItems, setMealItems] = useState<FoodType[]>([]);

  const clearMealContext = () => {
    setMealItems([]);
  };

  const value: MealContextType = {
    mealItems,
    setMealItems,
    clearMealContext,
  };

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>;
};
