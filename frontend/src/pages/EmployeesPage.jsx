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
  Skeleton, InputAdornment, Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

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
    <>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5">Employees</Typography>
          <Typography variant="body2" color="text.secondary">
            {meta.total_count.toLocaleString()} total employees
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => { setEditingEmployee(null); setDialogOpen(true); }}>
          Add Employee
        </Button>
      </Box>

      {/* Filters */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <TextField
            label="Search Name" size="small" value={filters.search}
            onChange={handleFilterChange("search")}
            sx={{ minWidth: 220 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment>
                ),
              },
            }}
          />
          <TextField label="Country" size="small" value={filters.country}
            onChange={handleFilterChange("country")} sx={{ minWidth: 160 }} />
          <TextField label="Job Title" size="small" value={filters.jobTitle}
            onChange={handleFilterChange("jobTitle")} sx={{ minWidth: 180 }} />
        </Stack>
      </Paper>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || "Failed to load employees"}
        </Alert>
      )}

      {/* Table */}
      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <TableContainer>
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
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && !employees.length
                ? Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}><Skeleton variant="text" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : employees.map((emp) => (
                    <TableRow key={emp.id} hover sx={{ "&:hover": { bgcolor: "action.hover" } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>{emp.full_name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{emp.job_title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{emp.department || "—"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{emp.country}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatSalary(emp.salary, emp.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={emp.employment_status?.replace("_", " ")}
                          color={statusColor(emp.employment_status)}
                          size="small" variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{emp.hire_date || "—"}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
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
      </Paper>

      {!isLoading && employees.length === 0 && !isError && (
        <EmptyState message="No employees match your filters" />
      )}

      {meta.total_pages > 1 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={meta.total_pages} page={page}
            onChange={(_, v) => setPage(v)}
            shape="rounded"
          />
        </Box>
      )}

      <EmployeeFormDialog open={dialogOpen} onClose={closeDialog}
        onSave={handleSave} employee={editingEmployee} isPending={saveMutation.isPending} />

      <DeleteConfirmDialog open={!!deleteTarget} name={deleteTarget?.full_name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        isPending={deleteMutation.isPending} />
    </>
  );
}
