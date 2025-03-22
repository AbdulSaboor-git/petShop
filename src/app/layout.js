"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./reduxProvider";
import { useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SWRConfig } from "swr"; // Import SWRConfig
import { swrOptions } from "@/lib/swrConfig"; // Import global SWR configuration

const inter = Inter({ subsets: ["latin"] });

// Define a theme object
const theme = createTheme({
  palette: {
    mode: "light", // or 'dark'
    primary: {
      main: "#f97316",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
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
          <ThemeProvider theme={theme}>
            {/* Wrap the app with SWRConfig */}
            <SWRConfig value={swrOptions}>{children}</SWRConfig>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
