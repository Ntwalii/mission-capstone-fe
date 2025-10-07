import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Current', export: 4000, import: 2400 },
  { name: 'Scenario 1', export: 4500, import: 2600 },
];

const WhatIf = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">What-If Analysis</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Build a Scenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="scenario-name" className="text-sm font-medium">Scenario Name</label>
                <Input id="scenario-name" placeholder="e.g., '2025 Growth Projection'" />
              </div>
              <div>
                <label htmlFor="country" className="text-sm font-medium">Target Country</label>
                <Select>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="china">China</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="uae">UAE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="product" className="text-sm font-medium">Product Category</label>
                <Select>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="tea">Tea</SelectItem>
                    <SelectItem value="minerals">Minerals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="change" className="text-sm font-medium">Export Change (%)</label>
                <Input id="change" type="number" placeholder="e.g., 10" />
              </div>
              <Button className="w-full">Run Simulation</Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="export" fill="#8884d8" name="Total Exports" />
                  <Bar dataKey="import" fill="#82ca9d" name="Total Imports" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhatIf;