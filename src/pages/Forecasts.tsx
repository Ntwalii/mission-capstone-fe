// src/pages/Forecast.tsx
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, TrendingUp, Target, Loader2 } from "lucide-react";

/* -------------------------------------------------
   1. API URL – set in .env.local
   ------------------------------------------------- */
// VITE_MODEL_SERVICE_URL=http://localhost:1738
const API = import.meta.env.VITE_MODEL_SERVICE_URL || "http://localhost:1738";

/* -------------------------------------------------
   2. Types
   ------------------------------------------------- */
interface AgriProduct {
  product_code: string;
  current_value_usd: number;
  growth_pct: number;
}
interface Market {
  partner_iso3: string;
  current_value_usd: number;
  growth_pct: number | null;
}
interface Commodity {
  id: number;
  code: string;
  name: string;
}
interface Partner {
  id: number;
  name: string;
  iso3: string;
}
interface Prediction {
  product_code: string;
  partner_iso3: string;
  year: number;
  predicted_value_usd: number;
  current_value_usd: number;
  growth_pct: number;
}
interface Forecast {
  product_code: string;
  partner_iso3: string;
  year: number;
  predicted_value_usd: number;
  growth_from_2022: number;
}
interface Insight {
  insight: string;
  confidence: number;
  category: string;
}

/* -------------------------------------------------
   3. Component
   ------------------------------------------------- */
