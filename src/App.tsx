/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HRMProvider } from './context/HRMContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { AuthModal } from './components/auth/AuthModal';

// Employee components
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { AttendanceModule } from './components/employee/AttendanceModule';
import { LeaveModule } from './components/employee/LeaveModule';
import { TrainingModule } from './components/employee/TrainingModule';
import { ProfileModule } from './components/employee/ProfileModule';
import { PerformanceView } from './components/employee/PerformanceView';

// Manager components
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { TeamLeaveReview } from './components/manager/TeamLeaveReview';
import { TeamAttendance } from './components/manager/TeamAttendance';
import { TeamMembers } from './components/manager/TeamMembers';
import { PerformanceReviewModule } from './components/manager/PerformanceReviewModule';

// HR components
import { HRDashboard } from './components/hr/HRDashboard';
import { EmployeeManagement } from './components/hr/EmployeeManagement';
import { AttendanceTracker } from './components/hr/AttendanceTracker';
import { LeaveManagement } from './components/hr/LeaveManagement';
import { AnnouncementsModule } from './components/hr/AnnouncementsModule';
import { ReportsAnalytics } from './components/hr/ReportsAnalytics';

const AppContent: React.FC = () => {
  const { role, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // When role changes, default back to 'dashboard' if the tab isn't available
  useEffect(() => {
    setActiveTab('dashboard');
  }, [role]);

  const renderActiveModule = () => {
    if (role === 'hr') {
      switch (activeTab) {
        case 'dashboard':
          return <HRDashboard onNavigateTab={setActiveTab} />;
        case 'employees':
          return <EmployeeManagement />;
        case 'attendance':
          return <AttendanceTracker />;
        case 'leaves':
          return <LeaveManagement />;
        case 'announcements':
          return <AnnouncementsModule />;
        case 'trainings':
          return <TrainingModule />;
        case 'reports':
          return <ReportsAnalytics />;
        default:
          return <HRDashboard onNavigateTab={setActiveTab} />;
      }
    }

    if (role === 'manager') {
      switch (activeTab) {
        case 'dashboard':
          return <ManagerDashboard onNavigateTab={setActiveTab} />;
        case 'team':
          return <TeamMembers onReviewEmployee={() => setActiveTab('performance')} />;
        case 'leaves':
          return <TeamLeaveReview />;
        case 'attendance':
          return <TeamAttendance />;
        case 'performance':
          return <PerformanceReviewModule />;
        case 'trainings':
          return <TrainingModule />;
        case 'announcements':
          return <AnnouncementsModule />;
        default:
          return <ManagerDashboard onNavigateTab={setActiveTab} />;
      }
    }

    // Default Employee view
    switch (activeTab) {
      case 'dashboard':
        return <EmployeeDashboard onNavigateTab={setActiveTab} />;
      case 'attendance':
        return <AttendanceModule />;
      case 'leaves':
        return <LeaveModule />;
      case 'trainings':
        return <TrainingModule />;
      case 'announcements':
        return <AnnouncementsModule />;
      case 'performance':
        return <PerformanceView />;
      case 'profile':
        return <ProfileModule />;
      default:
        return <EmployeeDashboard onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Mobile Hamburger Drawer if needed */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden bg-slate-900/60 backdrop-blur-sm">
            <div className="w-64 bg-slate-900 h-full">
              <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Mobile Tab Indicator & Menu Toggle */}
          <div className="md:hidden flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200 text-slate-800"
            >
              ☰ Menu
            </button>
            <span className="text-xs font-bold text-slate-700 capitalize">
              {activeTab.replace('_', ' ')}
            </span>
          </div>

          {/* Render Active View */}
          <div className="transition-all duration-150 animate-in fade-in">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* Auth Modal for signing in with custom user or registering */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HRMProvider>
        <AppContent />
      </HRMProvider>
    </AuthProvider>
  );
}
