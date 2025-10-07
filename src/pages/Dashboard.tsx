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
  Building2,
  Calendar,
  ArrowUpRight,
  Download
} from "lucide-react";
import { mockKpiData, mockTradeData, mockTopPartners, mockTopProducts } from "@/lib/mockData";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Trade Intelligence Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time insights into Rwanda's import and export activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 12 months
          </Button>
          <Button size="sm" className="bg-gradient-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Trade Value"
          value={mockKpiData.totalTradeValue}
          change="+15.2% from last year"
          changeType="positive"
          icon={DollarSign}
        />
        <KpiCard
          title="Trade Balance"
          value={mockKpiData.tradeBalance}
          change="Deficit decreased by 8%"
          changeType="positive"
          icon={TrendingDown}
        />
        <KpiCard
          title="Total Exports"
          value={mockKpiData.totalExports}
          change={mockKpiData.exportGrowth}
          changeType="positive"
          icon={TrendingUp}
        />
        <KpiCard
          title="Total Imports"
          value={mockKpiData.totalImports}
          change={mockKpiData.importGrowth}
          changeType="positive"
          icon={Package}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradeChart
          title="Trade Flow Trends"
          data={mockTradeData}
          type="line"
          height={350}
        />
        <TopPartnersChart
          title="Top Trading Partners"
          data={mockTopPartners.slice(0, 6)}
          height={350}
        />
      </div>

      {/* Secondary Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card className="hover:shadow-medium transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Top Export Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopProducts.slice(0, 5).map((product, index) => (
                <div key={product.product} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.product}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(product.value / 1000000).toFixed(0)}M
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +{Math.floor(Math.random() * 20 + 5)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Trade Distribution */}
        <Card className="hover:shadow-medium transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Regional Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: "East Africa", percentage: 42, value: "$520M" },
                { region: "Europe", percentage: 28, value: "$350M" },
                { region: "Asia", percentage: 18, value: "$225M" },
                { region: "North America", percentage: 8, value: "$100M" },
                { region: "Other", percentage: 4, value: "$50M" }
              ].map((region) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{region.region}</span>
                    <span className="text-muted-foreground">{region.value}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${region.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Companies */}
        <Card className="hover:shadow-medium transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Most Active Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Rwanda Coffee Company", trades: 156, growth: "+15%" },
                { name: "Kigali Industries Ltd.", trades: 132, growth: "+8%" },
                { name: "RwandAir Cargo", trades: 98, growth: "+22%" },
                { name: "Gicumbi Tea Factory", trades: 87, growth: "+12%" },
                { name: "Rwanda Development Board", trades: 76, growth: "+5%" }
              ].map((company) => (
                <div key={company.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{company.name}</p>
                    <p className="text-xs text-muted-foreground">{company.trades} transactions</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      parseFloat(company.growth) > 10 ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {company.growth}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}