export default function Forecast() {
  /* ---------- State ---------- */
  const [topProducts, setTopProducts] = useState<AgriProduct[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [insights, setInsights] = useState<Insight | null>(null);

  const [selectedProductCode, setSelectedProductCode] = useState<string>("");
  const [selectedPartnerIso3, setSelectedPartnerIso3] = useState<string>("");
  const [targetYear, setTargetYear] = useState(2025);

  // NEW: horizon for Top Markets
  const [marketHorizon, setMarketHorizon] = useState<number>(1);

  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);

  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- Helpers ---------- */
  const formatMoney = (v: number) => `$${Math.round(v / 1e6)}M`;
  const fmtPct = (v: number) => `${(Math.round(v * 10) / 10).toFixed(1)}%`;

  const selectedProduct = useMemo(() => {
    return commodities.find((c) => c.code === selectedProductCode);
  }, [commodities, selectedProductCode]);

  const selectedPartner = useMemo(() => {
    return partners.find((p) => p.iso3 === selectedPartnerIso3);
  }, [partners, selectedPartnerIso3]);

  // Only growing markets
  const growingMarkets = useMemo(
    () =>
      markets.filter(
        (m) => typeof m.growth_pct === "number" && (m.growth_pct as number) > 0
      ),
    [markets]
  );

  /* ---------- API Calls ---------- */
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, mkts, coms, parts, ins] = await Promise.all([
        fetch(`${API}/agri-products`).then((r) => (r.ok ? r.json() : [])),
        // pass horizon to BE (safe even if BE ignores it)
        fetch(`${API}/markets?horizon=${marketHorizon}`).then((r) =>
          r.ok ? r.json() : []
        ),
        fetch(`${API}/commodities?limit=100`).then((r) =>
          r.ok ? r.json() : []
        ),
        fetch(`${API}/partners?withData=true&year=2022`).then((r) =>
          r.ok ? r.json() : []
        ),
        fetch(`${API}/model/insights`)
          .then((r) => (r.ok ? r.json() : []))
          .then((arr) => arr[0] ?? null),
      ]);

      setTopProducts(prods);
      setMarkets(mkts);
      setCommodities(coms);
      setPartners(parts);
      setInsights(ins);

      if (prods.length) setSelectedProductCode(prods[0].product_code);
      if (parts.length) setSelectedPartnerIso3(parts[0].iso3);
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const doPredict = async () => {
    if (!selectedProductCode || !selectedPartnerIso3) return;
    setPredicting(true);
    setError(null);
    setPrediction(null);
    setForecasts([]);

    try {
      // Single-year prediction
      const predRes = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          {
            product_code: selectedProductCode,
            partner_iso3: selectedPartnerIso3,
            year: targetYear,
          },
        ]),
      });
      if (!predRes.ok) throw new Error("Prediction failed");
      const predData = ((await predRes.json()) as Prediction[])[0];
      setPrediction(predData);

      // Multi-year forecast
      const fcRes = await fetch(`${API}/forecast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_code: selectedProductCode,
          partner_iso3: selectedPartnerIso3,
          years: [targetYear + 1, targetYear + 2],
        }),
      });
      if (!fcRes.ok) throw new Error("Forecast failed");
      const fcData = (await fcRes.json()) as Forecast[];
      setForecasts(fcData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPredicting(false);
    }
  };

  /* ---------- Effects ---------- */
  useEffect(() => {
    fetchData();
  }, [marketHorizon]); // re-fetch when horizon changes

  /* -------------------------------------------------
     4. Render
     ------------------------------------------------- */
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Agriculture Trade Forecasts
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time ML predictions from live trade data
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Quick Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                  <div className="h-8 bg-muted rounded w-16 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Agri Growth</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {insights?.insight.includes("growth")
                      ? insights.insight.match(/\+([\d.]+)%/)?.[1] + "%"
                      : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">Next year</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Model Confidence
                  </p>
                  <p className="text-2xl font-bold">
                    {insights?.confidence
                      ? `${Math.round(insights.confidence * 100)}%`
                      : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {insights?.category ?? "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="products" className="mt-8">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="markets">Top Markets</TabsTrigger>
          <TabsTrigger value="custom">Predict</TabsTrigger>
        </TabsList>

        {/* Top Products */}
        <TabsContent value="products" className="mt-6">
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          ) : topProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No products found
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {topProducts.map((p) => (
                <Card key={p.product_code}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {commodities.find((c) => c.code === p.product_code)
                          ?.name || `Product ${p.product_code}`}
                      </CardTitle>
                      <Badge
                        variant={p.growth_pct > 0 ? "default" : "destructive"}
                      >
                        {p.growth_pct > 0 ? "+" : ""}
                        {p.growth_pct}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 text-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Current
                        </p>
                        <p className="font-semibold">
                          {formatMoney(p.current_value_usd)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">1Y</p>
                        <p className="font-semibold text-blue-600">
                          {formatMoney(p.current_value_usd * 1.12)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">2Y</p>
                        <p className="font-semibold text-purple-600">
                          {formatMoney(p.current_value_usd * 1.24)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Top Markets */}
        <TabsContent value="markets" className="mt-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle>Top Export Markets</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Horizon</span>
                <Select
                  value={String(marketHorizon)}
                  onValueChange={(v) => setMarketHorizon(Number(v))}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1Y</SelectItem>
                    <SelectItem value="2">2Y</SelectItem>
                    <SelectItem value="3">3Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              ) : growingMarkets.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No growing markets for this horizon
                </p>
              ) : (
                <div className="space-y-3">
                  {growingMarkets.map((m) => {
                    const partner = partners.find(
                      (p) => p.iso3 === m.partner_iso3
                    );
                    return (
                      <div
                        key={m.partner_iso3}
                        className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="font-bold text-blue-600">
                              {m.partner_iso3}
                            </span>
                          </div>
                          <span className="font-medium">
                            {partner?.name || m.partner_iso3}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-lg">
                            {formatMoney(m.current_value_usd)}
                          </span>
                          <Badge variant="default">
                            +{fmtPct(m.growth_pct!)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Prediction */}
        <TabsContent value="custom" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Trade Prediction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Commodity
                  </label>
                  <Select
                    value={selectedProductCode}
                    onValueChange={setSelectedProductCode}
                    disabled={commodities.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Search commodity..." />
                    </SelectTrigger>
                    <SelectContent>
                      {commodities.map((c) => (
                        <SelectItem key={c.id} value={c.code}>
                          {c.name} ({c.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Buyer Country
                  </label>
                  <Select
                    value={selectedPartnerIso3}
                    onValueChange={setSelectedPartnerIso3}
                    disabled={partners.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {partners.map((p) => (
                        <SelectItem key={p.id} value={p.iso3}>
                          {p.name} ({p.iso3})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Target Year
                  </label>
                  <Select
                    value={targetYear.toString()}
                    onValueChange={(v) => setTargetYear(+v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={doPredict}
                disabled={
                  !selectedProductCode || !selectedPartnerIso3 || predicting
                }
                className="w-full"
              >
                {predicting ? <>Predicting...</> : "Generate Prediction"}
              </Button>

              {prediction && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Prediction Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Product → Destination
                      </p>
                      <p className="font-medium">
                        {selectedProduct?.name} → {selectedPartner?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Target Year
                      </p>
                      <p className="font-medium">{prediction.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Current (2022)
                      </p>
                      <p className="font-bold text-lg">
                        {formatMoney(prediction.current_value_usd)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Predicted</p>
                      <p className="font-bold text-lg text-blue-600">
                        {formatMoney(prediction.predicted_value_usd)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Growth</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-bold text-2xl text-green-600">
                          {prediction.growth_pct > 0 ? "+" : ""}
                          {prediction.growth_pct}%
                        </p>
                        <Badge
                          variant={
                            prediction.growth_pct > 0
                              ? "default"
                              : "destructive"
                          }
                        >
                          {prediction.growth_pct > 0 ? "Growing" : "Declining"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {forecasts.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      {forecasts.map((f) => (
                        <div
                          key={f.year}
                          className="bg-white p-4 rounded-lg border"
                        >
                          <p className="text-xs text-muted-foreground">
                            {f.year} Forecast
                          </p>
                          <p className="font-bold text-purple-600">
                            {formatMoney(f.predicted_value_usd)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!prediction && !predicting && (
                <div className="bg-muted/50 border border-dashed rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">
                    Select a commodity and country to generate a forecast.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
