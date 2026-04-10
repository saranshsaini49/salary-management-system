import { AppBar, Toolbar, Button, Typography, Box, Container } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Employees", path: "/" },
  { label: "Insights", path: "/insights" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", mr: 4 }}
            onClick={() => navigate("/")}
          >
            <Box
              sx={{
                width: 32, height: 32, borderRadius: 2,
                background: "linear-gradient(135deg, #6C47FF 0%, #9f7aea 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 14,
              }}
            >
              SM
            </Box>
            <Typography variant="h6" sx={{ color: "text.primary", fontSize: "1.1rem" }}>
              Salary Manager
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: active ? "primary.main" : "text.secondary",
                    bgcolor: active ? "rgba(108, 71, 255, 0.08)" : "transparent",
                    fontWeight: active ? 600 : 500,
                    borderRadius: 2,
                    px: 2,
                    "&:hover": {
                      bgcolor: active ? "rgba(108, 71, 255, 0.12)" : "action.hover",
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
