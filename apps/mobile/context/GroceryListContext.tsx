import { createContext, useContext, useEffect, useState } from "react";
import { getGroceryList } from "../services/getGroceryList";
import { GroceryListItemType } from "../types/groceryListItemType";

export const GroceryListContext = createContext({
  groceryList: null as GroceryListItemType[] | null,
  setGroceryList: (groceryList: GroceryListItemType[]) => {},
  dateFrom: null as Date | null,
  setDateFrom: (dateFrom: Date) => {},
  dateTo: null as Date | null,
  setDateTo: (dateTo: Date) => {},
  refreshGroceryList: () => {},
  getCurrentWeek: () => {
    return { weekFrom: null as Date | null, weekTo: null as Date | null };
  },
});

export function GroceryListContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const getCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Monday start
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
        
    return { weekFrom: monday, weekTo: sunday };
  };
  const [dateFrom, setDateFrom] = useState<Date | null>(getCurrentWeek().weekFrom);
  const [dateTo, setDateTo] = useState<Date | null>(getCurrentWeek().weekTo);
  const [groceryList, setGroceryList] = useState<GroceryListItemType[]>([]);
  
  const refreshGroceryList = () => {
    getGroceryList({ dateFrom: dateFrom ?? getCurrentWeek().weekFrom, dateTo: dateTo ?? getCurrentWeek().weekTo }).then((groceryList) => {
      setGroceryList(groceryList ?? []);
      setDateFrom(dateFrom ?? getCurrentWeek().weekFrom);
      setDateTo(dateTo ?? getCurrentWeek().weekTo);
    });
  }

  useEffect(() => {
    refreshGroceryList();
  }, [dateFrom, dateTo]);

  return (
    <GroceryListContext.Provider value={{ groceryList, setGroceryList, dateFrom, setDateFrom, dateTo, setDateTo, refreshGroceryList, getCurrentWeek }}>
      {children}
    </GroceryListContext.Provider>
  );
}
