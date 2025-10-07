import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Network,
  Search,
  TrendingUp,
  Shield,
  Building2,
  FileText,
  Home,
  Globe,
  BrainCircuit
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Overview", url: "/dashboard", icon: Home, description: "Trade dashboard & KPIs" },
  { title: "Market Finder", url: "/market-finder", icon: Search, description: "Find export opportunities" },
  { title: "Network Explorer", url: "/network", icon: Network, description: "Trade relationship maps" },
  { title: "Forecasts", url: "/forecasts", icon: TrendingUp, description: "Predictive analytics" },
  { title: "Risk Analysis", url: "/risk", icon: Shield, description: "Dependency & concentration" },
  { title: "What-If Analysis", url: "/what-if", icon: BrainCircuit, description: "Simulate trade scenarios" },
  { title: "Companies", url: "/companies", icon: Building2, description: "Company trade profiles" },
  { title: "Reports", url: "/reports", icon: FileText, description: "Generate trade reports" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;
  
  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  return (
    <Sidebar className={isCollapsed ? "w-[72px]" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r">
        {/* Logo/Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Globe className="h-4 w-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold">Rwanda Trade</h2>
                <p className="text-xs text-muted-foreground">Intelligence Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={`${getNavClassName(item.url)} transition-all duration-200`}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && (
                        <div className="flex-1">
                          <span className="block text-sm font-medium">{item.title}</span>
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User section at bottom */}
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-accent flex items-center justify-center">
              <span className="text-xs font-semibold text-accent-foreground">A</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Analyst User</p>
                <p className="text-xs text-muted-foreground truncate">Policy Research</p>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}