import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function InsightsPage() {
  const [country, setCountry] = useState("India");
  const [jobTitle, setJobTitle] = useState("");

  const { data: countryStats } = useQuery({
    queryKey: ["countryStats", country],
    queryFn: async () => {
      const res = await api.get(`/insights/country/${country}`);
      return res.data;
    },
  });

  const { data: jobStats } = useQuery({
    queryKey: ["jobStats", country, jobTitle],
    enabled: !!jobTitle,
    queryFn: async () => {
      const res = await api.get("/insights/job_title", {
        params: { country, job_title: jobTitle },
      });
      return res.data;
    },
  });

  const chartData =
    countryStats?.salary_distribution || [];

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Salary Insights
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={4}>
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

      {/* KPI Cards */}
      <Grid container spacing={2} mb={4}>
        {[
          { label: "Min Salary", value: countryStats?.min_salary },
          { label: "Max Salary", value: countryStats?.max_salary },
          { label: "Avg Salary", value: countryStats?.avg_salary },
          { label: "Median Salary", value: countryStats?.median_salary },
        ].map((item) => (
          <Grid item xs={3} key={item.label}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">
                  {item.label}
                </Typography>
                <Typography variant="h6">
                  {item.value?.toLocaleString() || "-"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chart */}
      <Box height={300}>
        <Typography mb={2}>Salary Distribution</Typography>

        {chartData.length === 0 ? (
          <p>No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>

      {/* Job Stats */}
      {jobStats && (
        <Box mt={4}>
          <Typography variant="h6">Job Title Insights</Typography>
          <Typography>
            Avg Salary: {jobStats.avg_salary?.toLocaleString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
}