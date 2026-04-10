import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export default function EmptyState({ message = "No data found" }) {
  return (
    <Box py={8} textAlign="center">
      <InboxIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
