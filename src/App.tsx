import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { GraphQLProvider } from './components/providers/GraphQLProvider'
import { MainLayout } from './components/templates/MainLayout'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import ReportsPage from './pages/ReportsPage'
import CalendarPage from './pages/CalendarPage'
import TestRolesPage from './pages/TestRolesPage'
import DebugPage from './pages/DebugPage'
import EntryPage from './pages/EntryPage'

function App() {
  return (
    <GraphQLProvider>
      <MainLayout>
        <Routes>
          {/* Main dashboard route - migrated from Qwik routes/index.tsx */}
          <Route path="/" element={<DashboardPage />} />
          
          {/* Legacy home page available at /home for reference */}
          <Route path="home" element={<HomePage />} />
          
          {/* Other application routes */}
          <Route path="reports/*" element={<ReportsPage />} />
          <Route path="calendar/*" element={<CalendarPage />} />
          <Route path="test-roles/*" element={<TestRolesPage />} />
          <Route path="debug/*" element={<DebugPage />} />
          <Route path="entry/*" element={<EntryPage />} />
        </Routes>
      </MainLayout>
    </GraphQLProvider>
  )
}

export default App 