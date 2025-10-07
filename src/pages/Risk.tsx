import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Shield,
  TrendingDown,
  Globe,
  Package,
  Building2,
  Zap,
  Download,
  Eye
} from "lucide-react";

const riskMetrics = [
  {
    category: "Geographic Concentration",
    score: 68,
    level: "Medium",
    description: "Trade concentrated in 3 key regions",
    trend: "stable"
  },
  {
    category: "Product Dependency",
    score: 45,
    level: "Low",
    description: "Well diversified product portfolio",
    trend: "improving"
  },
  {
    category: "Partner Concentration", 
    score: 72,
    level: "High",
    description: "Heavy reliance on top 5 partners",
    trend: "worsening"
  },
  {
    category: "Currency Exposure",
    score: 55,
    level: "Medium",
    description: "USD dominance creates volatility",
    trend: "stable"
  }
];

const topRisks = [
  {
    risk: "China Trade Dependency",
    impact: "High",
    probability: "Medium",
    description: "28% of imports from single source",
    mitigation: "Diversify supplier base to India, Vietnam"
  },
  {
    risk: "Coffee Price Volatility",
    impact: "High", 
    probability: "High",
    description: "Weather and global demand fluctuations",
    mitigation: "Futures contracts and premium positioning"
  },
  {
    risk: "Transport Route Disruption",
    impact: "Medium",
    probability: "Low",
    description: "Single port dependency in Mombasa",
    mitigation: "Develop alternative logistics routes"
  },
  {
    risk: "EU Regulatory Changes",
    impact: "Medium",
    probability: "Medium", 
    description: "New sustainability requirements",
    mitigation: "Compliance preparation and certification"
  }
];

export default function Risk() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6m");

  const getRiskColor = (level: string) => {
    switch(level.toLowerCase()) {
      case "low": return "text-success";
      case "medium": return "text-warning";
      case "high": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch(level.toLowerCase()) {
      case "low": return "default";
      case "medium": return "secondary";
      case "high": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Risk Analysis
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and mitigate trade dependencies and vulnerabilities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Risk Monitor
          </Button>
          <Button size="sm" className="bg-gradient-primary">
            <Download className="h-4 w-4 mr-2" />
            Risk Report
          </Button>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Risk</p>
                <p className="text-2xl font-bold text-warning">Medium</p>
                <p className="text-xs text-muted-foreground">Score: 62/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <TrendingDown className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-destructive">2 Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mitigations</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-success">4 Implemented</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Trend</p>
                <p className="text-2xl font-bold text-warning">Stable</p>
                <p className="text-xs text-muted-foreground">vs last quarter</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Risk Dashboard</TabsTrigger>
          <TabsTrigger value="concentration">Concentration Analysis</TabsTrigger>
          <TabsTrigger value="scenarios">Stress Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Risk Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {riskMetrics.map((metric) => (
                    <div key={metric.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{metric.category}</p>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                        </div>
                        <Badge variant={getRiskBadgeVariant(metric.level)}>
                          {metric.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={metric.score} className="flex-1" />
                        <span className="text-sm font-medium w-12">{metric.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Risks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Critical Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topRisks.slice(0, 3).map((risk, index) => (
                    <div key={risk.risk} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{risk.risk}</p>
                        <div className="flex gap-2">
                          <Badge variant={getRiskBadgeVariant(risk.impact)} className="text-xs">
                            {risk.impact}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {risk.probability}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                      <p className="text-sm font-medium">Mitigation: {risk.mitigation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Events Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2024-02-15", event: "China supplier capacity reduced", impact: "Medium", status: "Ongoing" },
                  { date: "2024-01-28", event: "New EU sustainability regulations", impact: "Low", status: "Monitored" },
                  { date: "2024-01-10", event: "Coffee futures price volatility", impact: "High", status: "Mitigated" }
                ].map((event, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="flex-1">
                      <p className="font-medium">{event.event}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge variant={getRiskBadgeVariant(event.impact)}>
                      {event.impact}
                    </Badge>
                    <Badge variant="outline">
                      {event.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concentration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Geographic Concentration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="h-4 w-4 text-primary" />
                  Geographic Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: "East Africa", share: 42, risk: "Low" },
                    { region: "Asia", share: 35, risk: "Medium" },
                    { region: "Europe", share: 18, risk: "Low" },
                    { region: "Others", share: 5, risk: "Low" }
                  ].map((region) => (
                    <div key={region.region} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{region.region}</p>
                        <p className="text-sm text-muted-foreground">{region.share}% of trade</p>
                      </div>
                      <Badge variant={getRiskBadgeVariant(region.risk)}>
                        {region.risk}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Concentration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4 text-primary" />
                  Product Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { product: "Coffee", share: 32, risk: "Medium" },
                    { product: "Tea", share: 28, risk: "Medium" },
                    { product: "Minerals", share: 25, risk: "Low" },
                    { product: "Others", share: 15, risk: "Low" }
                  ].map((product) => (
                    <div key={product.product} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.product}</p>
                        <p className="text-sm text-muted-foreground">{product.share}% of exports</p>
                      </div>
                      <Badge variant={getRiskBadgeVariant(product.risk)}>
                        {product.risk}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Partner Concentration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4 text-primary" />
                  Partner Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { partner: "Kenya", share: 28, risk: "Low" },
                    { partner: "China", share: 24, risk: "High" },
                    { partner: "Germany", share: 18, risk: "Low" },
                    { partner: "Others", share: 30, risk: "Medium" }
                  ].map((partner) => (
                    <div key={partner.partner} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{partner.partner}</p>
                        <p className="text-sm text-muted-foreground">{partner.share}% of trade</p>
                      </div>
                      <Badge variant={getRiskBadgeVariant(partner.risk)}>
                        {partner.risk}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stress Test Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Major Partner Disruption",
                    description: "China reduces imports by 50%",
                    impact: "High",
                    timeline: "Immediate"
                  },
                  {
                    title: "Global Coffee Crisis",
                    description: "Climate change affects 30% of production",
                    impact: "High",
                    timeline: "2-5 years"
                  },
                  {
                    title: "Transport Route Closure",
                    description: "Mombasa port disruption for 3 months",
                    impact: "Medium",
                    timeline: "Short-term"
                  },
                  {
                    title: "Currency Devaluation",
                    description: "RWF weakens 20% against USD",
                    impact: "Medium",
                    timeline: "6-12 months"
                  }
                ].map((scenario, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{scenario.title}</h4>
                        <Badge variant={getRiskBadgeVariant(scenario.impact)}>
                          {scenario.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Timeline: {scenario.timeline}</span>
                        <Button variant="outline" size="sm">
                          Run Test
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}