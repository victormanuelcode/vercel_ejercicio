"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Fertilizante NPK", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Semillas de Maíz", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Herbicida", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Insecticida", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Otros", value: 5, color: "hsl(var(--chart-5))" },
]

export function ProductsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
