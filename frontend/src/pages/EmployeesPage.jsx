import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Select,
  MenuItem,
  Pagination,
  Box,
  Typography,
} from "@mui/material";

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["employees", page, search, country, jobTitle],
    queryFn: async () => {
      const res = await api.get("/employees", {
        params: {
          page,
          search,
          country,
          job_title: jobTitle,
        },
      });
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Employees
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TextField
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <TextField
          label="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </Box>

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
              <TableCell>{emp.salary}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Box mt={3}>
        <Pagination
          count={10} // temporary (we'll fix later)
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
}