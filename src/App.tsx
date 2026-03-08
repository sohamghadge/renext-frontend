import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ToastNotifications } from '@/components/common/ToastNotifications';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Profile';
import { UserList } from '@/pages/users/UserList';
import { useAuth } from '@/hooks/useAuth';
import RERegistration from '@/pages/functions/RERegistration';
import SaleTransaction from '@/pages/functions/SaleTransaction';
import RentalTransaction from '@/pages/functions/RentalTransaction';
import DevelopmentPermit from '@/pages/functions/DevelopmentPermit';
import DisputeResolution from '@/pages/functions/DisputeResolution';
import FinancialIntelligence from '@/pages/functions/FinancialIntelligence';
import AnalysisHub from '@/pages/functions/AnalysisHub';
import InvestorPortal from '@/pages/functions/InvestorPortal';
import RERecordsEntity from '@/pages/entities/RERecords';
import OwnershipRecords from '@/pages/entities/OwnershipRecords';
import SaleTransactionRecords from '@/pages/entities/SaleTransactionRecords';
import RentalTransactionRecords from '@/pages/entities/RentalTransactionRecords';
import DisputeRecords from '@/pages/entities/DisputeRecords';
import SalePricingRecords from '@/pages/entities/SalePricingRecords';
import RentalPricingRecords from '@/pages/entities/RentalPricingRecords';
import BrokeragePricingRecords from '@/pages/entities/BrokeragePricingRecords';
import ProjectRecords from '@/pages/entities/ProjectRecords';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userType"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />

        {/* Function routes */}
        <Route path="/functions/re-registration" element={<ProtectedRoute><RERegistration /></ProtectedRoute>} />
        <Route path="/functions/sale-transaction" element={<ProtectedRoute><SaleTransaction /></ProtectedRoute>} />
        <Route path="/functions/rental-transaction" element={<ProtectedRoute><RentalTransaction /></ProtectedRoute>} />
        <Route path="/functions/development-permit" element={<ProtectedRoute><DevelopmentPermit /></ProtectedRoute>} />
        <Route path="/functions/dispute-resolution" element={<ProtectedRoute><DisputeResolution /></ProtectedRoute>} />
        <Route path="/functions/financial-intelligence" element={<ProtectedRoute><FinancialIntelligence /></ProtectedRoute>} />
        <Route path="/functions/analysis-hub" element={<ProtectedRoute><AnalysisHub /></ProtectedRoute>} />
        <Route path="/functions/investor-portal" element={<ProtectedRoute><InvestorPortal /></ProtectedRoute>} />

        {/* Entity routes */}
        <Route path="/entities/re-records" element={<ProtectedRoute><RERecordsEntity /></ProtectedRoute>} />
        <Route path="/entities/ownership" element={<ProtectedRoute><OwnershipRecords /></ProtectedRoute>} />
        <Route path="/entities/sale-transactions" element={<ProtectedRoute><SaleTransactionRecords /></ProtectedRoute>} />
        <Route path="/entities/rental-transactions" element={<ProtectedRoute><RentalTransactionRecords /></ProtectedRoute>} />
        <Route path="/entities/disputes" element={<ProtectedRoute><DisputeRecords /></ProtectedRoute>} />
        <Route path="/entities/sale-pricing" element={<ProtectedRoute><SalePricingRecords /></ProtectedRoute>} />
        <Route path="/entities/rental-pricing" element={<ProtectedRoute><RentalPricingRecords /></ProtectedRoute>} />
        <Route path="/entities/brokerage-pricing" element={<ProtectedRoute><BrokeragePricingRecords /></ProtectedRoute>} />
        <Route path="/entities/project-records" element={<ProtectedRoute><ProjectRecords /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <>
      <AppRoutes />
      <ToastNotifications />
    </>
  );
}

export default App;
