import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { MealPlanType } from "../types/mealPlanType";
import { getMealPlan } from "../services/getMealPlan";
import { format } from "date-fns";

export const MealPlannerContext = createContext({
  mealPlan: null as MealPlanType | null,
  date: new Date(),
  setMealPlan: (mealPlan: MealPlanType | null) => {},
  setDate: (date: Date) => {},
  refreshMealPlanner: async () => {},
});

export function MealPlannerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null);
  const [date, setDate] = useState<Date>(new Date());

  const { isSignedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isSignedIn) {
      getMealPlan(format(date, "yyyy-MM-dd")).then((metrics) => {
        setMealPlan(metrics);
      });
    }
  }, [isSignedIn, date]);

  const refreshMealPlanner = async () => {
    const mealPlan = await getMealPlan(format(date, "yyyy-MM-dd"));
    setMealPlan(mealPlan);
  };

  return (
    <MealPlannerContext.Provider
      value={{ mealPlan, date, setMealPlan, setDate, refreshMealPlanner }}
    >
      {children}
    </MealPlannerContext.Provider>
  );
}
