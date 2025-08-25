import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/getCurrentUser";
import User from "../types/userType";
import { AuthContext } from "./AuthContext";

export const UserContext = createContext({
  user: null as User | null,
  setUser: (user: User | null) => {},
});

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const { isSignedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isSignedIn) {
      getCurrentUser().then((user) => {
        setUser(user);
      });
    }
  }, [isSignedIn]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
