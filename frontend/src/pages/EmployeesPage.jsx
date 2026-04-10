import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from "../api/employees";
import { useDebounce } from "../hooks/useDebounce";
import { PER_PAGE } from "../constants";
import EmployeeFormDialog from "../components/EmployeeFormDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import EmptyState from "../components/EmptyState";

import {
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  TextField, Pagination, Box, Typography, Button, Chip, Paper, Alert,
  Skeleton,
} from "@mui/material";

function statusColor(s) {
  if (s === "active") return "success";
  if (s === "on_leave") return "warning";
  return "error";
}

function formatSalary(salary, currency) {
  try {
    return Number(salary).toLocaleString(undefined, {
      style: "currency", currency: currency || "USD",
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    });
  } catch {
    return `${Number(salary).toLocaleString()} ${currency}`;
  }
}

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", country: "", jobTitle: "" });
  const debouncedFilters = useDebounce(filters);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ["employees", page, debouncedFilters],
    queryFn: () => fetchEmployees({
      page, perPage: PER_PAGE,
      search: debouncedFilters.search,
      country: debouncedFilters.country,
      jobTitle: debouncedFilters.jobTitle,
    }),
    placeholderData: (prev) => prev,
  });

  const employees = response?.data || [];
  const meta = response?.meta || { current_page: 1, total_pages: 1, total_count: 0 };

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["employees"] });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }) => id ? updateEmployee(id, data) : createEmployee(data),
    onSuccess: () => { invalidate(); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteEmployee(id),
    onSuccess: () => { invalidate(); setDeleteTarget(null); },
  });

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingEmployee(null);
  }, []);

  const handleSave = (formData, setError) => {
    const id = editingEmployee?.id;
    saveMutation.mutate({ id, data: formData }, {
      onError: (err) => {
        const msgs = err.response?.data?.errors;
        setError(msgs ? msgs.join(", ") : "Something went wrong");
      },
    });
  };

  const handleFilterChange = (field) => (e) => {
    setFilters((p) => ({ ...p, [field]: e.target.value }));
    setPage(1);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Employees</Typography>
        <Button variant="contained" onClick={() => { setEditingEmployee(null); setDialogOpen(true); }}>
          Add Employee
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
        <TextField label="Search Name" size="small" value={filters.search}
          onChange={handleFilterChange("search")} />
        <TextField label="Country" size="small" value={filters.country}
          onChange={handleFilterChange("country")} />
        <TextField label="Job Title" size="small" value={filters.jobTitle}
          onChange={handleFilterChange("jobTitle")} />
        <Typography variant="body2" color="text.secondary">
          {meta.total_count.toLocaleString()} results
        </Typography>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || "Failed to load employees"}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
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
            {isLoading && !employees.length
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              : employees.map((emp) => (
                  <TableRow key={emp.id} hover>
                    <TableCell>{emp.full_name}</TableCell>
                    <TableCell>{emp.job_title}</TableCell>
                    <TableCell>{emp.department || "—"}</TableCell>
                    <TableCell>{emp.country}</TableCell>
                    <TableCell align="right">{formatSalary(emp.salary, emp.currency)}</TableCell>
                    <TableCell>
                      <Chip label={emp.employment_status?.replace("_", " ")}
                        color={statusColor(emp.employment_status)} size="small" />
                    </TableCell>
                    <TableCell>{emp.hire_date || "—"}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Button size="small" onClick={() => { setEditingEmployee(emp); setDialogOpen(true); }}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => setDeleteTarget(emp)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      {!isLoading && employees.length === 0 && !isError && (
        <EmptyState message="No employees match your filters" />
      )}

      {meta.total_pages > 1 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination count={meta.total_pages} page={page} onChange={(_, v) => setPage(v)} />
        </Box>
      )}

      <EmployeeFormDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSave={handleSave}
        employee={editingEmployee}
        isPending={saveMutation.isPending}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        name={deleteTarget?.full_name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        isPending={deleteMutation.isPending}
      />
    </Box>
  );
}
