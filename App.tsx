import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HabitManager from './pages/HabitManager';
import Reports from './pages/Reports';

// NOTE: Using HashRouter for compatibility with static file hosting and Capacitor environments easily.
// In a full implementation with server-side routing (Next.js), BrowserRouter would be preferred.

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="habits" element={<HabitManager />} />
          <Route path="reports" element={<Reports />} />
          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;