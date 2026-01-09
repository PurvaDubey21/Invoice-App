import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import type { TopItem } from "../../types/invoice.types";

interface Props {
  data: TopItem[];
}


export const InvoiceTopItemsChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amountSum"
          nameKey="itemName"
          outerRadius={45}
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
