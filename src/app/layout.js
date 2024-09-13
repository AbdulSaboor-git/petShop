"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./reduxProvider";
import { useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Import createTheme

const inter = Inter({ subsets: ["latin"] });

// Define a theme object
const theme = createTheme({
  palette: {
    // Define your color palette here
    mode: 'light', // or 'dark'
    primary: {
      main: '#f97316', // Example primary color
    },
    // Add other palette settings as needed
  },
  typography: {
    // Customize typography if needed
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove uppercase transformation
        },
      },
    },
    // You can override other components here
  },
});

export default function RootLayout({ children }) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem("theme"));
    const scheme = localStorage.getItem("colorScheme");
    if (theme !== null) {
      document.documentElement.setAttribute(
        "data-theme",
        theme ? "light" : "dark"
      );
    }
    if (scheme !== null) {
      document.documentElement.setAttribute("color-scheme", scheme);
    }
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {/* Pass the defined theme to ThemeProvider */}
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
