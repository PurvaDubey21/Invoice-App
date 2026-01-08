import { Card, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value?: string | number;
  subText?: string;
  children?: React.ReactNode; // chart slot
}

export const StatCard = ({
  title,
  value,
  subText,
  children,
}: StatCardProps) => {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        height: "100%",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>

      {children ? (
        children
      ) : (
        <Typography variant="h6" fontWeight={600} mt={1}>
          {value}
        </Typography>
      )}

      {subText && (
        <Typography variant="caption" color="text.secondary">
          {subText}
        </Typography>
      )}
    </Card>
  );
};
