import { Component } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Box display="flex" justifyContent="center" py={8}>
          <Paper variant="outlined" sx={{ p: 4, textAlign: "center", maxWidth: 400 }}>
            <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>Something went wrong</Typography>
            <Typography color="text.secondary" mb={3} variant="body2">
              {this.state.error.message}
            </Typography>
            <Button variant="contained" onClick={() => this.setState({ error: null })}>
              Try Again
            </Button>
          </Paper>
        </Box>
      );
    }
    return this.props.children;
  }
}
