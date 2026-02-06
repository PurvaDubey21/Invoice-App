import { Box, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TopItem } from "../../types/invoice.types";

interface Props {
  data: TopItem[];
}

const COLORS = ["#4F46E5", "#22C55E", "#F97316", "#EF4444", "#64748B"];

export const InvoiceTopItemsChart = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return <Typography>No data</Typography>;
  }

  const chartData = data.map((item) => ({
    name: item.itemName,
    value: item.amountSum,
  }));

  return (
    <Box height={115} >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name" 
            outerRadius={25}
            label
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) =>
    typeof value === "number"
      ? `₹${value.toLocaleString("en-IN")}`
      : "₹0"
  } />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};
