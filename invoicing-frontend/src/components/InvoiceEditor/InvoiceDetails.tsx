import React from "react";
import {
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import type { InvoiceHeader, InvoiceHeaderErrors } from "../../types/invoiceEditor.types";


interface Props {
  header: InvoiceHeader;
  error : InvoiceHeaderErrors;
  onChange: (field: keyof InvoiceHeader, value: InvoiceHeader[keyof InvoiceHeader]) => void;
}

const InvoiceDetails: React.FC<Props> = ({ 
  header,
  error = {}, 
  onChange }) => {
  return (
    <Card sx={{ mb: 1}}>
      <CardContent>
        <Typography variant="subtitle1" mb={1}>
          Invoice Details
        </Typography>

        <Stack spacing={2}>
          {/* Row 1 */}
          <Box>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Invoice No"
                fullWidth
                value={header.invoiceNo}
                helperText="Auto next available number"
                inputProps={{inputMode: "numeric"}}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[0-9]+$/.test(val)) {
                    onChange(
                      "invoiceNo",
                      val === "" ? "" : Number(val)
                    );
                  }
                }}
              />

              <TextField
                label="Invoice Date *"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={header.invoiceDate}
                error={!!error.invoiceDate}
                helperText={error.invoiceDate}
                onChange={(e) =>
                  onChange("invoiceDate", e.target.value)
                }
              />
            </Stack>
          </Box>

          {/* Row 2 */}
          <Box>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Customer Name *"
                fullWidth
                value={header.customerName}
                error={!!error.customerName}
                helperText={error.customerName}
                onChange={(e) =>
                  onChange("customerName", e.target.value.slice(0,50))
                }
                onBlur={(e) =>
                  onChange(
                    "customerName",
                    e.target.value.trim()
                  )
                }
              />

              <TextField
                label="City"
                fullWidth
                value={header.city}
                onChange={(e) =>
                  onChange("city", e.target.value.slice(0,50))
                }
                 onBlur={(e) =>
                  onChange(
                    "city",
                    e.target.value.trim()
                  )
                }
              />
            </Stack>
          </Box>

          {/* Row 3 */}
          <Box>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Address"
                fullWidth
                multiline
                minRows={2}
                value={header.address}
                onChange={(e) =>
                  onChange("address", e.target.value.slice(0, 500))
                }
              />

              <TextField
                label="Notes"
                fullWidth
                multiline
                minRows={2}
                value={header.notes}
                error={!!error.notes}
                helperText={error.notes ?? `${header.notes.length}/500`}
                onChange={(e) =>
                  onChange("notes", e.target.value.slice(0, 500))
                }
              />
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InvoiceDetails;
