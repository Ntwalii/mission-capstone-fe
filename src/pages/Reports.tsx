import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Globe,
  Plus,
  Search,
  Filter,
  Share
} from "lucide-react";

const mockReports = [
  {
    id: 1,
    title: "Q4 2024 Trade Performance Report",
    type: "Quarterly Summary",
    created: "2024-01-15",
    pages: 24,
    downloads: 156,
    status: "Published",
    description: "Comprehensive analysis of Rwanda's trade performance in Q4 2024"
  },
  {
    id: 2,
    title: "Coffee Export Market Analysis",
    type: "Product Deep Dive",
    created: "2024-01-10",
    pages: 18,
    downloads: 89,
    status: "Published",
    description: "In-depth analysis of coffee export trends and market opportunities"
  },
  {
    id: 3,
    title: "Risk Assessment: China Trade Dependency",
    type: "Risk Analysis",
    created: "2024-01-08",
    pages: 12,
    downloads: 67,
    status: "Draft",
    description: "Analysis of trade concentration risks with China"
  },
  {
    id: 4,
    title: "AfCFTA Impact Projection 2024-2026",
    type: "Forecast Report",
    created: "2024-01-05",
    pages: 32,
    downloads: 134,
    status: "Published",
    description: "Long-term projections of AfCFTA impacts on Rwanda's trade"
  }
];

const reportTemplates = [
  {
    name: "Trade Performance Dashboard",
    description: "Monthly trade KPIs and trend analysis",
    icon: BarChart3,
    pages: "8-12",
    frequency: "Monthly"
  },
  {
    name: "Market Opportunity Report", 
    description: "Identify new export markets for specific products",
    icon: Globe,
    pages: "15-20",
    frequency: "Quarterly"
  },
  {
    name: "Risk Assessment Brief",
    description: "Concentration and dependency risk analysis",
    icon: TrendingUp,
    pages: "6-10",
    frequency: "As needed"
  },
  {
    name: "Company Profile Report",
    description: "Detailed analysis of specific trading companies",
    icon: FileText,
    pages: "10-15",
    frequency: "As needed"
  }
];

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Published": return "default";
      case "Draft": return "secondary";
      case "Scheduled": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate and manage comprehensive trade intelligence reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button size="sm" className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-medium transition-all duration-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="p-3 rounded-lg bg-primary/10 mx-auto w-fit">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold mt-2">Quick Dashboard</p>
              <p className="text-sm text-muted-foreground">Generate current period summary</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-medium transition-all duration-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="p-3 rounded-lg bg-success/10 mx-auto w-fit">
                <PieChart className="h-6 w-6 text-success" />
              </div>
              <p className="font-semibold mt-2">Market Analysis</p>
              <p className="text-sm text-muted-foreground">Deep dive into specific markets</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-medium transition-all duration-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="p-3 rounded-lg bg-warning/10 mx-auto w-fit">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
              <p className="font-semibold mt-2">Risk Report</p>
              <p className="text-sm text-muted-foreground">Current risk assessment</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-medium transition-all duration-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="p-3 rounded-lg bg-destructive/10 mx-auto w-fit">
                <Globe className="h-6 w-6 text-destructive" />
              </div>
              <p className="font-semibold mt-2">Custom Report</p>
              <p className="text-sm text-muted-foreground">Build from scratch</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">Report Library</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search reports by title, type, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="quarterly">Quarterly Summary</SelectItem>
                      <SelectItem value="product">Product Deep Dive</SelectItem>
                      <SelectItem value="risk">Risk Analysis</SelectItem>
                      <SelectItem value="forecast">Forecast Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {mockReports.map((report) => (
              <Card key={report.id} className="hover:shadow-medium transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{report.type}</Badge>
                          <Badge variant={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Created {report.created}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-gradient-primary">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{report.pages} pages</span>
                      <span>{report.downloads} downloads</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTemplates.map((template) => (
              <Card key={template.name} className="hover:shadow-medium transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <template.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pages:</span>
                      <span className="font-medium">{template.pages}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="font-medium">{template.frequency}</span>
                    </div>
                    <Button className="w-full bg-gradient-primary">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Report Title</label>
                    <Input placeholder="Enter report title" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Report Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom Analysis</SelectItem>
                        <SelectItem value="dashboard">Dashboard Summary</SelectItem>
                        <SelectItem value="deep-dive">Market Deep Dive</SelectItem>
                        <SelectItem value="comparison">Comparative Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Data Sources</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      "Trade Statistics",
                      "Company Profiles", 
                      "Market Analysis",
                      "Risk Metrics",
                      "Forecasts",
                      "Network Data",
                      "Price Trends",
                      "Regulatory Info"
                    ].map((source) => (
                      <div key={source} className="flex items-center space-x-2">
                        <input type="checkbox" id={source} className="w-4 h-4" />
                        <label htmlFor={source} className="text-sm">{source}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Charts & Visualizations</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "Trade Flow Chart", icon: BarChart3 },
                      { name: "Partner Network", icon: Globe },
                      { name: "Growth Trends", icon: TrendingUp }
                    ].map((chart) => (
                      <Card key={chart.name} className="p-4 cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <chart.icon className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">{chart.name}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    Save as Template
                  </Button>
                  <Button className="flex-1 bg-gradient-primary">
                    Generate Report
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