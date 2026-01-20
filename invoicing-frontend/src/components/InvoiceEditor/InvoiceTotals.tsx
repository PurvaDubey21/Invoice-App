import React from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface Props {
  subTotal: number;
  taxPct: number;
  taxAmt: number;
  onChange: (taxPct: number, taxAmt: number) => void;
}

/* ----------------------------------
   Utils
---------------------------------- */
const round2 = (v: number) => Math.round(v * 100) / 100;

const formatMoney = (v: number) =>
  v.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const InvoiceTotals: React.FC<Props> = ({
  subTotal,
  taxPct,
  taxAmt,
  onChange,
}) => {
  const handleTaxPctChange = (val: number) => {
    if (subTotal === 0) {
      onChange(0, 0);
      return;
    }

    const pct = Math.min(100, Math.max(0, val));
    const amt = round2((subTotal * pct) / 100);

    onChange(pct, amt);
  };

  const handleTaxAmtChange = (val: number) => {
    if (subTotal === 0) {
      onChange(0, 0);
      return;
    }

    const amt = Math.max(0, val);
    const pct = round2((amt * 100) / subTotal);

    onChange(pct, amt);
  };

  const invoiceAmount = round2(subTotal + taxAmt);

  /* ----------------------------------
     Render
  ---------------------------------- */

  return (
    <Card>
      <CardContent>
        <Stack alignItems="flex-end">
          <Box width={{ xs: "100%", md: 340 }}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography>Sub Total</Typography>
              <Typography>₹ {formatMoney(subTotal)}</Typography>
            </Stack>

            <Box mb={1}>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  label="Tax %"
                  type="number"
                  fullWidth
                  value={taxPct === 0 ? "" : taxPct}
                  inputProps={{ min: 0, max: 100 }}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === "" ? 0 : +val, taxAmt);
                  }}
                  onBlur={(e) => handleTaxPctChange(+e.target.value || 0)}
                />

                <TextField
                  size="small"
                  label="Tax Amount"
                  type="number"
                  fullWidth
                  value={taxAmt === 0 ? "" : taxAmt}
                  inputProps={{ min: 0 }}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(taxPct, val === "" ? 0 : +val);
                  }}
                  onBlur={(e) => handleTaxAmtChange(+e.target.value || 0)}
                />
              </Stack>
            </Box>

            <Box
              mt={2}
              p={2}
              bgcolor="#f5f5f5"
              borderRadius={1}
              display="flex"
              justifyContent="space-between"
            >
              <Typography fontWeight={600}>Invoice Amount</Typography>
              <Typography fontSize={20} fontWeight={700}>
                ₹ {formatMoney(invoiceAmount)}
              </Typography>
            </Box>
            {/* Zero hint */}
            {subTotal === 0 && (
              <Typography mt={1} variant="caption" color="text.secondary">
                No tax on zero amount.
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InvoiceTotals;
