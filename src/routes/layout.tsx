import React from "react";
import { Outlet } from "react-router-dom";
import { MainLayout } from "~/components/templates";

/**
 * Route layout that uses MainLayout template
 * In React Router, this serves as a layout wrapper for nested routes
 */
export default function Layout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
} 