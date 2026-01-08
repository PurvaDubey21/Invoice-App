import {
  useGetInvoiceListQuery,
  useGetInvoiceMetricsQuery,
  useGetInvoiceTrend12mQuery,
  useGetTopItemsQuery,
  useDeleteInvoiceMutation,
} from "./invoiceApi";

import Grid from "@mui/material/Grid";
import { PageHeader } from "../../components/common/PageHeader";
import { ActionBar } from "../../components/common/ActionBar";
import { StatCard } from "../../components/common/statCard";
import { InvoiceTable } from "../../features/component/InvoiceTable";
import { InvoiceTrendChart } from "../../features/component/InvoiceTrendChart";
import { InvoiceTopItemsChart } from "../../features/component/InvoiceTopItemsChart";
import { Box } from "@mui/material";

export const InvoicePage = () => {
  const range = { from: "2025-09-01", to: "2025-09-30" };

  const { data: list = [], isLoading } = useGetInvoiceListQuery(range);
  const { data: metrics } = useGetInvoiceMetricsQuery(range);
  const { data: trend = [] } = useGetInvoiceTrend12mQuery();
  const { data: topItems = [] } = useGetTopItemsQuery(range);

  const [deleteInvoice] = useDeleteInvoiceMutation();

  return (
    <>
    <PageHeader title="Invoices" value="month" onChange={() => {}} />
   <Box sx={{
    backgroundColor: "#f5f6f7",
    minHeight: "100vh",
    p:6
  }}>
    

      {/* TOP CARDS */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid xs={12} md={3}>
          <StatCard title="Invoices" value={metrics?.invoiceCount ?? 0} />
        </Grid>

        <Grid xs={12} md={3}>
          <StatCard
            title="Total Amount"
            value={`₹${metrics?.totalAmount ?? 0}`}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <StatCard title="Last 12 Months">
            <InvoiceTrendChart data={trend} />
          </StatCard>
        </Grid>

        <Grid xs={12} md={3}>
          <StatCard title="Top Items">
            <InvoiceTopItemsChart data={topItems} />
          </StatCard>
        </Grid>
      </Grid>

      {/* ACTION BAR */}
      <ActionBar />

      {/* TABLE */}
      <InvoiceTable
        rows={list}
        loading={isLoading}
        onDelete={(id) => deleteInvoice(id)}
      />
    </Box>  
    </>
  );
};
