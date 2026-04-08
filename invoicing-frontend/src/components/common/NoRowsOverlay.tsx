import { Box, Typography } from "@mui/material";

export const NoRowsOverlay = ({ message }: { message: string }) => {
  return (
    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      sx={{ color: "#6b7280"}}
    >
      <Typography fontWeight={600}>
        {message}
      </Typography>
      <Typography variant="body2">
        Try adjusting your search or filters.
      </Typography>
    </Box>
  );
};
