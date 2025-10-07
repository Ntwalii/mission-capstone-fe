import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Calendar,
  Target,
  AlertCircle,
  Download,
  Zap
} from "lucide-react";

const mockForecasts = [
  {
    product: "Coffee",
    currentValue: "$125M",
    forecast6m: "$142M",
    forecast12m: "$156M",
    confidence: 87,
    trend: "up",
    seasonality: "High",
    growth: "+24%"
  },
  {
    product: "Tea",
    currentValue: "$89M",
    forecast6m: "$95M",
    forecast12m: "$104M",
    confidence: 82,
    trend: "up",
    seasonality: "Medium",
    growth: "+17%"
  },
  {
    product: "Minerals",
    currentValue: "$234M",
    forecast6m: "$228M",
    forecast12m: "$215M",
    confidence: 74,
    trend: "down",
    seasonality: "Low",
    growth: "-8%"
  },
  {
    product: "Textiles",
    currentValue: "$67M",
    forecast6m: "$72M",
    forecast12m: "$81M",
    confidence: 79,
    trend: "up",
    seasonality: "High",
    growth: "+21%"
  }
];

const mockMarketForecasts = [
  {
    country: "Germany",
    flag: "🇩🇪",
    demandScore: 92,
    priceProjection: "+15%",
    marketGrowth: "+18%",
    riskLevel: "Low"
  },
  {
    country: "USA",
    flag: "🇺🇸",
    demandScore: 88,
    priceProjection: "+12%",
    marketGrowth: "+14%",
    riskLevel: "Low"
  },
  {
    country: "China",
    flag: "🇨🇳",
    demandScore: 76,
    priceProjection: "-3%",
    marketGrowth: "+8%",
    riskLevel: "Medium"
  }
];

export default function Forecasts() {
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [forecastHorizon, setForecastHorizon] = useState("12m");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Trade Forecasts
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered predictions for Rwanda's export performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={forecastHorizon} onValueChange={setForecastHorizon}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="12m">12 Months</SelectItem>
              <SelectItem value="24m">24 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="bg-gradient-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Forecasts
          </Button>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Growth</p>
                <p className="text-2xl font-bold text-success">+18.5%</p>
                <p className="text-xs text-muted-foreground">Next 12 months</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold">81%</p>
                <p className="text-xs text-muted-foreground">Prediction accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peak Season</p>
                <p className="text-2xl font-bold">Oct-Dec</p>
                <p className="text-xs text-muted-foreground">Coffee & Tea exports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Alerts</p>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Active warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Product Forecasts</TabsTrigger>
          <TabsTrigger value="markets">Market Opportunities</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockForecasts.map((forecast) => (
              <Card key={forecast.product} className="hover:shadow-medium transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {forecast.product}
                      <Badge variant={forecast.trend === "up" ? "default" : "destructive"}>
                        {forecast.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {forecast.growth}
                      </Badge>
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="font-semibold">{forecast.confidence}%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="font-semibold">{forecast.currentValue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">6M Forecast</p>
                        <p className="font-semibold">{forecast.forecast6m}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">12M Forecast</p>
                        <p className="font-semibold">{forecast.forecast12m}</p>
                      </div>
                    </div>
                    
                    <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Forecast chart for {forecast.product}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Seasonality</p>
                        <Badge variant="outline">{forecast.seasonality}</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="markets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Demand Forecasts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMarketForecasts.map((market) => (
                  <div key={market.country} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{market.flag}</span>
                      <div>
                        <p className="font-semibold">{market.country}</p>
                        <p className="text-sm text-muted-foreground">
                          Demand Score: {market.demandScore}/100
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Price Projection</p>
                        <p className={`font-semibold ${
                          market.priceProjection.startsWith('+') ? 'text-success' : 'text-destructive'
                        }`}>
                          {market.priceProjection}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Market Growth</p>
                        <p className="font-semibold text-success">{market.marketGrowth}</p>
                      </div>
                      <Badge variant={market.riskLevel === "Low" ? "default" : "secondary"}>
                        {market.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { model: "LSTM Neural Network", accuracy: "87%", products: "Coffee, Tea" },
                    { model: "ARIMA Time Series", accuracy: "82%", products: "Minerals, Textiles" },
                    { model: "Prophet Forecasting", accuracy: "79%", products: "Agricultural Products" }
                  ].map((model) => (
                    <div key={model.model} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{model.model}</p>
                        <p className="text-sm text-muted-foreground">{model.products}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{model.accuracy}</p>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecast Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <p className="font-medium text-warning">Demand Shift Alert</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      China coffee demand projected to decline 15% in Q4
                    </p>
                  </div>
                  
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <p className="font-medium text-success">Growth Opportunity</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      EU tea market showing strong growth potential
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}