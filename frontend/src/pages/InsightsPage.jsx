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
  TableContainer, Paper, Skeleton, Stack, Chip,
} from "@mui/material";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

function formatCurrency(val) {
  if (val == null) return "—";
  return Number(val).toLocaleString(undefined, {
    style: "currency", currency: "USD",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  });
}

const KPI_FIELDS = [
  { label: "Min Salary", key: "min_salary", icon: "📉" },
  { label: "Max Salary", key: "max_salary", icon: "📈" },
  { label: "Avg Salary", key: "avg_salary", icon: "📊" },
  { label: "Median Salary", key: "median_salary", icon: "🎯" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper sx={{ p: 1.5, boxShadow: 3 }}>
      <Typography variant="body2" fontWeight={600}>{label}</Typography>
      <Typography variant="body2" color="text.secondary">
        {payload[0].value.toLocaleString()} employees
      </Typography>
    </Paper>
  );
};

export default function InsightsPage() {
  const [country, setCountry] = useState("India");
  const [jobTitle, setJobTitle] = useState("");
  const debouncedJobTitle = useDebounce(jobTitle);

  const { data: countryStats, error: countryError, isLoading: countryLoading } = useQuery({
    queryKey: ["countryStats", country],
    enabled: !!country,
    queryFn: () => fetchCountryInsights(country),
    retry: false,
  });

  const { data: jobStats, error: jobError } = useQuery({
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
    <>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h5">Salary Insights</Typography>
        <Typography variant="body2" color="text.secondary">
          Explore salary data across countries and roles
        </Typography>
      </Box>

      {/* Filters */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Country</InputLabel>
            <Select value={country} label="Country" onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Job Title" size="small" value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Software Engineer" sx={{ minWidth: 240 }} />
        </Stack>
      </Paper>

      {countryErrMsg && <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>{countryErrMsg}</Alert>}

      {/* KPI Cards */}
      {countryLoading && (
        <Grid container spacing={2} mb={3}>
          {KPI_FIELDS.map((f) => (
            <Grid size={{ xs: 6, md: 3 }} key={f.key}>
              <Card><CardContent><Skeleton height={60} /></CardContent></Card>
            </Grid>
          ))}
        </Grid>
      )}

      {countryStats && (
        <>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="subtitle1">
              {countryStats.country}
            </Typography>
            <Chip
              label={`${countryStats.total_employees.toLocaleString()} employees`}
              size="small" variant="outlined" color="primary"
            />
          </Box>
          <Grid container spacing={2} mb={4}>
            {KPI_FIELDS.map((item) => (
              <Grid size={{ xs: 6, md: 3 }} key={item.key}>
                <Card sx={{
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography fontSize={18}>{item.icon}</Typography>
                      <Typography variant="subtitle2">{item.label}</Typography>
                    </Box>
                    <Typography variant="h5" fontWeight={700}>
                      {formatCurrency(countryStats[item.key])}
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
        <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
          <Typography variant="subtitle1" mb={2}>Salary Distribution</Typography>
          <Box height={320}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(108, 71, 255, 0.06)" }} />
                <Bar dataKey="count" fill="#6C47FF" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}

      {/* Job Title Stats */}
      {jobErrMsg && <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>{jobErrMsg}</Alert>}
      {jobStats && (
        <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="subtitle1">{jobStats.job_title}</Typography>
              <Typography variant="body2" color="text.secondary">in {jobStats.country}</Typography>
            </Box>
            <Stack direction="row" spacing={3}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {formatCurrency(jobStats.avg_salary)}
                </Typography>
                <Typography variant="caption" color="text.secondary">Avg Salary</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight={700}>
                  {jobStats.total_employees}
                </Typography>
                <Typography variant="caption" color="text.secondary">Employees</Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>
      )}

      {/* Top Paying Roles */}
      {topRoles && topRoles.length > 0 && (
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Box px={3} py={2} borderBottom="1px solid" borderColor="divider">
            <Typography variant="subtitle1">Top Paying Roles</Typography>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={50}>#</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell align="right">Avg Salary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topRoles.map((role, i) => (
                  <TableRow key={role.job_title} hover>
                    <TableCell>
                      <Chip label={i + 1} size="small"
                        sx={{
                          fontWeight: 700, minWidth: 28,
                          bgcolor: i < 3 ? "primary.main" : "action.selected",
                          color: i < 3 ? "#fff" : "text.primary",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{role.job_title}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(role.avg_salary)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {!countryStats && !countryLoading && !countryErrMsg && (
        <EmptyState message="Select a country to view insights" />
      )}
    </>
  );
}
