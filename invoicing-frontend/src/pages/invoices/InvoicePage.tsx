import {
  useGetInvoiceListQuery,
  useGetInvoiceMetricsQuery,
  useGetInvoiceTrend12mQuery,
  useGetTopItemsQuery,
  useDeleteInvoiceMutation,
} from "../../services/invoiceApi";

import { PageHeader } from "../../components/common/PageHeader";
import { ActionBar } from "../../components/common/ActionBar";
import { StatCard } from "../../components/common/statCard";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceTrendChart } from "./InvoiceTrendChart";
import { InvoiceTopItemsChart } from "./InvoiceTopItemsChart";

import { Box, Stack } from "@mui/material";

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

      <Box
        sx={{
          backgroundColor: "#f5f6f7",
          minHeight: "100vh",
          p: 6,
        }}
      >
        {/* TOP CARDS */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          mb={2}
        >
          <Box flex={1}>
            <StatCard
              title="Invoices"
              value={metrics?.invoiceCount ?? 0}
            />
          </Box>

          <Box flex={1}>
            <StatCard
              title="Total Amount"
              value={`₹${metrics?.totalAmount ?? 0}`}
            />
          </Box>

          <Box flex={1}>
            <StatCard title="Last 12 Months">
              <InvoiceTrendChart data={trend} />
            </StatCard>
          </Box>

          <Box flex={1}>
            <StatCard title="Top Items">
              <InvoiceTopItemsChart data={topItems} />
            </StatCard>
          </Box>
        </Stack>

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
