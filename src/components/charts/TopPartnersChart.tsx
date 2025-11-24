import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopPartnersChartProps {
  title: string;
  data: Array<{
    country: string;
    value: number;
    flag?: string;
  }>;
  height?: number;
}

export function TopPartnersChart({
  title,
  data,
  height = 300,
}: TopPartnersChartProps) {
  const formatValue = (value: number) => {
    if (value >= 1_000_000_000)
      return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-medium">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-chart-1">
            Trade Value: {formatValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-medium transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickFormatter={formatValue}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                type="category"
                dataKey="country"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="hsl(var(--chart-1))"
                radius={[0, 4, 4, 0]}
                barSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
