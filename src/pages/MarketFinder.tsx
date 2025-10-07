import { useState } from "react";
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
  ArrowUpRight,
  Filter,
  Star,
  Building2
} from "lucide-react";

const mockMarketOpportunities = [
  {
    country: "Germany",
    flag: "🇩🇪",
    product: "Coffee",
    demandGrowth: "+18%",
    averagePrice: "$4.20/kg",
    marketSize: "$125M",
    tariff: "0% (EU Agreement)",
    seasonality: "Year-round",
    topImporters: ["Hamburg Coffee Co.", "Bavarian Roasters", "Berlin Trading"],
    riskScore: "Low",
    opportunity: "High"
  },
  {
    country: "United States",
    flag: "🇺🇸", 
    product: "Tea",
    demandGrowth: "+12%",
    averagePrice: "$6.80/kg",
    marketSize: "$89M",
    tariff: "3.2%",
    seasonality: "Peak: Oct-Mar",
    topImporters: ["Pacific Tea Co.", "American Premium Tea", "East Coast Imports"],
    riskScore: "Low",
    opportunity: "High"
  },
  {
    country: "Japan",
    flag: "🇯🇵",
    product: "Coffee",
    demandGrowth: "+8%",
    averagePrice: "$5.10/kg", 
    marketSize: "$67M",
    tariff: "5.5%",
    seasonality: "Year-round",
    topImporters: ["Tokyo Coffee Ltd.", "Osaka Trading", "Kansai Imports"],
    riskScore: "Medium",
    opportunity: "Medium"
  }
];

export default function MarketFinder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Market Finder
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover high-potential export markets for your products
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by product (e.g., coffee, tea, textiles...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button size="sm" className="bg-gradient-primary">
                Find Markets
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Product Categories */}
      <div className="flex flex-wrap gap-2">
        {["Coffee", "Tea", "Textiles", "Minerals", "Electronics", "Agricultural Products"].map((product) => (
          <Badge 
            key={product}
            variant={selectedProduct === product ? "default" : "secondary"}
            className="cursor-pointer hover:bg-primary/10"
            onClick={() => setSelectedProduct(product === selectedProduct ? "" : product)}
          >
            {product}
          </Badge>
        ))}
      </div>

      {/* Results */}
      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="opportunities">Market Opportunities</TabsTrigger>
          <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Intel</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          {mockMarketOpportunities.map((market, index) => (
            <Card key={index} className="hover:shadow-medium transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{market.flag}</span>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {market.country}
                        <Badge variant={market.opportunity === "High" ? "default" : "secondary"}>
                          {market.opportunity} Opportunity
                        </Badge>
                      </CardTitle>
                      <p className="text-muted-foreground">Market for {market.product}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-gradient-primary">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Demand Growth</p>
                    <p className="font-semibold text-success flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {market.demandGrowth}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Size</p>
                    <p className="font-semibold flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {market.marketSize}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Price</p>
                    <p className="font-semibold">{market.averagePrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tariff Rate</p>
                    <p className="font-semibold">{market.tariff}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Key Importers</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {market.topImporters.map((importer) => (
                      <Badge key={importer} variant="outline" className="text-xs">
                        {importer}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed market analysis charts and insights will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Competitor analysis and market positioning data will be shown here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}