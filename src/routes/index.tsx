import React from 'react';
import { HomePage } from "~/components/pages";

/**
 * Main route component that renders the HomePage
 * Routes should be simple and just render the appropriate page component
 */
export default function IndexPage() {
  return <HomePage />;
}

// React Router doesn't use head exports like Qwik
// Document head management will be handled by React Helmet or similar
