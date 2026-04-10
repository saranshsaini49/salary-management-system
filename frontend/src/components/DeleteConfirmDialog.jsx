import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button,
} from "@mui/material";

export default function DeleteConfirmDialog({ open, name, onClose, onConfirm, isPending }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Employee</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete {name}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={isPending}>
          {isPending ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
