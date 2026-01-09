import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { InvoiceTrend } from "../../types/invoice.types";


interface Props {
  data: InvoiceTrend[];
}
export const InvoiceTrendChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data}>
        <XAxis dataKey="monthStart" tickFormatter={(v) => new Date(v).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })} />
        <YAxis hide />
        <Tooltip />
        <Line type="monotone" dataKey="amountSum" stroke="#525355" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};
