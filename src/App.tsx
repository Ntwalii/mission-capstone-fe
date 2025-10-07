import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import MarketFinder from "./pages/MarketFinder";
import Network from "./pages/Network";
import Forecasts from "./pages/Forecasts";
import Risk from "./pages/Risk";
import Companies from "./pages/Companies";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import WhatIf from "./pages/WhatIf";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/market-finder" element={<MarketFinder />} />
            <Route path="/network" element={<Network />} />
            <Route path="/forecasts" element={<Forecasts />} />
            <Route path="/risk" element={<Risk />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/what-if" element={<WhatIf />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
