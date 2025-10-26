import React, { createContext, useContext, useMemo, useState } from "react";

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

type TradeApiState = {
  // global params (just year now)
  params: TradeApiParams;
  setParams: (p: Partial<TradeApiParams>) => void;

  // /items/stats
  stats: ItemsStats;
  setStats: React.Dispatch<React.SetStateAction<ItemsStats>>;

  // /items/partners
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;

  // /items/stats/continents
  continents: ContinentSum[];
  setContinents: React.Dispatch<React.SetStateAction<ContinentSum[]>>;

  // helper to clear all
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
      resetAll,
    }),
    [params, stats, partners, continents]
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
