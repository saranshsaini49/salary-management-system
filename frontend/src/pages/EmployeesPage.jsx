import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";

import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TextField, Pagination, Box, Typography, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Chip, Alert, Select, InputLabel, FormControl,
  FormHelperText,
} from "@mui/material";

const COUNTRIES = ["India", "USA", "UK", "Germany", "Canada", "Australia", "France", "Japan", "Brazil", "Netherlands"];
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD"];
const STATUSES = ["active", "on_leave", "terminated"];
const PER_PAGE = 20;

const emptyForm = {
  first_name: "", last_name: "", job_title: "", department: "",
  country: "", salary: "", currency: "USD", hire_date: "", employment_status: "active",
};

function statusColor(s) {
  if (s === "active") return "success";
  if (s === "on_leave") return "warning";
  return "error";
}

function validate(form) {
  const errs = {};
  if (!form.first_name.trim()) errs.first_name = "Required";
  else if (form.first_name.length > 100) errs.first_name = "Max 100 chars";
  if (!form.last_name.trim()) errs.last_name = "Required";
  else if (form.last_name.length > 100) errs.last_name = "Max 100 chars";
  if (!form.job_title.trim()) errs.job_title = "Required";
  else if (form.job_title.length > 150) errs.job_title = "Max 150 chars";
  if (!form.country.trim()) errs.country = "Required";
  else if (form.country.length > 100) errs.country = "Max 100 chars";
  if (form.department && form.department.length > 100) errs.department = "Max 100 chars";
  if (!form.salary || Number(form.salary) <= 0) errs.salary = "Must be greater than 0";
  if (!STATUSES.includes(form.employment_status)) errs.employment_status = "Invalid status";
  return errs;
}

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", country: "", jobTitle: "" });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters]);

  const { data: response, isLoading } = useQuery({
    queryKey: ["employees", page, debouncedFilters],
    queryFn: async () => {
      const res = await api.get("/employees", {
        params: {
          page,
          per_page: PER_PAGE,
          search: debouncedFilters.search || undefined,
          country: debouncedFilters.country || undefined,
          job_title: debouncedFilters.jobTitle || undefined,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const employees = response?.data || [];
  const meta = response?.meta || { current_page: 1, total_pages: 1, total_count: 0 };

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return api.put(`/employees/${editingId}`, { employee: payload });
      }
      return api.post("/employees", { employee: payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      closeDialog();
    },
    onError: (err) => {
      const msgs = err.response?.data?.errors;
      setServerError(msgs ? msgs.join(", ") : "Something went wrong");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/employees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setDeleteConfirm(null);
    },
  });

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setServerError("");
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (emp) => {
    setForm({
      first_name: emp.first_name || "",
      last_name: emp.last_name || "",
      job_title: emp.job_title || "",
      department: emp.department || "",
      country: emp.country || "",
      salary: emp.salary || "",
      currency: emp.currency || "USD",
      hire_date: emp.hire_date || "",
      employment_status: emp.employment_status || "active",
    });
    setEditingId(emp.id);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const errs = validate(form);
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setServerError("");
    saveMutation.mutate({
      ...form,
      salary: Number(form.salary),
      hire_date: form.hire_date || null,
    });
  };

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Employees</Typography>
        <Button variant="contained" onClick={openCreate}>Add Employee</Button>
      </Box>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField label="Search Name" size="small" value={filters.search}
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} />
        <TextField label="Country" size="small" value={filters.country}
          onChange={(e) => setFilters((p) => ({ ...p, country: e.target.value }))} />
        <TextField label="Job Title" size="small" value={filters.jobTitle}
          onChange={(e) => setFilters((p) => ({ ...p, jobTitle: e.target.value }))} />
        <Typography variant="body2" alignSelf="center" color="text.secondary">
          {meta.total_count} results
        </Typography>
      </Box>

      {isLoading && <Typography>Loading...</Typography>}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Job Title</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Country</TableCell>
            <TableCell align="right">Salary</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Hire Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.full_name}</TableCell>
              <TableCell>{emp.job_title}</TableCell>
              <TableCell>{emp.department}</TableCell>
              <TableCell>{emp.country}</TableCell>
              <TableCell align="right">
                {Number(emp.salary).toLocaleString()} {emp.currency}
              </TableCell>
              <TableCell>
                <Chip label={emp.employment_status} color={statusColor(emp.employment_status)} size="small" />
              </TableCell>
              <TableCell>{emp.hire_date || "—"}</TableCell>
              <TableCell align="right">
                <Button size="small" onClick={() => openEdit(emp)}>Edit</Button>
                <Button size="small" color="error" onClick={() => setDeleteConfirm(emp)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={3} display="flex" justifyContent="center">
        <Pagination count={meta.total_pages} page={page} onChange={(_, v) => setPage(v)} />
      </Box>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit Employee" : "Add Employee"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <TextField label="First Name" required value={form.first_name}
              onChange={updateField("first_name")} error={!!formErrors.first_name}
              helperText={formErrors.first_name} />
            <TextField label="Last Name" required value={form.last_name}
              onChange={updateField("last_name")} error={!!formErrors.last_name}
              helperText={formErrors.last_name} />
            <TextField label="Job Title" required value={form.job_title}
              onChange={updateField("job_title")} error={!!formErrors.job_title}
              helperText={formErrors.job_title} />
            <TextField label="Department" value={form.department}
              onChange={updateField("department")} error={!!formErrors.department}
              helperText={formErrors.department} />
            <FormControl required error={!!formErrors.country}>
              <InputLabel>Country</InputLabel>
              <Select value={form.country} label="Country" onChange={updateField("country")}>
                {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
              {formErrors.country && <FormHelperText>{formErrors.country}</FormHelperText>}
            </FormControl>
            <Box display="flex" gap={2}>
              <TextField label="Salary" required type="number" value={form.salary}
                onChange={updateField("salary")} error={!!formErrors.salary}
                helperText={formErrors.salary} sx={{ flex: 1 }} />
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Currency</InputLabel>
                <Select value={form.currency} label="Currency" onChange={updateField("currency")}>
                  {CURRENCIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <FormControl required error={!!formErrors.employment_status}>
              <InputLabel>Status</InputLabel>
              <Select value={form.employment_status} label="Status" onChange={updateField("employment_status")}>
                {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
              {formErrors.employment_status && <FormHelperText>{formErrors.employment_status}</FormHelperText>}
            </FormControl>
            <TextField label="Hire Date" type="date" value={form.hire_date}
              onChange={updateField("hire_date")} slotProps={{ inputLabel: { shrink: true } }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete {deleteConfirm?.full_name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button color="error" variant="contained"
            onClick={() => deleteMutation.mutate(deleteConfirm.id)}
            disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
