import { createContext, useState, ReactNode } from "react";
import { FoodType } from "../types/foodType";

interface RecipeContextType {
  // Basic food information
  recipeName: string;
  servingsAmount: string;
  ingredients: FoodType[];
  // Methods
  setRecipeName: (recipeName: string) => void;
  setServingsAmount: (servingsAmount: string) => void;
  setIngredients: (ingredients: FoodType[]) => void;
  clearRecipeContext: () => void;
}

export const RecipeContext = createContext<RecipeContextType>({
  // Basic food information
  recipeName: "",
  servingsAmount: "",
  ingredients: [],
  // Methods
  setRecipeName: () => {},
  setServingsAmount: () => {},
  setIngredients: (ingredients: FoodType[]) => {},
  clearRecipeContext: () => {},
});

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipeName, setRecipeName] = useState("");
  const [servingsAmount, setServingsAmount] = useState("");
  const [ingredients, setIngredients] = useState<FoodType[]>([]);
  const clearRecipeContext = () => {
    setRecipeName("");
    setServingsAmount("");
    setIngredients([]);
  };

  const value: RecipeContextType = {
    recipeName,
    servingsAmount,
    ingredients,
    setIngredients,
    setRecipeName,
    setServingsAmount,
    clearRecipeContext,
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
};
