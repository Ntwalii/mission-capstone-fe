import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Building2,
  TrendingUp,
  Globe,
  Package,
  Users,
  Calendar,
  ArrowUpRight,
  Filter,
  Star,
} from "lucide-react";

const mockCompanies = [
  {
    name: "Rwanda Coffee Company",
    type: "Exporter",
    industry: "Agriculture",
    tradeValue: "$45.2M",
    transactions: 156,
    growth: "+22%",
    mainProducts: ["Arabica Coffee", "Green Beans"],
    topMarkets: ["Germany", "USA", "Belgium"],
    riskScore: "Low",
    founded: "1998",
    employees: "450+",
  },
  {
    name: "Kigali Industries Ltd.",
    type: "Mixed",
    industry: "Manufacturing",
    tradeValue: "$32.8M",
    transactions: 132,
    growth: "+15%",
    mainProducts: ["Textiles", "Construction Materials", "Electronics"],
    topMarkets: ["Kenya", "Tanzania", "DRC"],
    riskScore: "Low",
    founded: "2003",
    employees: "280+",
  },
  {
    name: "East African Tea Traders",
    type: "Exporter",
    industry: "Agriculture",
    tradeValue: "$28.5M",
    transactions: 98,
    growth: "+18%",
    mainProducts: ["Black Tea", "Green Tea", "Herbal Blends"],
    topMarkets: ["UK", "USA", "Russia"],
    riskScore: "Medium",
    founded: "2001",
    employees: "320+",
  },
  {
    name: "Central Imports Ltd.",
    type: "Importer",
    industry: "General Trading",
    tradeValue: "$22.1M",
    transactions: 87,
    growth: "+8%",
    mainProducts: ["Machinery", "Electronics", "Consumer Goods"],
    topMarkets: ["China", "India", "Dubai"],
    riskScore: "Medium",
    founded: "2005",
    employees: "150+",
  },
  {
    name: "Mountain View Minerals",
    type: "Exporter",
    industry: "Mining",
    tradeValue: "$38.7M",
    transactions: 76,
    growth: "+12%",
    mainProducts: ["Tin Ore", "Tungsten", "Tantalite"],
    topMarkets: ["China", "Malaysia", "India"],
    riskScore: "High",
    founded: "2010",
    employees: "200+",
  },
];

const industryStats = [
  { industry: "Agriculture", companies: 45, value: "$234M", growth: "+18%" },
  { industry: "Manufacturing", companies: 32, value: "$156M", growth: "+12%" },
  { industry: "Mining", companies: 18, value: "$198M", growth: "+8%" },
  { industry: "Services", companies: 28, value: "$89M", growth: "+15%" },
];

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Exporter":
        return "bg-success/10 text-success";
      case "Importer":
        return "bg-primary/10 text-primary";
      case "Mixed":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "default";
      case "Medium":
        return "secondary";
      case "High":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-hero bg-clip-text text-primary">
            Companies Database
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive directory of Rwanda's trading companies
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button size="sm" className="bg-primary">
            Add Company
          </Button>
        </div>
      </div>

      {/* Search and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search companies by name, industry, or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-primary">Search</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">123</p>
              <p className="text-sm text-muted-foreground">Active Companies</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industry Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          "Agriculture",
          "Manufacturing",
          "Mining",
          "Services",
          "Technology",
        ].map((industry) => (
          <Badge
            key={industry}
            variant={selectedIndustry === industry ? "default" : "secondary"}
            className="cursor-pointer hover:bg-primary/10"
            onClick={() =>
              setSelectedIndustry(industry === selectedIndustry ? "" : industry)
            }
          >
            {industry}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="directory">Company Directory</TabsTrigger>
          <TabsTrigger value="analytics">Industry Analytics</TabsTrigger>
          <TabsTrigger value="networks">Trade Networks</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          {mockCompanies.map((company) => (
            <Card
              key={company.name}
              className="hover:shadow-medium transition-all duration-200"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTypeColor(company.type)}>
                          {company.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {company.industry} • Founded {company.founded}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-primary">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Trade Value</p>
                    <p className="font-semibold text-lg">
                      {company.tradeValue}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Transactions
                    </p>
                    <p className="font-semibold">{company.transactions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth</p>
                    <p className="font-semibold text-success flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {company.growth}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <Badge variant={getRiskColor(company.riskScore)}>
                      {company.riskScore}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Main Products</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {company.mainProducts.map((product) => (
                        <Badge
                          key={product}
                          variant="outline"
                          className="text-xs"
                        >
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Top Markets</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {company.topMarkets.map((market) => (
                        <Badge
                          key={market}
                          variant="outline"
                          className="text-xs"
                        >
                          {market}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{company.employees} employees</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Est. {company.founded}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Industry Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {industryStats.map((stat) => (
                    <div
                      key={stat.industry}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{stat.industry}</p>
                        <p className="text-sm text-muted-foreground">
                          {stat.companies} companies
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{stat.value}</p>
                        <p className="text-sm text-success">{stat.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Leaders */}
            <Card>
              <CardHeader>
                <CardTitle>Top Growth Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCompanies
                    .sort((a, b) => parseFloat(b.growth) - parseFloat(a.growth))
                    .slice(0, 5)
                    .map((company, index) => (
                      <div
                        key={company.name}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {company.industry}
                          </p>
                        </div>
                        <Badge className="bg-success/10 text-success">
                          {company.growth}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="networks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Trade Networks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Interactive company network visualization would be rendered
                    here
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Showing trade relationships between companies and partners
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
