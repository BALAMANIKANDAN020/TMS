import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DepartmentPage from './pages/DepartmentPage';
import ProgrammePage from './pages/ProgrammePage';
import BlockPage from './pages/BlockPage';
import RoomPage from './pages/RoomPage';
import RolePage from './pages/RolePage';
import UserPage from './pages/UserPage';
import RaiseComplaintPage from './pages/RaiseComplaintPage';
import ComplaintsListPage from './pages/ComplaintsListPage';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/departments" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <DepartmentPage />
          </ProtectedRoute>
        } />

        <Route path="/programmes" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <ProgrammePage />
          </ProtectedRoute>
        } />

        <Route path="/blocks" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <BlockPage />
          </ProtectedRoute>
        } />

        <Route path="/rooms" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <RoomPage />
          </ProtectedRoute>
        } />

        <Route path="/roles" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <RolePage />
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <UserPage />
          </ProtectedRoute>
        } />

        <Route path="/raise-complaint" element={
          <ProtectedRoute allowedRoles={['SuperAdmin', 'User']}>
            <RaiseComplaintPage />
          </ProtectedRoute>
        } />

        <Route path="/complaints" element={
          <ProtectedRoute>
            <ComplaintsListPage />
          </ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['SuperAdmin', 'User']}>
            <ReportPage />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
