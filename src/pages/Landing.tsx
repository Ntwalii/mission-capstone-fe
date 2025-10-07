import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BarChart3,
  Globe,
  TrendingUp,
  Shield,
  Users,
  FileText,
  Network,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-trade.jpg";

const Landing = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Trade Analytics",
      description:
        "Real-time insights into Rwanda's import/export activities with interactive visualizations and trend analysis.",
    },
    {
      icon: Network,
      title: "Network Explorer",
      description:
        "Visualize trade relationships and discover key partners across global markets with network analysis.",
    },
    {
      icon: TrendingUp,
      title: "AI Forecasting",
      description:
        "Predict future trade flows using advanced ML models to stay ahead of market trends.",
    },
    {
      icon: Target,
      title: "Market Finder",
      description:
        "Discover new export opportunities and identify growing markets for your products.",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description:
        "Monitor dependency risks and trade concentration to build economic resilience.",
    },
    {
      icon: FileText,
      title: "Custom Reports",
      description:
        "Generate professional reports with key insights for stakeholders and decision-makers.",
    },
  ];

  const useCases = [
    {
      title: "Policy Makers",
      description:
        "Track trade balance, assess dependency risks, and run policy scenarios to strengthen Rwanda's trade position.",
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Exporters & Importers",
      description:
        "Identify market opportunities, monitor competitors, and optimize your international trade strategy.",
      icon: Globe,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Investors & Analysts",
      description:
        "Evaluate sector momentum, assess market risks, and make data-driven investment decisions.",
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Rwanda Trade Intel</span>
          </div>
          <Link to="/dashboard">
            <Button>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/20">
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <Badge variant="outline" className="w-fit">
                <Zap className="h-3 w-3 mr-1" />
                Powered by AI & Real Trade Data
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Unlock Rwanda's{" "}
                <span className="text-primary">Trade Intelligence</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive import/export analytics platform combining network
                analysis, AI forecasting, and risk assessment for informed trade
                decisions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2">
                    Explore Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/market-finder">
                  <Button size="lg" variant="outline">
                    Find Markets
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">500K+</div>
                  <div className="text-sm text-muted-foreground">
                    Trade Records
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">
                    Partner Countries
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">
                    Product Categories
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img
                src={heroImage}
                alt="Trade Analytics Dashboard"
                className="rounded-lg shadow-2xl relative border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to analyze, forecast, and optimize
              international trade
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Built For Everyone
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tailored insights for policy makers, businesses, and investors
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {useCases.map((useCase, idx) => (
              <Card
                key={idx}
                className="text-center hover:shadow-lg transition-all duration-200"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-full ${useCase.color} mx-auto flex items-center justify-center mb-4`}
                  >
                    <useCase.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Trade Strategy?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant access to comprehensive trade data and AI-powered
            insights
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="gap-2">
              Start Exploring Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <span className="font-semibold">
                Rwanda Trade Intelligence Platform
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
               ©2025 Rwanda
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
