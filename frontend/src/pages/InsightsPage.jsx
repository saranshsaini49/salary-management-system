import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCountryInsights, fetchJobTitleInsights, fetchTopRoles } from "../api/insights";
import { useDebounce } from "../hooks/useDebounce";
import { COUNTRIES } from "../constants";
import EmptyState from "../components/EmptyState";

import {
  Box, Typography, TextField, Grid, Card, CardContent,
  MenuItem, Select, InputLabel, FormControl, Alert,
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, Skeleton,
} from "@mui/material";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

function formatNum(val) {
  return val != null ? Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "—";
}

const KPI_FIELDS = [
  { label: "Min Salary", key: "min_salary" },
  { label: "Max Salary", key: "max_salary" },
  { label: "Avg Salary", key: "avg_salary" },
  { label: "Median Salary", key: "median_salary" },
];

export default function InsightsPage() {
  const [country, setCountry] = useState("India");
  const [jobTitle, setJobTitle] = useState("");
  const debouncedJobTitle = useDebounce(jobTitle);

  const {
    data: countryStats,
    error: countryError,
    isLoading: countryLoading,
  } = useQuery({
    queryKey: ["countryStats", country],
    enabled: !!country,
    queryFn: () => fetchCountryInsights(country),
    retry: false,
  });

  const {
    data: jobStats,
    error: jobError,
  } = useQuery({
    queryKey: ["jobStats", country, debouncedJobTitle],
    enabled: !!country && !!debouncedJobTitle,
    queryFn: () => fetchJobTitleInsights(country, debouncedJobTitle),
    retry: false,
  });

  const { data: topRoles } = useQuery({
    queryKey: ["topRoles"],
    queryFn: fetchTopRoles,
    staleTime: 5 * 60 * 1000,
  });

  const chartData = countryStats?.salary_distribution || [];
  const countryErrMsg = countryError?.response?.data?.error;
  const jobErrMsg = jobError?.response?.data?.error;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>Salary Insights</Typography>

      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Country</InputLabel>
          <Select value={country} label="Country" onChange={(e) => setCountry(e.target.value)}>
            {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField label="Job Title" size="small" value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Software Engineer" />
      </Box>

      {countryErrMsg && <Alert severity="warning" sx={{ mb: 2 }}>{countryErrMsg}</Alert>}

      {/* KPI Cards */}
      {countryLoading && (
        <Grid container spacing={2} mb={4}>
          {KPI_FIELDS.map((f) => (
            <Grid size={{ xs: 6, md: 3 }} key={f.key}>
              <Card><CardContent><Skeleton height={48} /></CardContent></Card>
            </Grid>
          ))}
        </Grid>
      )}

      {countryStats && (
        <>
          <Typography variant="subtitle2" mb={1} color="text.secondary">
            {countryStats.total_employees.toLocaleString()} employees in {countryStats.country}
          </Typography>
          <Grid container spacing={2} mb={4}>
            {KPI_FIELDS.map((item) => (
              <Grid size={{ xs: 6, md: 3 }} key={item.key}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h6">
                      {formatNum(countryStats[item.key])}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Salary Distribution Chart */}
      {chartData.length > 0 && (
        <Box height={300} mb={4}>
          <Typography variant="subtitle1" mb={1}>Salary Distribution</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(val) => val.toLocaleString()} />
              <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Job Title Stats */}
      {jobErrMsg && <Alert severity="warning" sx={{ mb: 2 }}>{jobErrMsg}</Alert>}
      {jobStats && (
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6">
              {jobStats.job_title} in {jobStats.country}
            </Typography>
            <Typography color="text.secondary">
              {jobStats.total_employees} employees · Avg Salary: {formatNum(jobStats.avg_salary)}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Top Paying Roles */}
      {topRoles && topRoles.length > 0 && (
        <Box>
          <Typography variant="h6" mb={1}>Top Paying Roles</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={40}>#</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell align="right">Avg Salary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topRoles.map((role, i) => (
                  <TableRow key={role.job_title} hover>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{role.job_title}</TableCell>
                    <TableCell align="right">{formatNum(role.avg_salary)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {!countryStats && !countryLoading && !countryErrMsg && (
        <EmptyState message="Select a country to view insights" />
      )}
    </Box>
  );
}
