import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function DeleteConfirmDialog({ open, name, onClose, onConfirm, isPending }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <WarningAmberIcon color="error" />
        Delete Employee
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={isPending}>
          {isPending ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
