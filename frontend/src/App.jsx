import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import EmployeesPage from "./pages/EmployeesPage";
import InsightsPage from "./pages/InsightsPage";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<EmployeesPage />} />
              <Route path="/insights" element={<InsightsPage />} />
            </Routes>
          </ErrorBoundary>
        </Container>
      </Box>
    </BrowserRouter>
  );
}

export default App;
