import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert, MenuItem, Grid,
  FormHelperText,
} from "@mui/material";
import { COUNTRIES, CURRENCIES, EMPLOYMENT_STATUSES, DEPARTMENTS } from "../constants";
import { validateEmployee, hasErrors } from "../utils/validation";

function buildInitialForm(employee) {
  if (!employee) {
    return {
      first_name: "", last_name: "", job_title: "", department: "",
      country: "", salary: "", currency: "USD", hire_date: "", employment_status: "active",
    };
  }
  return {
    first_name: employee.first_name || "",
    last_name: employee.last_name || "",
    job_title: employee.job_title || "",
    department: employee.department || "",
    country: employee.country || "",
    salary: employee.salary || "",
    currency: employee.currency || "USD",
    hire_date: employee.hire_date || "",
    employment_status: employee.employment_status || "active",
  };
}

function EmployeeForm({ employee, onSave, onClose, isPending }) {
  const [form, setForm] = useState(() => buildInitialForm(employee));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const isEdit = !!employee;

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    const errs = validateEmployee(form);
    setErrors(errs);
    if (hasErrors(errs)) return;
    setServerError("");
    onSave(
      { ...form, salary: Number(form.salary), hire_date: form.hire_date || null },
      (msg) => setServerError(msg),
    );
  };

  return (
    <>
      <DialogTitle sx={{ pb: 0 }}>
        {isEdit ? "Edit Employee" : "Add Employee"}
      </DialogTitle>
      <DialogContent sx={{ pt: "20px !important" }}>
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Grid container spacing={2.5}>
          {/* Row 1: Names */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="First Name" required fullWidth value={form.first_name}
              onChange={update("first_name")} error={!!errors.first_name}
              helperText={errors.first_name} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Last Name" required fullWidth value={form.last_name}
              onChange={update("last_name")} error={!!errors.last_name}
              helperText={errors.last_name} />
          </Grid>

          {/* Row 2: Job Title + Department */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Job Title" required fullWidth value={form.job_title}
              onChange={update("job_title")} error={!!errors.job_title}
              helperText={errors.job_title} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Department" fullWidth select value={form.department}
              onChange={update("department")} error={!!errors.department}
              helperText={errors.department}>
              <MenuItem value="">None</MenuItem>
              {DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
          </Grid>

          {/* Row 3: Country */}
          <Grid size={{ xs: 12 }}>
            <TextField label="Country" required fullWidth select value={form.country}
              onChange={update("country")} error={!!errors.country}
              helperText={errors.country}>
              {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>

          {/* Row 4: Salary + Currency */}
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField label="Salary" required fullWidth type="number" value={form.salary}
              onChange={update("salary")} error={!!errors.salary}
              helperText={errors.salary}
              slotProps={{ htmlInput: { min: 0, step: "any" } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Currency" fullWidth select value={form.currency}
              onChange={update("currency")}>
              {CURRENCIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>

          {/* Row 5: Status + Hire Date */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Status" required fullWidth select value={form.employment_status}
              onChange={update("employment_status")} error={!!errors.employment_status}
              helperText={errors.employment_status}>
              {EMPLOYMENT_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Hire Date" fullWidth type="date" value={form.hire_date}
              onChange={update("hire_date")}
              slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </>
  );
}

export default function EmployeeFormDialog({ open, onClose, onSave, employee, isPending }) {
  if (!open) return null;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <EmployeeForm
        key={employee?.id ?? "new"}
        employee={employee}
        onSave={onSave}
        onClose={onClose}
        isPending={isPending}
      />
    </Dialog>
  );
}
