import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

import {
  Box, Typography, TextField, Grid, Card, CardContent,
  MenuItem, Select, InputLabel, FormControl, Alert,
  Table, TableHead, TableRow, TableCell, TableBody,
} from "@mui/material";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const COUNTRIES = ["India", "USA", "UK", "Germany", "Canada", "Australia", "France", "Japan", "Brazil", "Netherlands"];

export default function InsightsPage() {
  const [country, setCountry] = useState("India");
  const [jobTitle, setJobTitle] = useState("");

  const { data: countryStats, error: countryError } = useQuery({
    queryKey: ["countryStats", country],
    enabled: !!country,
    queryFn: async () => {
      const res = await api.get(`/insights/country/${country}`);
      return res.data;
    },
    retry: false,
  });

  const { data: jobStats, error: jobError } = useQuery({
    queryKey: ["jobStats", country, jobTitle],
    enabled: !!country && !!jobTitle,
    queryFn: async () => {
      const res = await api.get("/insights/job_title", {
        params: { country, job_title: jobTitle },
      });
      return res.data;
    },
    retry: false,
  });

  const { data: topRoles } = useQuery({
    queryKey: ["topRoles"],
    queryFn: async () => {
      const res = await api.get("/insights/top_roles");
      return res.data;
    },
  });

  const chartData = countryStats?.salary_distribution || [];
  const countryErrMsg = countryError?.response?.data?.error;
  const jobErrMsg = jobError?.response?.data?.error;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>Salary Insights</Typography>

      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Country</InputLabel>
          <Select value={country} label="Country" onChange={(e) => setCountry(e.target.value)}>
            {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField label="Job Title" value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)} />
      </Box>

      {countryErrMsg && <Alert severity="warning" sx={{ mb: 2 }}>{countryErrMsg}</Alert>}

      {/* KPI Cards */}
      {countryStats && (
        <>
          <Typography variant="subtitle2" mb={1} color="text.secondary">
            {countryStats.total_employees} employees in {countryStats.country}
          </Typography>
          <Grid container spacing={2} mb={4}>
            {[
              { label: "Min Salary", value: countryStats.min_salary },
              { label: "Max Salary", value: countryStats.max_salary },
              { label: "Avg Salary", value: countryStats.avg_salary },
              { label: "Median Salary", value: countryStats.median_salary },
            ].map((item) => (
              <Grid size={{ xs: 6, md: 3 }} key={item.label}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2">{item.label}</Typography>
                    <Typography variant="h6">
                      {item.value != null ? Number(item.value).toLocaleString() : "—"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <Box height={300} mb={4}>
          <Typography mb={1}>Salary Distribution</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Job Title Stats */}
      {jobErrMsg && <Alert severity="warning" sx={{ mb: 2 }}>{jobErrMsg}</Alert>}
      {jobStats && (
        <Box mb={4}>
          <Typography variant="h6">
            {jobStats.job_title} in {jobStats.country}
          </Typography>
          <Typography>
            {jobStats.total_employees} employees · Avg Salary: {Number(jobStats.avg_salary).toLocaleString()}
          </Typography>
        </Box>
      )}

      {/* Top Paying Roles */}
      {topRoles && topRoles.length > 0 && (
        <Box>
          <Typography variant="h6" mb={1}>Top Paying Roles</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell align="right">Avg Salary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topRoles.map((role, i) => (
                <TableRow key={role.job_title}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{role.job_title}</TableCell>
                  <TableCell align="right">{Number(role.avg_salary).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
