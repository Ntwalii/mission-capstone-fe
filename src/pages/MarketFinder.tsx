import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  TrendingUp,
  Globe,
  DollarSign,
  Filter,
  ChevronDown,
  Calendar,
  Package,
} from "lucide-react";

import useCommodities from "@/hooks/useCommodities";
import useMarkets from "@/hooks/useMarkets";
import useTopCommodities from "@/hooks/useTopCommodities";
import { fmtMoney } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const availableYears = [2022, 2021, 2020];

type Commodity = { id: number; code: string; name: string };

export default function MarketFinder() {
  const [year, setYear] = useState<number>(2022);

  // Free text search
  const [searchQuery, setSearchQuery] = useState("");

  // Commodity search + selection
  const [commodityQuery, setCommodityQuery] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(
    null
  );

  // Hooks
  const [{ data: commodityRows, loading: commoditiesLoading }, getCommodities] =
    useCommodities();

  const [
    { data: markets, loading: marketsLoading, error: marketsError },
    getMarkets,
  ] = useMarkets();

  const [
    { data: topCommodities, loading: topLoading, error: topError },
    getTopCommodities,
  ] = useTopCommodities();

  // Auto-fetch best performing countries for the year (no commodity filter)
  useEffect(() => {
    getMarkets({ params: { year, limit: 10 } });
    // also refresh top5 products for this year
    getTopCommodities({ params: { year, limit: 5 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  // Fetch commodity suggestions when the user types
  useEffect(() => {
    const q = commodityQuery.trim();
    if (!q) return;
    getCommodities({ params: { q, limit: 12 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commodityQuery]);

  const handleFindMarkets = async () => {
    const params: Record<string, any> = {
      year,
      limit: selectedCommodity ? 5 : 10,
    };

    if (selectedCommodity?.id) {
      params.commodityId = selectedCommodity.id;
    } else if (searchQuery.trim()) {
      params.q = searchQuery.trim();
      params.limit = 10;
    }

    await getMarkets({ params });
  };

  const commoditySuggestions = useMemo(() => {
    if (!commodityRows) return [];
    return commodityRows.filter((c) => c.id !== selectedCommodity?.id);
  }, [commodityRows, selectedCommodity]);

  // Normalize top commodities to id/name/code we can use
  const normalizedTop = useMemo(() => {
    const list = (topCommodities ?? []).slice(0, 5);
    return list.map((p: any) => {
      const id = Number(p.commodityId ?? p.id);
      const name = String(p.productName ?? p.name ?? p.code ?? "Unknown");
      const code = String(p.code ?? p.id ?? "");
      return { id, name, code };
    });
  }, [topCommodities]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-hero bg-clip-text text-primary">
            Market Finder
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover high-potential export markets for your products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={marketsLoading}>
                <Calendar className="h-4 w-4 mr-2" />
                {year}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableYears.map((y) => (
                <DropdownMenuItem
                  key={y}
                  onClick={() => setYear(y)}
                  className={year === y ? "bg-accent" : ""}
                >
                  {y}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Free text product search */}
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by product (e.g., coffee, tea, textiles...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Commodity picker (by ID, optional) */}
            <div className="space-y-2">
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={
                    selectedCommodity
                      ? `Selected: ${selectedCommodity.name} (${selectedCommodity.code})`
                      : "Type to search commodity (optional)"
                  }
                  value={commodityQuery}
                  onChange={(e) => {
                    setCommodityQuery(e.target.value);
                    setSelectedCommodity(null);
                  }}
                  className={`pl-10 ${
                    selectedCommodity ? "text-primary font-medium" : ""
                  }`}
                />
              </div>

              {/* Suggestions dropdown */}
              {commodityQuery.trim() && !selectedCommodity && (
                <div className="rounded-md border bg-background max-h-64 overflow-auto">
                  {commoditiesLoading && (
                    <div className="p-2 text-sm text-muted-foreground">
                      Searching…
                    </div>
                  )}
                  {!commoditiesLoading && commoditySuggestions.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground">
                      No matches
                    </div>
                  )}
                  {!commoditiesLoading &&
                    commoditySuggestions.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-accent"
                        onClick={() => {
                          setSelectedCommodity(c);
                          setCommodityQuery(`${c.name} (${c.code})`);
                        }}
                      >
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Code: {c.code} · ID: {c.id}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              size="sm"
              className="bg-primary"
              onClick={handleFindMarkets}
            >
              Find Markets
            </Button>
            {selectedCommodity && (
              <Badge
                variant="secondary"
                className="ml-2 cursor-pointer"
                onClick={() => {
                  setSelectedCommodity(null);
                  setCommodityQuery("");
                }}
              >
                Clear commodity
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top 5 performing products (from API) */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Top products in {year}:</p>
        <div className="flex flex-wrap gap-2">
          {topLoading && (
            <Badge variant="outline" className="text-xs">
              Loading…
            </Badge>
          )}
          {!topLoading && topError && (
            <Badge variant="destructive" className="text-xs">
              Failed to load products
            </Badge>
          )}
          {!topLoading && !topError && normalizedTop.length === 0 && (
            <Badge variant="outline" className="text-xs">
              No top products found
            </Badge>
          )}
          {!topLoading &&
            !topError &&
            normalizedTop.map((c) => (
              <Badge
                key={c.id}
                variant={
                  selectedCommodity?.id === c.id ? "default" : "secondary"
                }
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => {
                  setSelectedCommodity(c);
                  setCommodityQuery(`${c.name} (${c.code})`);
                }}
              >
                {c.name}
              </Badge>
            ))}
        </div>
      </div>

      {/* Results */}
      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="opportunities">Market Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          {/* Loading */}
          {marketsLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Error */}
          {!marketsLoading && marketsError && (
            <Card>
              <CardContent className="py-10 text-center text-destructive">
                Failed to load opportunities. Please try again.
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!marketsLoading &&
            !marketsError &&
            (!markets || markets.length === 0) && (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  {selectedCommodity || searchQuery.trim()
                    ? "No matching markets. Try a different product or clear the search."
                    : "No results yet for this year. Click “Find Markets” or select a top product above."}
                </CardContent>
              </Card>
            )}

          {/* Results List */}
          {!marketsLoading &&
            !marketsError &&
            markets &&
            markets.length > 0 &&
            markets.map((m: any, idx: number) => {
              const country = m.partnerName ?? `#${m.partnerId}`;
              const productHint = m.productName; // only present when querying “best overall” (no commodity selected)
              const growthLabel =
                m.growthPct == null
                  ? "—"
                  : `${m.growthPct > 0 ? "+" : ""}${m.growthPct}%`;

              return (
                <Card
                  key={`${m.partnerId ?? idx}-${m.iso3 ?? "NA"}`}
                  className="hover:shadow-medium transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {country}
                            {m.iso3 && (
                              <Badge variant="outline" className="uppercase">
                                {m.iso3}
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm">
                            {selectedCommodity
                              ? `Market for ${selectedCommodity.name}`
                              : productHint
                              ? `Best performing product: ${productHint}`
                              : "Top opportunity market"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Demand Growth (YoY)
                        </p>
                        <p
                          className={`font-semibold flex items-center gap-1 ${
                            m.growthPct != null && m.growthPct >= 0
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        >
                          <TrendingUp className="h-4 w-4" />
                          {growthLabel}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Market Size
                        </p>
                        <p className="font-semibold flex items-center gap-1 tabular-nums">
                          <DollarSign className="h-4 w-4" />
                          {fmtMoney(m.marketSize ?? 0)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Opportunity
                        </p>
                        <Badge
                          className="font-semibold"
                          variant={
                            m.growthPct != null && m.growthPct >= 10
                              ? "default"
                              : "secondary"
                          }
                        >
                          {m.growthPct != null && m.growthPct >= 10
                            ? "High"
                            : m.growthPct != null && m.growthPct >= 0
                            ? "Growing"
                            : "Neutral"}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p className="font-semibold">{year}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
