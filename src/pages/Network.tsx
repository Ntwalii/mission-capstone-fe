import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Network as NetworkIcon, 
  Globe, 
  TrendingUp,
  Zap,
  Shield,
  AlertTriangle,
  Filter
} from "lucide-react";

const mockNetworkData = [
  { country: "Kenya", connections: 45, centrality: 0.89, value: "$890M", risk: "Low" },
  { country: "China", connections: 38, centrality: 0.76, value: "$654M", risk: "Medium" },
  { country: "Germany", connections: 32, centrality: 0.68, value: "$432M", risk: "Low" },
  { country: "USA", connections: 28, centrality: 0.62, value: "$380M", risk: "Low" },
  { country: "UAE", connections: 25, centrality: 0.58, value: "$290M", risk: "Medium" },
  { country: "India", connections: 22, centrality: 0.54, value: "$245M", risk: "Medium" }
];

export default function Network() {
  const [concentrationThreshold, setConcentrationThreshold] = useState([70]);
  const [selectedMetric, setSelectedMetric] = useState("centrality");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Trade Network Explorer
          </h1>
          <p className="text-muted-foreground mt-2">
            Analyze Rwanda's trade relationships and network dependencies
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button size="sm" className="bg-gradient-primary">
            Export Network
          </Button>
        </div>
      </div>

      {/* Network Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <NetworkIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Partners</p>
                <p className="text-2xl font-bold">127</p>
                <p className="text-xs text-success">+8 this year</p>
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
                <p className="text-sm text-muted-foreground">Network Density</p>
                <p className="text-2xl font-bold">0.73</p>
                <p className="text-xs text-success">Well Connected</p>
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
                <p className="text-sm text-muted-foreground">Diversification</p>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-xs text-warning">Moderate Risk</p>
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
                <p className="text-sm text-muted-foreground">Critical Nodes</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-destructive">High Impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visualization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="visualization">Network Map</TabsTrigger>
          <TabsTrigger value="analysis">Network Analysis</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Network Visualization */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Trade Network Graph
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <NetworkIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Interactive network visualization would be rendered here
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing connections between Rwanda and trading partners
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Network Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Metric Display</label>
                  <div className="space-y-2">
                    {["centrality", "value", "connections"].map((metric) => (
                      <div key={metric} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={metric}
                          name="metric"
                          checked={selectedMetric === metric}
                          onChange={() => setSelectedMetric(metric)}
                          className="w-4 h-4"
                        />
                        <label htmlFor={metric} className="text-sm capitalize">
                          {metric}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Concentration Threshold: {concentrationThreshold[0]}%
                  </label>
                  <Slider
                    value={concentrationThreshold}
                    onValueChange={setConcentrationThreshold}
                    max={100}
                    min={0}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Legend</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span className="text-xs">Low Risk Partner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <span className="text-xs">Medium Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span className="text-xs">High Risk</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Trading Partners Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNetworkData.map((partner) => (
                  <div key={partner.country} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {partner.country === "Kenya" && "🇰🇪"}
                        {partner.country === "China" && "🇨🇳"}
                        {partner.country === "Germany" && "🇩🇪"}
                        {partner.country === "USA" && "🇺🇸"}
                        {partner.country === "UAE" && "🇦🇪"}
                        {partner.country === "India" && "🇮🇳"}
                      </div>
                      <div>
                        <p className="font-semibold">{partner.country}</p>
                        <p className="text-sm text-muted-foreground">
                          {partner.connections} connections
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{partner.value}</p>
                        <p className="text-sm text-muted-foreground">
                          Centrality: {partner.centrality}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          partner.risk === "Low" ? "default" : 
                          partner.risk === "Medium" ? "secondary" : "destructive"
                        }
                      >
                        {partner.risk} Risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20">
                    <div className="text-center">
                      <p className="font-semibold">Partner Disruption</p>
                      <p className="text-xs text-muted-foreground">Test impact of losing key partner</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20">
                    <div className="text-center">
                      <p className="font-semibold">New Market Entry</p>
                      <p className="text-xs text-muted-foreground">Simulate new trade relationships</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20">
                    <div className="text-center">
                      <p className="font-semibold">Tariff Changes</p>
                      <p className="text-xs text-muted-foreground">Model policy impacts</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-20">
                    <div className="text-center">
                      <p className="font-semibold">Regional Shifts</p>
                      <p className="text-xs text-muted-foreground">AfCFTA impact analysis</p>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}