import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Salary Manager
        </Typography>

        <Button
          color={location.pathname === "/" ? "secondary" : "inherit"}
          variant={location.pathname === "/" ? "contained" : "text"}
          onClick={() => navigate("/")}
        >
          Employees
        </Button>

        <Button
          color={location.pathname === "/insights" ? "secondary" : "inherit"}
          variant={location.pathname === "/insights" ? "contained" : "text"}
          onClick={() => navigate("/insights")}
        >
          Insights
        </Button>
      </Toolbar>
    </AppBar>
  );
}