import { createContext, useContext, useEffect, useState } from "react";

export default function AuthContext() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);

    

    
  return (
    <div>AuthContext</div>
  )
}