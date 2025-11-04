import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useUserDetails from "../hooks/useUserDetails";
import { getAuthToken } from "@/utils/auth";

export type ItemsStats = {
  tradeValue: number;
  tradeBalance: number;
  exports: number;
  imports: number;
  Deepdata: Record<string, number>;
  countryData: Record<
    string,
    {
      export: number;
      import: number;
      totalTradeValue: number;
    }
  >;
  regionalData: Record<string, number>;
} | null;

export type Partner = {
  id: number;
  name: string;
  iso3?: string | null;
  continent?: string | null;
};

export type ContinentSum = {
  continent: string;
  tradeValue: number;
};

export type TradeApiParams = {
  year: number;
};

export type UserDetails = {
  id: number;
  username: string;
  email: string;
  role: string;
  full_name: string;
};

export type TopCommodities = {
  rank: number;
  commodityId: string;
  productName: string;
  category: string;
  value: number;
  valueFormatted: string;
  growthPct: number;
};

type TradeApiState = {
  params: TradeApiParams;
  setParams: (p: Partial<TradeApiParams>) => void;
  stats: ItemsStats;
  setStats: React.Dispatch<React.SetStateAction<ItemsStats>>;
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  continents: ContinentSum[];
  setContinents: React.Dispatch<React.SetStateAction<ContinentSum[]>>;
  userDetails: UserDetails | null;
  resetAll: () => void;
};

const TradeApiCtx = createContext<TradeApiState | undefined>(undefined);

export function TradeApiProvider({
  children,
  initialYear,
}: {
  children: React.ReactNode;
  initialYear?: number;
}) {
  const [{ loading, error }, executeValidate] = useUserDetails();

  // Global parameter
  const [params, setParamsState] = useState<TradeApiParams>({
    year: initialYear ?? new Date().getFullYear(),
  });
  const setParams = (p: Partial<TradeApiParams>) =>
    setParamsState((prev) => ({ ...prev, ...p }));

  // States to hold API data
  const [stats, setStats] = useState<ItemsStats>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [continents, setContinents] = useState<ContinentSum[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [topCommodities, setTopCommodities] = useState<TopCommodities[]>([]);

  // Fetch user details on mount
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { data } = await executeValidate({
          params: {
            token: getAuthToken(),
          },
        });

        if (data) {
          setUserDetails(data);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetAll = () => {
    setStats(null);
    setPartners([]);
    setContinents([]);
  };

  const value = useMemo<TradeApiState>(
    () => ({
      params,
      setParams,
      stats,
      setStats,
      partners,
      setPartners,
      continents,
      setContinents,
      userDetails, // Add this to your context type if you want to access it
      resetAll,
    }),
    [params, stats, partners, continents, userDetails]
  );

  return <TradeApiCtx.Provider value={value}>{children}</TradeApiCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTradeApi() {
  const ctx = useContext(TradeApiCtx);
  if (!ctx)
    throw new Error("useTradeApi must be used within <TradeApiProvider>");
  return ctx;
}
