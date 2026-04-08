import { Typography, Link as MuiLink } from "@mui/material";

interface Props {
  message?: string;
  showLinks?: boolean;
}

export const Footer = ({
  message = "© 2025 InvoiceApp. All rights reserved.",
  showLinks = false,
}: Props) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="text-center py-3 space-y-1">
        
        {/* Copyright */}
        <Typography variant="caption" color="#525355" fontSize={12}>
          {message}
        </Typography>

        {/* Optional Links */}
        {showLinks && (
          <div className="flex justify-center gap-6  ">
            <MuiLink href="#" underline="hover" fontSize={12} color="#525355">
              Privacy Policy
            </MuiLink>

            <MuiLink href="#" underline="hover" fontSize={12} color="#525355">
              Terms of Service
            </MuiLink>

            <MuiLink href="#" underline="hover" fontSize={12} color="#525355">
              Support
            </MuiLink>
          </div>
        )}

      </div>
    </footer>
  );
};
