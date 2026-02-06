import {
  useGetInvoiceListQuery,
  useGetInvoiceMetricsQuery,
  useGetInvoiceTrend12mQuery,
  useGetTopItemsQuery,
  useDeleteInvoiceMutation,
} from "../../services/invoiceApi";
import { useMemo, useState } from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { ActionBar } from "../../components/common/ActionBar";
import { StatCard } from "../../components/common/statCard";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceTrendChart } from "./InvoiceTrendChart";
import { InvoiceTopItemsChart } from "./InvoiceTopItemsChart";
import { ConfirmDeleteDialog } from "../../components/common/ConfirmDeleteDialog";
import { Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ALL_COLUMNS } from "./invoiceColumns.config";
import type { InvoiceColumnKey } from "./invoiceColumns.config";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { InvoiceMobileCards } from "./InvoiceMobileCards";
import { useOutletContext } from "react-router-dom";

export const InvoicePage = () => {
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [period, setPeriod] = useState("month");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();
  const [range, setRange] = useState(() => {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      from: from.toISOString().replace("Z", ""),
      to: today.toISOString().replace("Z", ""),
    };
  });

  const [selectedRange, setSelectedRange] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const { data: list = [], isLoading } = useGetInvoiceListQuery(range);
  const { data: metrics } = useGetInvoiceMetricsQuery({
    from: range.from,
    to: range.to,
  });

  const { data: trend = [] } = useGetInvoiceTrend12mQuery({
    asOf: range.to,
  });

  const { data: topItems = [] } = useGetTopItemsQuery({
    topN: 5,
  });

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const [deleteInvoice] = useDeleteInvoiceMutation();

  const filteredList = useMemo(() => {
    if (!searchText.trim()) return list;

    const q = searchText.trim().toLowerCase();

    return list.filter((inv) => {
      const invoiceNoMatch = String(inv.invoiceNo).includes(q);
      const customerMatch =
        inv.customerName && inv.customerName.toLowerCase().includes(q);

      return invoiceNoMatch || customerMatch;
    });
  }, [list, searchText]);

  const [visibleColumns, setVisibleColumns] = useState<InvoiceColumnKey[]>(
    ALL_COLUMNS.map((c) => c.key),
  );

  const handleExport = () => {
    const headers = ["Invoice No", "Customer", "Date", "Amount"];

    const rows = filteredList.map((inv) => [
      inv.invoiceNo,
      inv.customerName,
      inv.invoiceDate,
      inv.taxAmount,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.csv";
    a.click();
  };

  const handleToggleColumn = (key: InvoiceColumnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );
  };
  const calculateRange = (period: string) => {
    const today = new Date();
    let from: Date;
    let to: Date = today;

    switch (period) {
      case "today":
        from = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0,
        );
        to = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
        );
        break;

      case "month":
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = today;
        break;

      case "last-month":
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        break;

      case "12m":
        from = new Date(today.getFullYear(), today.getMonth() - 11, 1);
        to = today;
        break;

      default:
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = today;
    }

    return {
      from: from.toISOString().replace("Z", ""),
      to: to.toISOString().replace("Z", ""),
    };
  };

  const handlePeriodChange = ({
    period,
    from,
    to,
  }: {
    period: string;
    from?: string;
    to?: string;
  }) => {
    setPeriod(period);

    // ✅ Custom range
    if (period === "custom" && from && to) {
      setRange({
        from: `${from}T00:00:00`,
        to: `${to}T23:59:59`,
      });

      // 🔥 store for UI display
      setSelectedRange({ from, to });
      return;
    }

    // ✅ Non-custom period
    const newRange = calculateRange(period);
    setRange(newRange);

    // clear custom display when not custom
    setSelectedRange(null);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteInvoiceId) return;

     setIsDeleting(true);
    try {
      
      await deleteInvoice(deleteInvoiceId).unwrap();
      setDeleteInvoiceId(null);
      // 🔥 RTK Query auto-refetches list
    }finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      <PageHeader
        title="Invoices"
        value={period}
        selectedRange={selectedRange}
        onChange={handlePeriodChange}
        onMenuClick={openSidebar}
      />
      <Box
        sx={{
          backgroundColor: "#f5f6f7",
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 2 }
        }}
      >
        {/* TOP CARDS */}
        <Stack direction="row" flexWrap="wrap" gap={3} mb={3}>
          {/* CARD 1 */}
          <Box
            sx={{
              width: {
                xs: "calc(50% - 12px)", // 2 per row mobile
                md: "calc(25% - 18px)", // 4 per row desktop
              },
            }}
          >
            <StatCard
              title="Number of Invoices"
              value={metrics ? metrics.invoiceCount : "-"}
              
            />
          </Box>

          {/* CARD 2 */}
          <Box
            sx={{
              width: {
                xs: "calc(50% - 12px)",
                md: "calc(25% - 18px)",
              },
            }}
          >
            <StatCard
              title="Total Invoice Amount"
              value={
                metrics
                  ? `₹${metrics.totalAmount.toLocaleString("en-IN")}`
                  : "-"
              }
              
            />
          </Box>

          {/* CARD 3 */}
          <Box
            sx={{
              width: {
                xs: "calc(50% - 12px)",
                md: "calc(25% - 18px)",
              },
            }}
          >
            <StatCard title="Last 12 Months">
              <InvoiceTrendChart data={trend} />
            </StatCard>
          </Box>

          {/* CARD 4 */}
          <Box
            sx={{
              width: {
                xs: "calc(50% - 12px)",
                md: "calc(25% - 18px)",
              },
            }}
          >
            <StatCard title="Top 5 Items">
              <InvoiceTopItemsChart data={topItems} />
            </StatCard>
          </Box>
        </Stack>

        {/* ACTION BAR */}
        <ActionBar
          onCreateInvoice={() => navigate("/invoices/editor")}
          searchText={searchText}
          onSearchChange={setSearchText}
          handelExport={handleExport}
          columns={ALL_COLUMNS}
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
        />

        {/* TABLE */}
        {isMobile ? (
          <InvoiceMobileCards 
          rows={filteredList}
          onEdit={(id) => navigate(`/invoices/editor?id=${id}`)}
          onDelete={(id) => setDeleteInvoiceId(id)} 
          />
        ) : (
          <InvoiceTable
            rows={filteredList}
            visibleColumns={visibleColumns}
            loading={isLoading}
            onEdit={(id) => navigate(`/invoices/editor?id=${id}`)}
            onDelete={(id) => setDeleteInvoiceId(id)}
          />
        )}

        {/* ---------- DELETE CONFIRM ---------- */}
        <ConfirmDeleteDialog
          open={!!deleteInvoiceId}
          title="Delete Invoice"
          message="Are you sure you want to delete this invoice?"
          loading={isDeleting}
          onCancel={() => setDeleteInvoiceId(null)}
          onConfirm={handleDeleteConfirm}
        />
      </Box>
      
    </>
  );
};
