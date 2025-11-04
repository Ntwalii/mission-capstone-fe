/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useTradeApi } from "@/context/TradeApi";
import useSimulation from "@/hooks/useSimulation";
import useCountries from "@/hooks/useCountries";
import useCommodities from "@/hooks/useCommodities";
import Loader from "@/components/ui/Loader";

const years = [2025, 2024, 2023, 2022, 2021, 2020];
const ANY = "__ANY__";

export default function WhatIf() {
  const { params } = useTradeApi();

  const initialYear = useMemo(() => {
    const y = Number(params?.year);
    return years.includes(y) ? y : years[0];
  }, [params?.year]);

  const [scenarioName, setScenarioName] = useState("Growth Projection");
  const [year, setYear] = useState<number>(2022);
  const [partnerIso3Value, setPartnerIso3Value] = useState<string>(ANY);
  const [commodityValue, setCommodityValue] = useState<string>(ANY);
  const [exportChangePct, setExportChangePct] = useState<number>(10);

  // Simulation
  const [{ data, loading: simLoading, error: simError }, runSimulation] =
    useSimulation();

  // Partners
  const [
    { data: countriesData, loading: countriesLoading, error: countriesError },
    fetchCountries,
  ] = useCountries();

  // Commodities
  const [
    {
      data: commoditiesData,
      loading: commoditiesLoading,
      error: commoditiesError,
    },
    fetchCommodities,
  ] = useCommodities();

  const abortRef = useRef<AbortController | null>(null);

  // Fetch countries (partners)
  useEffect(() => {
    void fetchCountries({
      params: { withData: true, year: 2022 },
    });
  }, [year, fetchCountries]);

  // Fetch commodities
  useEffect(() => {
    void fetchCommodities({ params: { q: "", limit: 100, offset: 0 } });
  }, [fetchCommodities]);

  // Clean up partners list to only valid ISO3
  const partners = useMemo(
    () => [
      { label: "— Any partner —", value: ANY },
      ...(countriesData ?? [])
        .filter((p: any) => /^[A-Z]{3}$/.test(p.iso3 || ""))
        .map((p: any) => ({
          label: p.name ?? p.iso3,
          value: p.iso3,
        })),
    ],
    [countriesData]
  );

  // Commodities list
  const commodities = useMemo(
    () => [
      { label: "— Any commodity —", value: ANY },
      ...(commoditiesData ?? []).map((c: any) => ({
        label: c.name ? `${c.name}${c.code ? ` (${c.code})` : ""}` : c.code,
        value: String(c.id),
      })),
    ],
    [commoditiesData]
  );

  const chartData = data?.chart ?? [];
  const current = data?.current || { exports: 0, imports: 0, balance: 0 };
  const scenario = data?.scenario || { exports: 0, imports: 0, balance: 0 };
  const deltas = data?.deltas || {
    exportsDelta: 0,
    importsDelta: 0,
    balanceDelta: 0,
  };

  const onRun = () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const partnerIso3 = partnerIso3Value === ANY ? undefined : partnerIso3Value;
    const commodityId = commodityValue === ANY ? null : Number(commodityValue);

    const payload = {
      year,
      exportChangePct,
      partnerIso3,
      commodityId,
      name: scenarioName || undefined,
    };

    void runSimulation({ data: payload, signal: abortRef.current.signal });
  };

  const isLoading = simLoading || countriesLoading || commoditiesLoading;
  const anyError = simError || countriesError || commoditiesError;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">What-If Analysis</h1>

      {data && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-xl font-semibold tabular-nums">
                {current.balance.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Scenario Balance</p>
              <p className="text-xl font-semibold tabular-nums">
                {scenario.balance.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Balance Δ</p>
              <div className="flex items-center gap-2">
                <p
                  className={`text-xl font-semibold tabular-nums ${
                    deltas.balanceDelta >= 0
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {deltas.balanceDelta.toLocaleString()}
                </p>
                <Badge
                  variant={deltas.balanceDelta >= 0 ? "default" : "destructive"}
                >
                  {deltas.balanceDelta >= 0 ? "Gain" : "Loss"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Builder */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Build a Scenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="scenario-name" className="text-sm font-medium">
                  Scenario Name
                </label>
                <Input
                  id="scenario-name"
                  placeholder="e.g., '2025 Growth Projection'"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Year</label>
                <Select
                  value={String(year)}
                  onValueChange={(v) => setYear(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Target Country</label>
                <Select
                  value={partnerIso3Value}
                  onValueChange={(v) => setPartnerIso3Value(v)}
                  disabled={countriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Commodity</label>
                <Select
                  value={commodityValue}
                  onValueChange={(v) => setCommodityValue(v)}
                  disabled={commoditiesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a commodity (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {commodities.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="change" className="text-sm font-medium">
                  Export Change (%)
                </label>
                <Input
                  id="change"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g., 10"
                  value={exportChangePct}
                  onChange={(e) => setExportChangePct(Number(e.target.value))}
                />
              </div>

              <Button className="w-full" onClick={onRun} disabled={isLoading}>
                {isLoading ? <Loader /> : "Run Simulation"}
              </Button>

              {anyError && (
                <div className="text-destructive text-sm mt-2">
                  {String(simError || countriesError || commoditiesError)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Impact</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-10">
                  <Loader />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => v.toLocaleString()} />
                    <Tooltip formatter={(v: number) => v.toLocaleString()} />
                    <Legend />
                    <Bar dataKey="export" fill="#8884d8" name="Total Exports" />
                    <Bar dataKey="import" fill="#82ca9d" name="Total Imports" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
