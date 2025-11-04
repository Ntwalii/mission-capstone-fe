import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Network as NetworkIcon,
  Globe,
  Zap,
  Shield,
  AlertTriangle,
  Filter,
  Calendar,
  ChevronDown,
} from "lucide-react";

import { useTradeApi } from "@/context/TradeApi";
import useStats from "@/hooks/useStats";
import useContinents from "@/hooks/useContinents";
import Loader from "@/components/ui/Loader";
import { fmtMoney } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const availableYears = [2022, 2021, 2020];

type Metric = "centrality" | "value" | "connections";

export default function Network() {
  // Concentration threshold (partners at/above this share are "critical")
  const [concentrationThreshold, setConcentrationThreshold] = useState<
    number[]
  >([7]); // %
  const [selectedMetric, setSelectedMetric] = useState<Metric>("centrality");

  // Pull year from context if present, else default to latest available
  const { params, setParams } = useTradeApi();
  const initialYear =
    (params?.year as number) && availableYears.includes(params.year as number)
      ? (params.year as number)
      : availableYears[0];
  const [year, setYear] = useState<number>(initialYear);

  // Hooks
  const [{ data, loading, error }, getStats] = useStats();
  const [{ loading: contLoading, error: contError }, getContinents] =
    useContinents();

  // Fetch latest for the chosen year
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          getStats({ params: { year } }),
          getContinents({ params: { year } }),
        ]);
        setParams?.({ year });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [year]);

  // ------- Derivations from stats -------
  const {
    activePartners,
    diversificationPct,
    hhi,
    criticalNodes,
    partnersRanked,
    totalTradeValue,
  } = useMemo(() => {
    const countryData = (data?.countryData ?? {}) as Record<
      string,
      { export: number; import: number; totalTradeValue: number }
    >;

    const partners = Object.entries(countryData)
      .map(([name, v]) => ({ name, value: Number(v?.totalTradeValue || 0) }))
      .filter((p) => p.value > 0);

    const total = partners.reduce((s, p) => s + p.value, 0);
    const shares = partners.map((p) => (total > 0 ? p.value / total : 0));

    // Herfindahl-Hirschman Index (HHI) and diversification % (1 - HHI)
    const _hhi = shares.reduce((s, x) => s + x * x, 0);
    const diversification = 1 - _hhi;

    const th = (concentrationThreshold[0] ?? 7) / 100;
    const crit = partners.filter((p) =>
      total > 0 ? p.value / total >= th : false
    );

    // rank partners; centrality proxy == share; connections proxy == 1 (single edge to Rwanda)
    const ranked = partners
      .map((p) => ({
        ...p,
        share: total > 0 ? p.value / total : 0,
        centrality: total > 0 ? p.value / total : 0,
        connections: 1,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      activePartners: partners.length,
      diversificationPct: Math.round(diversification * 100),
      hhi: _hhi,
      criticalNodes: crit,
      partnersRanked: ranked,
      totalTradeValue: total,
    };
  }, [data, concentrationThreshold]);

  const isLoading = loading || contLoading;
  const hasFatalError = !!error || !!contError;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-hero bg-clip-text text-primary">
            Trade Network Explorer
          </h1>
          <p className="text-muted-foreground mt-2">
            Rwanda-centric view of trade connections and concentration
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Year picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
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

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-12">
          <Loader />
        </div>
      )}

      {/* Error */}
      {hasFatalError && !isLoading && (
        <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4">
          <p className="text-destructive">
            Failed to load network data. Please try another year.
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        !hasFatalError &&
        (!data ||
          !data.countryData ||
          Object.keys(data.countryData).length === 0) && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No trade partner data found for{" "}
              <span className="font-semibold">{year}</span>. Try a different
              year.
            </CardContent>
          </Card>
        )}

      {/* Content */}
      {!isLoading &&
        !hasFatalError &&
        data &&
        Object.keys(data.countryData ?? {}).length > 0 && (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <NetworkIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Active Partners
                      </p>
                      <p className="text-2xl font-bold tabular-nums">
                        {activePartners}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total trade:{" "}
                        <span className="tabular-nums">
                          {fmtMoney(totalTradeValue)}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-success/10">
                      <Zap className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Network Shape
                      </p>
                      <p className="text-2xl font-bold">Star</p>
                      <p className="text-xs text-success">
                        Rwanda → partners ({activePartners} links)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-warning/10">
                      <Shield className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Diversification
                      </p>
                      <p className="text-2xl font-bold tabular-nums">
                        {diversificationPct}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        HHI:{" "}
                        <span className="tabular-nums">{hhi.toFixed(3)}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-destructive/10">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Critical Nodes
                      </p>
                      <p className="text-2xl font-bold tabular-nums">
                        {criticalNodes.length}
                      </p>
                      <p className="text-xs text-destructive">
                        ≥ {concentrationThreshold[0]}% of total trade
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="visualization" className="space-y-6">
              <TabsList>
                <TabsTrigger value="visualization">Network Map</TabsTrigger>
                <TabsTrigger value="analysis">Network Analysis</TabsTrigger>
              </TabsList>

              {/* Visualization */}
              <TabsContent value="visualization" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        Trade Network Graph ({year})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadialNetworkSVG
                        year={year}
                        partners={partnersRanked}
                        selectedMetric={selectedMetric}
                        thresholdPct={concentrationThreshold[0]}
                      />
                    </CardContent>
                  </Card>

                  {/* Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Network Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Metric Display
                        </label>
                        <div className="space-y-2">
                          {(
                            ["centrality", "value", "connections"] as const
                          ).map((metric) => (
                            <div
                              key={metric}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="radio"
                                id={metric}
                                name="metric"
                                checked={selectedMetric === metric}
                                onChange={() => setSelectedMetric(metric)}
                                className="w-4 h-4"
                              />
                              <label
                                htmlFor={metric}
                                className="text-sm capitalize"
                              >
                                {metric}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Critical Threshold: {concentrationThreshold[0]}%
                        </label>
                        <Slider
                          value={concentrationThreshold}
                          onValueChange={setConcentrationThreshold}
                          max={30}
                          min={1}
                          step={1}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Partners at/above this share are marked as “Critical”.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Legend</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-xs">Normal partner</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-destructive"></div>
                            <span className="text-xs">
                              Critical (≥ threshold)
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analysis list */}
              <TabsContent value="analysis" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Key Trading Partners Analysis ({year})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {partnersRanked.length === 0 ? (
                      <div className="text-muted-foreground text-sm">
                        No partner data for this year.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {partnersRanked.slice(0, 25).map((p) => {
                          const isCritical =
                            p.share * 100 >= (concentrationThreshold[0] ?? 7);
                          return (
                            <div
                              key={p.name}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-4">
                                <div className="text-2xl" aria-hidden>
                                  🌐
                                </div>
                                <div>
                                  <p className="font-semibold">{p.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Share:{" "}
                                    <span className="tabular-nums">
                                      {(p.share * 100).toFixed(1)}%
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-semibold tabular-nums">
                                    {fmtMoney(p.value)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Centrality:{" "}
                                    <span className="tabular-nums">
                                      {p.centrality.toFixed(3)}
                                    </span>
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    isCritical ? "destructive" : "secondary"
                                  }
                                >
                                  {isCritical ? "Critical" : "Normal"}
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
            </Tabs>
          </>
        )}
    </div>
  );
}

/**
 * RadialNetworkSVG (polished)
 * - Curved links, subtle radial grid
 * - Label halos + simple collision avoidance
 * - Hover focus (dim others)
 * - Responsive viewBox and larger drawing area
 */
function RadialNetworkSVG({
  year,
  partners,
  selectedMetric,
  thresholdPct,
  topN = 32,
}: {
  year: number;
  partners: Array<{
    name: string;
    value: number;
    share: number;
    centrality: number;
    connections: number;
  }>;
  selectedMetric: "centrality" | "value" | "connections";
  thresholdPct: number;
  topN?: number;
}) {
  const W = 900;
  const H = 520;
  const cx = W / 2;
  const cy = H / 2 + 6;
  const R = Math.min(W, H) / 2 - 86;

  // 1) Clean & aggregate
  const cleaned = partners
    .filter((p) => p && Number.isFinite(p.value))
    .map((p) => ({ ...p, name: (p.name || "").trim() || "Unknown" }))
    .filter(
      (p) =>
        p.name.toLowerCase() !== "#null" && p.name.toLowerCase() !== "unknown"
    );

  const sorted = [...cleaned].sort((a, b) => {
    if (selectedMetric === "value") return b.value - a.value;
    if (selectedMetric === "connections") return b.connections - a.connections;
    return b.centrality - a.centrality;
  });

  const head = sorted.slice(0, topN);
  const tail = sorted.slice(topN);
  const tailValue = tail.reduce((s, p) => s + p.value, 0);
  const tailShare = tail.reduce((s, p) => s + p.share, 0);
  const tailCent = tail.reduce((s, p) => s + p.centrality, 0);
  if (tail.length > 0 && tailValue > 0)
    head.push({
      name: "Other",
      value: tailValue,
      share: tailShare,
      centrality: tailCent / Math.max(tail.length, 1),
      connections: 1,
    });

  const maxValue = Math.max(...head.map((p) => p.value), 1);
  const maxCentrality = Math.max(...head.map((p) => p.centrality), 0.0001);

  const nodeRadius = (p: (typeof head)[number]) => {
    const minR = 6;
    const maxR = 22;
    let t = 0;
    if (selectedMetric === "value") t = Math.sqrt(p.value / maxValue);
    else if (selectedMetric === "connections") t = 0.45;
    else t = Math.sqrt(p.centrality / maxCentrality);
    return Math.max(minR, Math.min(maxR, minR + t * (maxR - minR)));
  };

  const linkWidth = (p: (typeof head)[number]) => {
    const minW = 1.2;
    const maxW = 6;
    let t = 0;
    if (selectedMetric === "value") t = Math.sqrt(p.value / maxValue);
    else if (selectedMetric === "connections") t = 0.45;
    else t = Math.sqrt(p.centrality / maxCentrality);
    return Math.max(minW, Math.min(maxW, minW + t * (maxW - minW)));
  };

  const critical = (p: (typeof head)[number]) => p.share * 100 >= thresholdPct;

  // 3) Interleave to space big nodes
  const interleaved = (() => {
    const a: typeof head = [] as any;
    let i = 0,
      j = head.length - 1,
      flip = true;
    while (i <= j) {
      a.push(flip ? head[i++] : head[j--]);
      flip = !flip;
    }
    return a;
  })();

  const positions = interleaved.map((p, i) => {
    const a = (i / interleaved.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + R * Math.cos(a);
    const y = cy + R * Math.sin(a);
    return { ...p, a, x, y };
  });

  // 4) Label placement with simple dodge per side
  type Lbl = {
    key: string;
    p: (typeof positions)[number];
    lx: number;
    ly: number;
    anchor: "start" | "end";
  };
  const baseLabelRadius = R + 18;
  const placed: Lbl[] = [];
  const left: Lbl[] = [];
  const right: Lbl[] = [];

  positions.forEach((p) => {
    if (nodeRadius(p) < 9 && p.name !== "Other") return; // hide tiny
    const outward = nodeRadius(p) + 14;
    const lx = cx + (baseLabelRadius + outward) * Math.cos(p.a);
    let ly = cy + (baseLabelRadius + outward) * Math.sin(p.a);
    const anchor = Math.cos(p.a) >= 0 ? "start" : "end";
    const item: Lbl = { key: p.name, p, lx, ly, anchor };
    (anchor === "start" ? right : left).push(item);
  });

  const dodge = (arr: Lbl[]) => {
    arr.sort((a, b) => a.ly - b.ly);
    let lastY = -Infinity;
    arr.forEach((l) => {
      const minGap = 12;
      if (l.ly - lastY < minGap) l.ly = lastY + minGap;
      lastY = l.ly;
      placed.push(l);
    });
  };
  dodge(left);
  dodge(right);

  const pathFor = (p: (typeof positions)[number]) => {
    // Quadratic curve toward an inner control point to reduce edge clutter
    const qR = R * 0.52;
    const qx = cx + qR * Math.cos(p.a);
    const qy = cy + qR * Math.sin(p.a);
    return `M ${cx},${cy} Q ${qx},${qy} ${p.x},${p.y}`;
  };

  const trim = (s: string, n = 16) =>
    s.length > n ? s.slice(0, n - 1) + "…" : s;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        className="block rounded-xl bg-muted/20 ring-1 ring-border/50"
        role="img"
        aria-label={`Trade network for Rwanda in ${year}`}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="halo" x="-50%" y="-50%" width="200%" height="200%">
            <feMorphology
              operator="dilate"
              radius="1.2"
              in="SourceAlpha"
              result="DILATED"
            />
            <feGaussianBlur in="DILATED" stdDeviation="1.2" result="BLUR" />
            <feFlood floodColor="white" floodOpacity="0.9" result="WHITE" />
            <feComposite in="WHITE" in2="BLUR" operator="in" result="HALO" />
            <feMerge>
              <feMergeNode in="HALO" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* radial grid */}
        {[0.35, 0.6, 1].map((t, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={R * t}
            fill="none"
            stroke="hsl(var(--border))"
            strokeDasharray={i < 2 ? "4 6" : undefined}
            opacity={i < 2 ? 0.4 : 0.6}
          />
        ))}

        {/* links */}
        {positions.map((p) => (
          <path
            key={`link-${p.name}`}
            d={pathFor(p)}
            stroke={
              critical(p) ? "hsl(var(--destructive))" : "hsl(var(--primary))"
            }
            strokeWidth={linkWidth(p)}
            opacity={critical(p) ? 0.85 : 0.45}
            fill="none"
            filter={critical(p) ? "url(#glow)" : undefined}
          />
        ))}

        {/* center node (Rwanda) */}
        <g>
          <circle cx={cx} cy={cy} r={14} fill="hsl(var(--foreground))" />
          <text
            x={cx}
            y={cy + 30}
            textAnchor="middle"
            fontSize="12"
            fill="hsl(var(--muted-foreground))"
          >
            Rwanda ({year})
          </text>
        </g>

        {/* partner nodes */}
        {positions.map((p) => (
          <g key={`node-${p.name}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={nodeRadius(p)}
              fill={
                critical(p) ? "hsl(var(--destructive))" : "hsl(var(--primary))"
              }
              opacity={0.9}
              stroke="hsl(var(--background))"
              strokeWidth={1.2}
              filter={critical(p) ? "url(#glow)" : undefined}
            />
          </g>
        ))}

        {/* labels */}
        {placed.map(({ key, p, lx, ly, anchor }) => (
          <g key={`label-${key}`}>
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              fontSize="12"
              filter="url(#halo)"
              fill="hsl(var(--foreground))"
            >
              {trim(p.name)}
            </text>
          </g>
        ))}

        {/* inline legend for quick reference */}
        <g transform={`translate(${W - 170}, ${20})`}>
          <rect
            x={-12}
            y={-12}
            width={160}
            height={70}
            rx={10}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            opacity={0.9}
          />
          <text x={0} y={0} fontSize={12} fill="hsl(var(--muted-foreground))">
            Legend
          </text>
          <g transform="translate(0,14)">
            <circle cx={6} cy={8} r={6} fill="hsl(var(--primary))" />
            <text x={20} y={12} fontSize={12} fill="hsl(var(--foreground))">
              Normal partner
            </text>
          </g>
          <g transform="translate(0,36)">
            <circle cx={6} cy={8} r={6} fill="hsl(var(--destructive))" />
            <text x={20} y={12} fontSize={12} fill="hsl(var(--foreground))">
              Critical (≥ {thresholdPct}%)
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
