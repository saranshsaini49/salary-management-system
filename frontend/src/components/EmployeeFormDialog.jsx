import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Alert, MenuItem, Select,
  InputLabel, FormControl, FormHelperText,
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
      <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {serverError && <Alert severity="error">{serverError}</Alert>}

          <TextField label="First Name" required value={form.first_name}
            onChange={update("first_name")} error={!!errors.first_name}
            helperText={errors.first_name} />

          <TextField label="Last Name" required value={form.last_name}
            onChange={update("last_name")} error={!!errors.last_name}
            helperText={errors.last_name} />

          <TextField label="Job Title" required value={form.job_title}
            onChange={update("job_title")} error={!!errors.job_title}
            helperText={errors.job_title} />

          <FormControl>
            <InputLabel>Department</InputLabel>
            <Select value={form.department} label="Department" onChange={update("department")}>
              <MenuItem value="">None</MenuItem>
              {DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
            {errors.department && <FormHelperText error>{errors.department}</FormHelperText>}
          </FormControl>

          <FormControl required error={!!errors.country}>
            <InputLabel>Country</InputLabel>
            <Select value={form.country} label="Country" onChange={update("country")}>
              {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
            {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
          </FormControl>

          <Box display="flex" gap={2}>
            <TextField label="Salary" required type="number" value={form.salary}
              onChange={update("salary")} error={!!errors.salary}
              helperText={errors.salary} sx={{ flex: 1 }}
              slotProps={{ htmlInput: { min: 0, step: "any" } }} />
            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel>Currency</InputLabel>
              <Select value={form.currency} label="Currency" onChange={update("currency")}>
                {CURRENCIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <FormControl required error={!!errors.employment_status}>
            <InputLabel>Status</InputLabel>
            <Select value={form.employment_status} label="Status" onChange={update("employment_status")}>
              {EMPLOYMENT_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>{s.replace("_", " ")}</MenuItem>
              ))}
            </Select>
            {errors.employment_status && <FormHelperText>{errors.employment_status}</FormHelperText>}
          </FormControl>

          <TextField label="Hire Date" type="date" value={form.hire_date}
            onChange={update("hire_date")} slotProps={{ inputLabel: { shrink: true } }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
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
