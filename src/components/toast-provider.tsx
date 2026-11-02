"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          border: "1px solid #e8eee8",
          borderRadius: "14px",
          background: "#fff",
          color: "#1d3326",
          fontFamily: "var(--font-bangla), sans-serif",
        },
      }}
    />
  );
}
