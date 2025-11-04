export const mockKpiData = {
  totalTradeValue: "$2.8B",
  tradeBalance: "-$450M",
  totalExports: "$1.2B",
  totalImports: "$1.65B",
  exportGrowth: "+12.3%",
  importGrowth: "+8.7%",
  topPartner: "Kenya",
  topProduct: "Coffee"
};

export const mockTradeData = [
  { period: "Jan 2022", imports: 125000000, exports: 95000000 },
  { period: "Feb 2022", imports: 135000000, exports: 102000000 },
  { period: "Mar 2022", imports: 140000000, exports: 108000000 },
  { period: "Apr 2022", imports: 138000000, exports: 115000000 },
  { period: "May 2022", imports: 142000000, exports: 118000000 },
  { period: "Jun 2022", imports: 145000000, exports: 125000000 },
  { period: "Jul 2022", imports: 148000000, exports: 130000000 },
  { period: "Aug 2022", imports: 152000000, exports: 135000000 },
  { period: "Sep 2022", imports: 155000000, exports: 140000000 },
  { period: "Oct 2022", imports: 158000000, exports: 145000000 },
  { period: "Nov 2022", imports: 162000000, exports: 150000000 },
  { period: "Dec 2022", imports: 165000000, exports: 155000000 }
];

export const mockTopPartners = [
  { country: "Kenya", value: 185000000, flag: "🇰🇪" },
  { country: "China", value: 165000000, flag: "🇨🇳" },
  { country: "UAE", value: 145000000, flag: "🇦🇪" },
  { country: "Belgium", value: 125000000, flag: "🇧🇪" },
  { country: "Germany", value: 95000000, flag: "🇩🇪" },
  { country: "USA", value: 85000000, flag: "🇺🇸" },
  { country: "India", value: 75000000, flag: "🇮🇳" },
  { country: "Uganda", value: 65000000, flag: "🇺🇬" }
];

export const mockTopProducts = [
  { product: "Coffee", value: 280000000, category: "Agricultural" },
  { product: "Tea", value: 165000000, category: "Agricultural" },
  { product: "Minerals", value: 145000000, category: "Mining" },
  { product: "Textiles", value: 85000000, category: "Manufacturing" },
  { product: "Electronics", value: 75000000, category: "Technology" },
  { product: "Machinery", value: 65000000, category: "Industrial" }
];

export const mockCompanies = [
  {
    id: "1",
    name: "Rwanda Coffee Company",
    sector: "Agricultural",
    totalTradeValue: 95000000,
    mainProducts: ["Coffee", "Tea"],
    topPartners: ["Belgium", "Germany", "USA"],
    growth: "+15.2%"
  },
  {
    id: "2", 
    name: "Kigali Industries Ltd.",
    sector: "Manufacturing",
    totalTradeValue: 68000000,
    mainProducts: ["Textiles", "Consumer Goods"],
    topPartners: ["Kenya", "UAE", "China"],
    growth: "+8.7%"
  },
  {
    id: "3",
    name: "RwandAir Cargo",
    sector: "Logistics",
    totalTradeValue: 45000000,
    mainProducts: ["Freight Services"],
    topPartners: ["Kenya", "UAE", "Belgium"],
    growth: "+22.1%"
  }
];

export const mockNetworkData = {
  nodes: [
    { id: "rwanda", name: "Rwanda", type: "center", size: 100, color: "#2563eb" },
    { id: "kenya", name: "Kenya", type: "partner", size: 80, color: "#16a34a" },
    { id: "china", name: "China", type: "partner", size: 75, color: "#dc2626" },
    { id: "uae", name: "UAE", type: "partner", size: 70, color: "#7c3aed" },
    { id: "belgium", name: "Belgium", type: "partner", size: 65, color: "#ea580c" },
    { id: "germany", name: "Germany", type: "partner", size: 60, color: "#0891b2" },
    { id: "usa", name: "USA", type: "partner", size: 55, color: "#be123c" },
    { id: "india", name: "India", type: "partner", size: 50, color: "#059669" },
    { id: "uganda", name: "Uganda", type: "partner", size: 45, color: "#7c2d12" }
  ],
  edges: [
    { source: "rwanda", target: "kenya", value: 185000000, type: "bidirectional" },
    { source: "rwanda", target: "china", value: 165000000, type: "import-heavy" },
    { source: "rwanda", target: "uae", value: 145000000, type: "bidirectional" },
    { source: "rwanda", target: "belgium", value: 125000000, type: "export-heavy" },
    { source: "rwanda", target: "germany", value: 95000000, type: "export-heavy" },
    { source: "rwanda", target: "usa", value: 85000000, type: "export-heavy" },
    { source: "rwanda", target: "india", value: 75000000, type: "import-heavy" },
    { source: "rwanda", target: "uganda", value: 65000000, type: "bidirectional" }
  ]
};

export const mockRiskData = {
  concentrationIndex: {
    byCountry: 0.32,
    byProduct: 0.28,
    byCompany: 0.24
  },
  topRisks: [
    {
      type: "Geographic Concentration",
      description: "32% of trade concentrated in top 3 partners",
      severity: "medium",
      trend: "increasing"
    },
    {
      type: "Product Dependency", 
      description: "Coffee represents 23% of total exports",
      severity: "medium",
      trend: "stable"
    },
    {
      type: "Supply Chain Disruption",
      description: "Key import routes through Mombasa port",
      severity: "high",
      trend: "stable"
    }
  ]
};