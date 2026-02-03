import React from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import  DecimalField  from "../common/DecimalField";

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
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(v);

const InvoiceTotals: React.FC<Props> = ({
  subTotal,
  taxPct,
  taxAmt,
  onChange,
}) => {
 const [taxPctError, setTaxPctError] = React.useState<string | null>(null);
 const [taxAmtError, setTaxAmtError] = React.useState<string | null>(null);
 const handleTaxPctChange = (val: number) => {
  if (val < 0 || val > 100) {
    setTaxPctError("Tax % must be between 0 and 100.");
    return;
  }
  setTaxPctError(null);

  if (subTotal === 0) {
    onChange(0, 0);
    return;
  }

  const amt = round2((subTotal * val) / 100);
  onChange(val, amt);
};

 const handleTaxAmtChange = (val: number) => {
  if (val < 0) {
    setTaxAmtError("Tax amount must be ≥ 0.");
    return;
  }
  setTaxAmtError(null);

  if (subTotal === 0) {
    onChange(0, 0);
    return;
  }

  const pct = round2((val * 100) / subTotal);
  onChange(pct, val);
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
              <Typography color="text.secondary" fontWeight={600}>Sub Total</Typography>
              <Typography color="text.secondary" fontWeight={600} >{formatMoney(subTotal)}</Typography>
            </Stack>

            <Box mb={1}>
              <Stack direction="row" spacing={1}>
                <DecimalField
                  size="small"
                  label="Tax %"
                  fullWidth
                  value={taxPct}
                  error={!!taxPctError}
                  helperText={taxPctError}
                  onValueChange={(val) => {
                    setTaxPctError(null);

                    if (subTotal === 0) {
                      onChange(0, 0);
                      return;
                    }

                    const amt = round2((subTotal * val) / 100);
                    onChange(val, amt);
                  }}
                  onBlur={() => handleTaxPctChange(taxPct)}
                />
                <DecimalField
                  size="small"
                  label="Tax Amount"
                  fullWidth
                  value={taxAmt}
                  error={!!taxAmtError}
                  helperText={taxAmtError}
                  onValueChange={(val) => {
                    setTaxAmtError(null);

                    if (subTotal === 0) {
                      onChange(0, 0);
                      return;
                    }

                    const pct = round2((val * 100) / subTotal);
                    onChange(pct, val);
                  }}
                  onBlur={() => handleTaxAmtChange(taxAmt)}
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
               {formatMoney(invoiceAmount)}
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
