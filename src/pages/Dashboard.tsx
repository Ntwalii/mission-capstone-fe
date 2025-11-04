import { useState, useEffect, useMemo } from "react";
import { KpiCard } from "@/components/ui/kpi-card";
import { TradeChart } from "@/components/charts/TradeChart";
import { TopPartnersChart } from "@/components/charts/TopPartnersChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Globe,
  Package,
  Calendar,
  ArrowUpRight,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { fmtMoney } from "@/lib/utils";
import { useTradeApi } from "@/context/TradeApi";
import useStats from "@/hooks/useStats";
import useTopCommodities from "@/hooks/useTopCommodities";
import useContinents from "@/hooks/useContinents";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "@/components/ui/Loader";

/* --------------------------------
   Config
----------------------------------*/
const availableYears = [2022, 2021, 2020] as const;
type Year = (typeof availableYears)[number];
type Metric = "exports" | "imports";

/* --------------------------------
   Deterministic fake data helpers
   (seeded RNG so each year is stable)
----------------------------------*/
function mulberry32(seed: number) {
  // eslint-disable-next-line no-bitwise
  let t = seed + 0x6d2b79f5;
  return () => {
    // eslint-disable-next-line no-bitwise
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    // eslint-disable-next-line no-bitwise
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function genQuarterlyTradeData(year: Year) {
  // Base values vary by year but remain stable due to seed
  const rnd = mulberry32(year);
  const baseExports = 100_000_000 + Math.floor(rnd() * 30_000_000); // $100–130M
  const baseImports = 130_000_000 + Math.floor(rnd() * 30_000_000); // $130–160M

  // Slight quarter-to-quarter drift
  const q = ["Q1", "Q2", "Q3", "Q4"].map((label, i) => {
    const driftE = (rnd() - 0.5) * 0.12; // ±12%
    const driftI = (rnd() - 0.5) * 0.1; // ±10%
    const exports = Math.round(baseExports * (1 + 0.05 * i) * (1 + driftE));
    const imports = Math.round(baseImports * (1 + 0.04 * i) * (1 + driftI));
    return { quarter: label, exports, imports, balance: exports - imports };
  });

  return q;
}

type PartnerRow = { partner: string; value: number };
const PARTNER_POOL = [
  "USA",
  "Germany",
  "Belgium",
  "UAE",
  "China",
  "Kenya",
  "India",
  "Tanzania",
  "DRC",
  "Uganda",
] as const;

function genTopPartners(year: Year, metric: Metric, topN = 6): PartnerRow[] {
  const rnd = mulberry32(Number(`${year}${metric === "exports" ? 1 : 2}`));
  // Create a stable but varied ranking each year/metric
  const rows = PARTNER_POOL.map((name, idx) => {
    // Weighted base so the first few are usually larger
    const base = (PARTNER_POOL.length - idx) * (metric === "exports" ? 9 : 10);
    const noise = 0.6 + rnd() * 0.8; // 0.6–1.4
    const value = Math.round(base * noise * 10_000_00); // scale to ~$6–$14M-ish
    return { partner: name, value };
  })
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);

  return rows;
}

/* --------------------------------
   Component
----------------------------------*/
export default function Dashboard() {
  const { setParams, setStats } = useTradeApi();

  // ---- API hooks ----
  const [{ data, loading, error }, getStats] = useStats();
  const [
    { data: topCommodities, loading: topLoading, error: topError },
    getTopCommodities,
  ] = useTopCommodities();
  const [
    { data: continents, loading: contLoading, error: contError },
    getContinents,
  ] = useContinents();

  const [selectedYear, setSelectedYear] = useState<Year>(2022);
  const [partnerMetric, setPartnerMetric] = useState<Metric>("exports");

  // Fetch stats on year change
  useEffect(() => {
    (async () => {
      try {
        await getStats({ params: { year: selectedYear } });
        setParams({ year: selectedYear });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    })();
  }, [selectedYear]);

  // Fetch top commodities on year change
  useEffect(() => {
    (async () => {
      try {
        await getTopCommodities({ params: { year: selectedYear, limit: 5 } });
      } catch (err) {
        console.error("Failed to fetch top commodities:", err);
      }
    })();
  }, [selectedYear]);

  // Fetch continents on year change
  useEffect(() => {
    (async () => {
      try {
        await getContinents({ params: { year: selectedYear } });
      } catch (err) {
        console.error("Failed to fetch continents:", err);
      }
    })();
  }, [selectedYear]);

  // Push stats into context for global access
  useEffect(() => {
    if (data) setStats(data);
  }, [data]);

  const handleYearChange = (year: Year) => setSelectedYear(year);

  // ---- Derived (fake) chart data tied to selectedYear ----
  const quarterlyTrade = useMemo(
    () => genQuarterlyTradeData(selectedYear),
    [selectedYear]
  );
  const partnersData = useMemo(
    () => genTopPartners(selectedYear, partnerMetric, 6),
    [selectedYear, partnerMetric]
  );

  // Loading gate for the KPI row
  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-hero bg-clip-text text-primary">
            Trade Intelligence Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time insights into Rwanda&apos;s import and export activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Year Picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={loading || topLoading || contLoading}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {selectedYear}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableYears.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={selectedYear === year ? "bg-accent" : ""}
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Partners metric toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {partnerMetric === "exports" ? "Exports" : "Imports"}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(["exports", "imports"] as Metric[]).map((m) => (
                <DropdownMenuItem
                  key={m}
                  onClick={() => setPartnerMetric(m)}
                  className={partnerMetric === m ? "bg-accent" : ""}
                >
                  {m[0].toUpperCase() + m.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Error State */}
      {(error || topError || contError) && (
        <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4">
          <p className="text-destructive">
            Failed to load data. Please try again.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      {!error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Total Trade Value"
              value={fmtMoney(data?.tradeValue)}
              change="+15.2% from last year"
              changeType="positive"
              icon={DollarSign}
            />
            <KpiCard
              title="Trade Balance"
              value={fmtMoney(data?.tradeBalance)}
              change="Deficit decreased by 8%"
              changeType="positive"
              icon={TrendingDown}
            />
            <KpiCard
              title="Total Exports"
              value={fmtMoney(data?.exports)}
              change="+12.3%"
              changeType="positive"
              icon={TrendingUp}
            />
            <KpiCard
              title="Total Imports"
              value={fmtMoney(data?.imports)}
              change="+8.7%"
              changeType="positive"
              icon={Package}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quarterly trade flow (4 points) */}
            <TradeChart
              title={`Trade Flow Trends — ${selectedYear}`}
              data={quarterlyTrade.map((d) => ({
                // adapt to your chart’s expected keys
                label: d.quarter,
                exports: d.exports,
                imports: d.imports,
              }))}
              type="line"
              height={350}
              // Optional: if your TradeChart accepts series labels
              // series={[{ key: "exports", name: "Exports" }, { key: "imports", name: "Imports" }]}
            />

            {/* Top trading partners (functional) */}
            <TopPartnersChart
              title={`Top Trading Partners — ${selectedYear} (${partnerMetric})`}
              data={partnersData.map((p) => ({
                name: p.partner,
                amount: p.value,
              }))}
              height={350}
            />
          </div>

          {/* Secondary Charts and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products (from API) */}
            <Card className="hover:shadow-medium transition-all duration-200 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Top Export Products
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {topLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(topCommodities ?? [])
                      .slice(0, 5)
                      .map((p: any, idx: number) => (
                        <div
                          key={p.commodityId ?? idx}
                          className="flex items-center justify-between"
                        >
                          {/* Left: rank + name + category */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                              {p.rank ?? idx + 1}
                            </div>
                            <div className="min-w-0">
                              <p
                                className="font-medium truncate max-w-[160px] sm:max-w-[220px]"
                                title={p.productName}
                              >
                                {p.productName}
                              </p>
                              {p.category && (
                                <p className="text-sm text-muted-foreground truncate capitalize">
                                  {p.category}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right: aligned numbers */}
                          <div className="flex flex-col items-end text-right">
                            <p className="font-semibold tabular-nums">
                              {fmtMoney(p.value)}
                            </p>
                            <Badge
                              variant="secondary"
                              className="text-xs flex items-center"
                            >
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              {p.growthPct == null
                                ? "—"
                                : `${p.growthPct > 0 ? "+" : ""}${
                                    p.growthPct
                                  }%`}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Regional Trade Distribution (live) */}
            <Card className="hover:shadow-medium transition-all duration-200 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Regional Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {contLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-5">
                    {(() => {
                      const rows = (continents ?? []).filter(
                        (c) => c.continent?.toLowerCase() !== "unknown"
                      ) as Array<{ continent: string; tradeValue: number }>;

                      if (!rows.length) {
                        return (
                          <div className="text-sm text-muted-foreground">
                            No data.
                          </div>
                        );
                      }
                      const max =
                        Math.max(
                          ...rows.map((r) => Number(r.tradeValue || 0))
                        ) || 1;

                      return rows.map((r) => {
                        const value = Number(r.tradeValue || 0);
                        const pct = Math.max(
                          0,
                          Math.min(100, (value / max) * 100)
                        );
                        const label = r.continent || "Other";

                        return (
                          <div key={label} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{label}</span>
                              <span className="text-muted-foreground tabular-nums">
                                {fmtMoney(value)}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
