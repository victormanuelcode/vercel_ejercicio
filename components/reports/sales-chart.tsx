"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { day: "1", sales: 1200 },
  { day: "2", sales: 1800 },
  { day: "3", sales: 1600 },
  { day: "4", sales: 2200 },
  { day: "5", sales: 1900 },
  { day: "6", sales: 2400 },
  { day: "7", sales: 2100 },
  { day: "8", sales: 1700 },
  { day: "9", sales: 2300 },
  { day: "10", sales: 2600 },
  { day: "11", sales: 2000 },
  { day: "12", sales: 2800 },
  { day: "13", sales: 2500 },
  { day: "14", sales: 2200 },
  { day: "15", sales: 2900 },
]

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="day" className="text-muted-foreground" />
        <YAxis className="text-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
