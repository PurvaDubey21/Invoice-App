import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Typography } from "@mui/material";

import type { InvoiceTrend } from "../../types/invoice.types";

type Props = {
  data: InvoiceTrend[];
};

export const InvoiceTrendChart = ({ data }: Props) => {
  const chartData = data.map((d) => ({
    month: new Date(d.monthStart).toLocaleString("en-IN", {
      month: "short",
    }),
    amount: d.amountSum ?? 0,
  }));

 // 2️⃣ 🔥 EMPTY / ZERO DATA CHECK (ADD HERE)
  if (!data.length || data.every((d) => d.amountSum === 0)) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", mt: 4 }}
      >
        No invoice data for selected period
      </Typography>
    );
  }


  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis hide />
        <Tooltip
          formatter={(value) =>
            typeof value === "number"
              ? `₹${value.toLocaleString("en-IN")}`
              : "₹0"
          }
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#525355"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
