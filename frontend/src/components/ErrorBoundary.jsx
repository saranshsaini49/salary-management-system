import { Component } from "react";
import { Box, Typography, Button } from "@mui/material";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Box p={4} textAlign="center">
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography color="text.secondary" mb={2}>
            {this.state.error.message}
          </Typography>
          <Button variant="outlined" onClick={() => this.setState({ error: null })}>
            Try Again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
