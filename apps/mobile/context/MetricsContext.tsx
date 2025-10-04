import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { NutritionMetrics } from "../types/metricsType";
import { getDailyMetrics } from "../services/getDailyMetrics";

export const MetricsContext = createContext({
  metrics: null as NutritionMetrics | null,
  setMetrics: (metrics: NutritionMetrics | null) => {},
  refreshMetrics: async () => {},
});

export function MetricsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [metrics, setMetrics] = useState<NutritionMetrics | null>(null);

  const { isSignedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isSignedIn) {
      getDailyMetrics().then((metrics) => {
        setMetrics(metrics);
      });
    }
  }, [isSignedIn]);
  
  const refreshMetrics = async () => {
    const metrics = await getDailyMetrics();
    setMetrics(metrics);
  }

  return (
    <MetricsContext.Provider value={{ metrics, setMetrics, refreshMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
}
