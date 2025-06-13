import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { GraphQLProvider } from './components/providers/GraphQLProvider'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ReportsPage from './pages/ReportsPage'
import CalendarPage from './pages/CalendarPage'
import TestRolesPage from './pages/TestRolesPage'
import DebugPage from './pages/DebugPage'
import EntryPage from './pages/EntryPage'

function App() {
  return (
    <GraphQLProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="reports/*" element={<ReportsPage />} />
          <Route path="calendar/*" element={<CalendarPage />} />
          <Route path="test-roles/*" element={<TestRolesPage />} />
          <Route path="debug/*" element={<DebugPage />} />
          <Route path="entry/*" element={<EntryPage />} />
        </Route>
      </Routes>
    </GraphQLProvider>
  )
}

export default App 