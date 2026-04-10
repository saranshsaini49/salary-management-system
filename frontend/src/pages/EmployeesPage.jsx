import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Pagination,
  Box,
  Typography,
} from "@mui/material";

export default function EmployeesPage() {
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    country: "",
    jobTitle: "",
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce (clean version)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [filters]);

  const { data = [], isLoading } = useQuery({
    queryKey: ["employees", page, debouncedFilters],
    queryFn: async () => {
      const res = await api.get("/employees", {
        params: {
          page,
          search: debouncedFilters.search,
          country: debouncedFilters.country,
          job_title: debouncedFilters.jobTitle,
        },
      });

      return res.data.data;
    },
    keepPreviousData: true,
  });

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Employees
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search Name"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />

        <TextField
          label="Country"
          value={filters.country}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, country: e.target.value }))
          }
        />

        <TextField
          label="Job Title"
          value={filters.jobTitle}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, jobTitle: e.target.value }))
          }
        />
      </Box>

      {isLoading && <p>Updating...</p>}

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Job Title</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Salary</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.full_name}</TableCell>
              <TableCell>{emp.job_title}</TableCell>
              <TableCell>{emp.country}</TableCell>
              <TableCell>
                {emp.salary?.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Box mt={3}>
        <Pagination
          count={10} // later replace with backend meta
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
}