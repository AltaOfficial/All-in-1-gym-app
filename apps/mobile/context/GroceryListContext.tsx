import { createContext, useContext, useEffect, useState } from "react";
import { getGroceryList } from "../services/getGroceryList";
import { GroceryListItemType } from "../types/groceryListItemType";
import { startOfWeek, endOfWeek } from "date-fns";
import { format } from "date-fns";

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
    const weekFrom = startOfWeek(today);
    const weekTo = endOfWeek(today);

    return { weekFrom, weekTo };
  };
  const [dateFrom, setDateFrom] = useState<Date | null>(
    getCurrentWeek().weekFrom
  );
  const [dateTo, setDateTo] = useState<Date | null>(getCurrentWeek().weekTo);
  const [groceryList, setGroceryList] = useState<GroceryListItemType[]>([]);

  const refreshGroceryList = () => {
    getGroceryList({
      dateFrom: format(dateFrom ?? getCurrentWeek().weekFrom, "yyyy-MM-dd"),
      dateTo: format(dateTo ?? getCurrentWeek().weekTo, "yyyy-MM-dd"),
    }).then((groceryList) => {
      setGroceryList(groceryList ?? []);
      setDateFrom(dateFrom ?? getCurrentWeek().weekFrom);
      setDateTo(dateTo ?? getCurrentWeek().weekTo);
    });
  };

  useEffect(() => {
    refreshGroceryList();
  }, [dateFrom, dateTo]);

  return (
    <GroceryListContext.Provider
      value={{
        groceryList,
        setGroceryList,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        refreshGroceryList,
        getCurrentWeek,
      }}
    >
      {children}
    </GroceryListContext.Provider>
  );
}
