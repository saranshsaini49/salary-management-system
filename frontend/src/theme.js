import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#6C47FF" },
    secondary: { main: "#10b981" },
    background: { default: "#f8f9fb", paper: "#ffffff" },
    text: { primary: "#1e293b", secondary: "#64748b" },
    error: { main: "#ef4444" },
    warning: { main: "#f59e0b" },
    success: { main: "#10b981" },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 500, color: "#64748b" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: "8px 20px" },
        sizeSmall: { padding: "4px 12px", fontSize: "0.8125rem" },
        containedPrimary: {
          boxShadow: "0 1px 3px rgba(108, 71, 255, 0.3)",
          "&:hover": { boxShadow: "0 4px 12px rgba(108, 71, 255, 0.35)" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: "#e2e8f0" },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 600,
            color: "#475569",
            backgroundColor: "#f8fafc",
            borderBottom: "2px solid #e2e8f0",
            fontSize: "0.8125rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: "#f1f5f9" },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { borderBottom: 0 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: "0.75rem" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            fontWeight: 500,
            "&.Mui-selected": {
              backgroundColor: "#6C47FF",
              color: "#fff",
              "&:hover": { backgroundColor: "#5a3ad9" },
            },
          },
        },
      },
    },
  },
});

export default theme;
